'use strict'

// Load modules
const { getAchievements, processAchievements } = require('./gw2api')

// Declare internals
const internals = {}

const routes = internals.routes = module.exports = [
  {
    method: 'GET',
    path: '/api/achievements/{apiKey}',
    handler: function (request, h) {
      return processAchievements(request.params.apiKey)
    }
  },
  {
    method: 'GET',
    path: '/api/achievements',
    handler: function (request, h) {
      return getAchievements(request.params.apiKey)
    }
  },
  {
    method: 'GET',
    path: '/assets/{path*}',
    handler: {
      directory: {
        path: './assets/'
      }
    }
  },
  {
    method: 'GET',
    path: '/favicon.ico',
    handler: function (request, h) {
        return h.file('./assets/favicon.ico');
    }
  },
  {
    method: 'GET',
    path: '/site.webmanifest',
    handler: function (request, h) {
        return h.file('./assets/site.webmanifest');
    }
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './dist',
        redirectToSlash: true,
        index: true,
      }
    }
  }
]
