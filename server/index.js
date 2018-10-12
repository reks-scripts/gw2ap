'use strict'

// Load modules
const Path = require('path')
const Hapi = require('hapi')
const Inert = require('inert')
const HapiGate = require('hapi-gate')
const Routes = require('./routes')

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
  await server.register(Inert)
  await server.register({
    plugin: HapiGate,
    options: {
      https: false,
      nonwww: true
    }
  })
  await server.route(Routes)
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {

  console.log(err)
  process.exit(1)
})

provision()