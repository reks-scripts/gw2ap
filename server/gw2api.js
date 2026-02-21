'use strict';

// Load modules
const { Cache, API } = require('./services');
const CACHE_GENERATE_TIMEOUT_MS = 3 * 60 * 1000;
const PREWARM_CACHE_ON_START = process.env.PREWARM_CACHE_ON_START !== 'false';

const createCachePrewarm = server => {
  const state = {
    isReady: false,
    inFlight: null,
    lastError: null
  };

  const run = () => {
    if (state.isReady) {
      return Promise.resolve();
    }
    if (state.inFlight) {
      return state.inFlight;
    }

    state.lastError = null;
    state.inFlight = Promise.all([
      server.methods.Cache.getAchievementGroups(),
      server.methods.Cache.getAchievementCategories(),
      server.methods.Cache.getAchievements()
    ])
      .then(() => {
        state.isReady = true;
      })
      .catch(error => {
        state.lastError = error;
        throw error;
      })
      .finally(() => {
        state.inFlight = null;
      });

    return state.inFlight;
  };

  const waitForInFlight = async () => {
    if (state.inFlight) {
      await state.inFlight;
    }
  };

  return {
    run,
    waitForInFlight
  };
};

const withCachePrewarmGuard = handler => {
  return async (request, h) => {
    const prewarm = request.server.app.cachePrewarm;
    if (prewarm) {
      try {
        await prewarm.waitForInFlight();
      }
      catch (error) {
        request.server.log(['warn', 'cache'], {
          message: 'Cache prewarm failed while awaiting in request',
          error: error.message
        });
      }
    }
    return handler(request, h);
  };
};

module.exports = {
  name: 'gw2api',
  version: '1.0.0',
  register: async server => {

    server.method('Cache.getAchievementGroups', Cache.getAchievementGroups, {
      cache: {
        expiresIn: 24 * 60 * 60 * 1000,
        generateTimeout: CACHE_GENERATE_TIMEOUT_MS
      }
    });
    server.method('Cache.getAchievementCategories', Cache.getAchievementCategories, {
      cache: {
        expiresIn: 24 * 60 * 60 * 1000,
        generateTimeout: CACHE_GENERATE_TIMEOUT_MS
      }
    });
    server.method('Cache.getAchievements', Cache.getAchievements, {
      cache: {
        expiresIn: 24 * 60 * 60 * 1000,
        generateTimeout: CACHE_GENERATE_TIMEOUT_MS
      }
    });
    const cachePrewarm = createCachePrewarm(server);
    server.app.cachePrewarm = cachePrewarm;

    if (PREWARM_CACHE_ON_START) {
      server.ext('onPostStart', () => {
        cachePrewarm.run().catch(error => {
          server.log(['warn', 'cache'], {
            message: 'Cache prewarm failed on startup',
            error: error.message
          });
        });
      });
    }

    server.route({
      method: 'GET',
      path: '/api/achievements/groups',
      handler: API.getGroups
    });
    server.route({
      method: 'GET',
      path: '/api/achievements/categories',
      handler: API.getCategories
    });
    server.route({
      method: 'GET',
      path: '/api/achievements/{apiKey}',
      handler: withCachePrewarmGuard(API.processAchievements)
    });
    server.route({
      method: 'GET',
      path: '/api/achievements',
      handler: withCachePrewarmGuard(API.getAchievementsWithCategories)
    });
  }
};
