'use strict'

// Browser-safe API helper

// eslint-disable-next-line
const API_URL = IS_DEV ? 'http://localhost:8080/' : ''
const GW2_API = 'https://api.guildwars2.com/v2/'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const fetchJson = async (url, options = {}, retry = true) => {
  const result = await fetch(url, options)

  if (result.ok) {
    return result.json()
  }

  let errorBody
  try {
    errorBody = await result.json()
  } catch (e) {
    errorBody = {}
  }

  // Retry once on 503 (same behavior you had before)
  if (result.status === 503 && retry) {
    return fetchJson(url, options, false)
  }

  throw new ApiError(
    errorBody.text || errorBody.message || 'Bad Request',
    result.status
  )
}

const API = {}

API.getGroups = async () => {
  return fetchJson(`${API_URL}api/achievements/groups`)
}

API.getCategories = async () => {
  return fetchJson(`${API_URL}api/achievements/categories`)
}

API.getAchievements = async apiKey => {
  return fetchJson(`${API_URL}api/achievements/${apiKey}`)
}

API.getSkin = async id => {
  return fetchJson(`${GW2_API}skins/${id}`)
}

API.getItem = async id => {
  return fetchJson(`${GW2_API}items/${id}`)
}

API.getTitle = async id => {
  return fetchJson(`${GW2_API}titles/${id}`)
}

export default API
