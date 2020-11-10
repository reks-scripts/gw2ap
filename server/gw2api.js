'use strict'

// Load modules
const { Cache, API } = require('./services')

module.exports = {
  name: 'gw2api',
  version: '1.0.0',
  register: async server => {

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
    server.route({
      method: 'GET',
      path: '/api/achievements',
      handler: API.getAchievementsWithCategories
    })
  }
}