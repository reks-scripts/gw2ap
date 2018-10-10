'use strict'

const Path = require('path')
const Hapi = require('hapi')
const Inert = require('inert')
const HapiGate = require('hapi-gate')
const processAchievements = require('./gw2api')

const server = Hapi.server({
  port: process.env.port || 3000,
  routes: {
    cors: true,
    files: {
      relativeTo: Path.join(__dirname, '../')
    }
  }
})

const provision = async () => {
  await server.register(Inert)
  await server.register({
    plugin: HapiGate,
    options: {
      https: true,
      www: true
    }
  })

  server.route({
    method: 'GET',
    path: '/api/achievements/{apiKey}',
    handler: function (request, h) {
      return processAchievements(request.params.apiKey)
    }
  })
  
  server.route({
    method: 'GET',
    path: '/assets/images/{path*}',
    handler: {
      directory: {
        path: './assets/images/'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './dist',
        redirectToSlash: true,
        index: true,
      }
    }
  })

  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {

  console.log(err)
  process.exit(1)
})

provision()