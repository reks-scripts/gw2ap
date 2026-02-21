'use strict'

// Load modules
const Path = require('path')
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const CatboxMemory = require('@hapi/catbox-memory')
const Routes = require('./routes')
const GW2API = require('./gw2api')

// Declare internals
const server = Hapi.server({
  port: process.env.PORT || 8080,
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
    plugin: GW2API
  })

  // redirect www -> non-www (equivalent to prior hapi-gate nonwww behavior)
  server.ext('onRequest', (request, h) => {
    const forwardedHost = request.headers['x-forwarded-host']
    const hostHeader = (forwardedHost || request.headers.host || '').split(',')[0].trim()

    if (!hostHeader) {
      return h.continue
    }

    let hostname = hostHeader
    let port = ''

    if (hostHeader.startsWith('[')) {
      const endBracketIndex = hostHeader.indexOf(']')
      if (endBracketIndex > -1) {
        hostname = hostHeader.slice(0, endBracketIndex + 1)
        if (hostHeader[endBracketIndex + 1] === ':') {
          port = hostHeader.slice(endBracketIndex + 1)
        }
      }
    } else {
      const lastColonIndex = hostHeader.lastIndexOf(':')
      if (lastColonIndex > -1 && hostHeader.indexOf(':') === lastColonIndex) {
        hostname = hostHeader.slice(0, lastColonIndex)
        port = hostHeader.slice(lastColonIndex)
      }
    }

    if (!/^www\./i.test(hostname)) {
      return h.continue
    }

    const protocol = (request.headers['x-forwarded-proto'] || request.server.info.protocol || 'http').split(',')[0].trim()
    const targetHost = hostname.replace(/^www\./i, '') + port
    const pathname = request.url.pathname || ''
    const search = request.url.search || ''
    return h.redirect(`${protocol}://${targetHost}${pathname}${search}`).permanent().takeover()
  })

  // routes
  await server.route(Routes)

  // cache
  await server.cache.provision({
    provider: {
      constructor: CatboxMemory
    },
    name: 'gw2ap'
  })

  await server.start()
  // eslint-disable-next-line
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
  // eslint-disable-next-line
  console.log(err)
  process.exit(1)
})
