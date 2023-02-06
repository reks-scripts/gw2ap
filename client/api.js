'use strict'

// Load modules
import Fetch from 'node-fetch'
import Boom from 'boom'

// eslint-disable-next-line
const API_URL = IS_DEV ? 'http://localhost:8080/' : ''
const GW2_API = 'https://api.guildwars2.com/v2/'

const fetch = async (url, options) => {
  options = options || {}
  const result = await Fetch(url, options)
  if (result.ok) {
    return result.json()
  }
  else {
    const error = await result.json()

    if (error.statusCode === 503) {
      return fetch(url, options)
    }
    else {
      throw Boom.badRequest(error.text || error.message || 'Bad Request')
    }
  }
}

const API = {}

API.getGroups = async () => {
  return fetch(`${API_URL}api/achievements/groups`)
}

API.getCategories = async () => {
  return fetch(`${API_URL}api/achievements/categories`)
}

API.getAchievements = async apiKey => {
  return fetch(`${API_URL}api/achievements/${apiKey}`)
}

API.getSkin = async id => {
  return fetch(`${GW2_API}skins/${id}`)
}

API.getItem = async id => {
  return fetch(`${GW2_API}items/${id}`)
}

API.getTitle = async id => {
  return fetch(`${GW2_API}titles/${id}`)
}

export default API