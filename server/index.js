'use strict'

// Load modules
const Path = require('path')
const Hapi = require('hapi')
const Inert = require('inert')
const HapiGate = require('hapi-gate')
const Memory = require('catbox-memory')
const Routes = require('./routes')
const ApiCacheRoutes = require('./apiCache')

// Declare internals
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
  // plugins
  await server.register(Inert)
  await server.register({
    plugin: HapiGate,
    options: {
      https: false,
      nonwww: true
    }
  })
  await server.register({
    plugin: ApiCacheRoutes
  })

  // routes
  await server.route(Routes)

  // cache
  await server.cache.provision({ engine: Memory, name: 'gw2ap' })

  await server.start()
  // eslint-disable-next-line
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line
  console.log(err)
  process.exit(1)
})

provision()