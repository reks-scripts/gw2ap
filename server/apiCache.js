'use strict'

// Load modules
const { Cache, API } = require('./gw2api')

// Declare internals
const internals = {}  // eslint-disable-line

const ApiCache = {
  name: 'ApiCache',
  version: '1.0.0',
  // eslint-disable-next-line
  register: async function (server, options) {

    server.method('Cache.getAchievementGroups', Cache.getAchievementGroups, {
      cache: {
        expiresIn: 24 * 60 * 60 * 1000,
        generateTimeout: 30 * 1000
      }
    })
    server.method('Cache.getAchievementCategories', Cache.getAchievementCategories, {
      cache: {
        expiresIn: 24 * 60 * 60 * 1000,
        generateTimeout: 30 * 1000
      }
    })
    server.method('Cache.getAchievements', Cache.getAchievements, {
      cache: {
        expiresIn: 24 * 60 * 60 * 1000,
        generateTimeout: 30 * 1000
      }
    })

    server.route({
      method: 'GET',
      path: '/api/achievements/groups',
      handler: API.getGroups
    })
    server.route({
      method: 'GET',
      path: '/api/achievements/categories',
      handler: API.getCategories
    })
    server.route({
      method: 'GET',
      path: '/api/achievements/{apiKey}',
      handler: API.processAchievements
    })
  }
}

module.exports = ApiCache