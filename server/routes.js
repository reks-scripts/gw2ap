'use strict'

const isProd = process.env.NODE_ENV === 'production'

const routes = []

if (isProd) {
  routes.push(
    {
      method: 'GET',
      path: '/assets/{path*}',
      handler: {
        directory: {
          path: './dist/assets'
        }
      }
    },
    {
      method: 'GET',
      path: '/favicon.ico',
      handler: (request, h) => h.file('./dist/favicon.ico')
    },
    {
      method: 'GET',
      path: '/browserconfig.xml',
      handler: (request, h) => h.file('./dist/browserconfig.xml')
    }
  )
}

// Always last
routes.push({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: './dist',
      redirectToSlash: true,
      index: true
    }
  }
})

module.exports = routes
