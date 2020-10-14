'use strict'

// Load modules
import Fetch from 'node-fetch'
import Boom from 'boom'

// eslint-disable-next-line
const API_URL = IS_DEV ? 'http://localhost:3000/' : ''

const fetch = async (url, options) => {
  options = options || {}
  const result = await Fetch(url, options)
  if (result.ok) {
    return result.json()
  }
  else {
    const error = await result.json()
    throw Boom.badRequest(error.text || error.message || 'Bad Request')
  }
}

const API = {}
  
API.getGroups = async () => {
  const url = `${API_URL}api/achievements/groups`
  return fetch(url)
}
  
API.getCategories = async () => {
  const url = `${API_URL}api/achievements/categories`
  return fetch(url)
}
  
API.getAchievements = async apiKey => {
  const url = `${API_URL}api/achievements/${apiKey}`
  return fetch(url)
}
  
API.getSkin = async id => {
  const url = `https://api.guildwars2.com/v2/skins/${id}`
  return fetch(url)
}
  
API.getItem = async id => {
  const url = `https://api.guildwars2.com/v2/items/${id}`
  return fetch(url)
}

API.getTitle = async id => {
  const url = `https://api.guildwars2.com/v2/titles/${id}`
  return fetch(url)
}

export { API }