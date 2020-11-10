'use strict'

module.exports = [
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
      return h.file('./assets/favicon.ico')
    }
  },
  {
    method: 'GET',
    path: '/browserconfig.xml',
    handler: function (request, h) {
      return h.file('./assets/browserconfig.xml')
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