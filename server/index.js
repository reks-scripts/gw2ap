'use strict'

// Load modules
const Path = require('path')
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Catbox = require('@hapi/catbox-memory')
const HapiGate = require('hapi-gate')
const Routes = require('./routes')
const GW2API = require('./gw2api')

// Declare internals
const server = Hapi.server({
  port: process.env.port || 8080,
  routes: {
    cors: true,
    files: {
      relativeTo: Path.join(__dirname, '../')
    }
  }
})

module.exports = async () => {
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
    plugin: GW2API
  })

  // routes
  await server.route(Routes)

  // cache
  await server.cache.provision({ provider: Catbox, name: 'gw2ap' })

  await server.start()
  // eslint-disable-next-line
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
  // eslint-disable-next-line
  console.log(err)
  process.exit(1)
})