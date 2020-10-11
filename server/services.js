'use strict'

// Load modules
const Boom = require('boom')
const Fetch = require('node-fetch')
const _ = require('lodash')

// Declare internals
const BASE_API = 'https://api.guildwars2.com/v2/'

const GW2_API = {
  MAX_BATCH_SIZE: 200,
  DAILY_GROUP_ID: '18DB115A-8637-4290-A636-821362A3C4A8',
  URLS: {
    ACCOUNT: `${BASE_API}account`,
    ACCOUNT_ACHIEVEMENTS: `${BASE_API}account/achievements`,
    ACHIEVEMENTS: `${BASE_API}achievements`,
    ACHIEVEMENTS_GROUPS: `${BASE_API}achievements/groups`,
    ACHIEVEMENTS_CATEGORIES: `${BASE_API}achievements/categories`
  }
}

/* eslint-disable */
const log = data => {
  console.log(JSON.stringify(data, null, 2))
}
/* eslint-enable */

const getAuthHeader = apiKey => {
  return { 
    headers: { 'Authorization': 'Bearer ' + apiKey }
  }
}

const fetch = async (url, options) => {
  options = options || {}
  const result = await Fetch(url, options)
  if (result.ok) {
    return result.json()
  }
  else {
    const error = await result.json()
    throw Boom.badRequest(error.text || 'Bad Request')
  }
}

const getByIds = async (what, ids, batchSize = 0) => {
  const promises = []
  
  let id, promise
  while(ids.length) {
    if (batchSize > 1) {
      id = ids.splice(0, batchSize)
      promise = fetch(`${what}?ids=${id.toString()}`)
    }
    else {
      id = ids.splice(0, 1)
      promise = fetch(`${what}/${id.toString()}`)
    }
    promises.push(promise)
  }

  const batches = await Promise.all(promises)

  let result = []
  _.forEach(batches, batch => {
    result = result.concat(batch)
  })
  return result
}

const repeatable = achievement => {
  if (achievement.flags.includes('Repeatable')) {
    return _.round(achievement.point_cap / achievement.tiers[0].points)
  }
  return 0
}

const isDone = (achievement, progress) => {
  if (progress.done) {
    return true
  }
  if (progress.repeated && progress.repeated >= repeatable(achievement)) {
    return true
  }
  return false
}

const getTotalProgress = (achievement, progress) => {
  let result = 0
  if (isDone(achievement, progress)) {
    return 100
  }
  if (repeatable(achievement)) {
    if (progress.repeated) {
      return _.round(progress.repeated / repeatable(achievement) * 100, 1)
    } else {
      return 0
    }
  }
  _.forEach(achievement.tiers, tier => {
    if (tier.count > progress.current ) {
      result = _.round(progress.current / tier.count * 100, 1)
    }
  })

  return result
}

const getTierProgress = (achievement, progress) => {
  let result = 0
  if (isDone(achievement, progress)) {
    return 100
  }
  _.forEach(achievement.tiers, tier => {
    if (tier.count > progress.current ) {
      result = _.round(progress.current / tier.count * 100, 1)
      return false // break
    }
  })
  return result
}

const getNextTierAP = (achievement, progress) => {
  let result = 0
  if (isDone(achievement, progress)) {
    return 0
  }
  _.forEach(achievement.tiers, tier => {
    if (!progress.current || progress.current && tier.count > progress.current) {
      result = tier.points
      return false // break
    }
  })
  return result
}

const getRemainingAP = (achievement, progress) => {
  let result = 0
  if (isDone(achievement, progress)) {
    return 0
  }
  if (repeatable(achievement)) {
    if (progress.repeated) {
      return achievement.point_cap - progress.repeated * achievement.tiers[0].points
    } else {
      return achievement.point_cap
    }
  }
  _.forEach(achievement.tiers, tier => {
    if (!progress.current || progress.current && tier.count > progress.current) {
      result += tier.points
    }
  })

  return result
}

const getRewards = achievement => {
  let result = []
  if (!achievement.rewards || !achievement.rewards.length) {
    return result
  }
  _.forEach(achievement.rewards, reward => {
    result.push(reward.type)
  })
  return result
}

const getFlags = achievement => {
  let result = []
  if (!achievement.flags || !achievement.flags.length) {
    return result
  }
  result = achievement.flags
  return result
}

const getCount = achievement => {
  let result = 1
  _.forEach(achievement.tiers, tier => {
    result = tier.count
  })
  return result
}

const getAchievementProgressByID = (myAchievements, id) => {
  let result = {}
  _.forEach(myAchievements, myAchievement => {
    if (myAchievement.id === id) {
      result = myAchievement
      return false // break
    }
  })
  return result
}

const getTiers = (achievement, progress) => {
  if (!achievement.tiers || !achievement.tiers.length) {
    return []
  }
  _.forEach(achievement.tiers, tier => {
    if (progress.current && progress.current >= tier.count) {
      tier.done = true
    }
    else {
      tier.done = false
    }
  })
  return achievement.tiers
}

const getBits = (achievement, progress) => {
  if (!achievement.bits || !achievement.bits.length) {
    return []
  }
  _.forEach(achievement.bits, (bit, index) => {
    if (progress.done || progress.bits && progress.bits.includes(index)) {
      bit.done = true
    }
    else {
      bit.done = false
    }
  })
  return achievement.bits
}

const flattenAchievement = (achievement, progress) => {
  const result = _.clone(achievement)
  result.progress = _.clone(progress)
  result.totalProgress = getTotalProgress(achievement, progress)
  result.remainingAP = getRemainingAP(achievement, progress)
  result.tierProgress = getTierProgress(achievement, progress)
  result.nextTierAP = getNextTierAP(achievement, progress)
  result.tiers = getTiers(achievement, progress)
  result.bits = getBits(achievement, progress)
  result.rewards = getRewards(achievement)
  result.flags = getFlags(achievement)
  result.count = getCount(achievement)
  return result
}


const Cache = {}

Cache.getAchievementGroups = async () => {
  const groupIds = await fetch(GW2_API.URLS.ACHIEVEMENTS_GROUPS)
  const groups = await getByIds(GW2_API.URLS.ACHIEVEMENTS_GROUPS, groupIds)
  // don't include dailies
  _.forEach(groups, (group, key) => {
    if (group.id === GW2_API.DAILY_GROUP_ID) {
      groups.splice(key, 1)
      return false // break
    }
  })
  return _.orderBy(groups, group => {
    return group.order 
  })
}

Cache.getAchievementCategories = async () => {
  const categoryIds = await fetch(GW2_API.URLS.ACHIEVEMENTS_CATEGORIES)
  const categories = await getByIds(GW2_API.URLS.ACHIEVEMENTS_CATEGORIES, categoryIds)
  return _.orderBy(categories, category => {
    return category.order 
  })
}

Cache.getAchievements = async () => {
  const achievementIds = await fetch(GW2_API.URLS.ACHIEVEMENTS)
  const achievements = await getByIds(GW2_API.URLS.ACHIEVEMENTS, achievementIds, GW2_API.MAX_BATCH_SIZE)
  return achievements
}


const API = {}

// eslint-disable-next-line
API.getGroups = async (request, h) => {
  return request.server.methods.Cache.getAchievementGroups()
}

// eslint-disable-next-line
const getCategories = API.getCategories = async (request, h) => {
  const groups = request.server.methods.Cache.getAchievementGroups()
  const categories = request.server.methods.Cache.getAchievementCategories()
  
  const promised = _.zipObject(['groups', 'categories'], await Promise.all(_.values([groups, categories])))

  const results = []
  _.forEach(promised.groups, group => {
    _.forEach(group.categories, groupCategoryId => {
      _.forEach(promised.categories, category => {
        if (category.id === groupCategoryId) {
          const result = _.clone(category)
          result.group = {
            id: group.id,
            name: group.name,
            description: group.description,
            order: group.order
          }
          results.push(result)
          return false // break
        }
      })
    })
  })
  return _.orderBy(results, ['group.order', 'order'])
}

const getAchievementsWithCategories = API.getAchievementsWithCategories = async (request, h) => {
  const categories = getCategories(request, h)
  const achievements = request.server.methods.Cache.getAchievements()  

  const promised = _.zipObject(['categories', 'achievements'], await Promise.all(_.values([categories, achievements])))

  const results = []
  _.forEach(promised.categories, category => {
    _.forEach(category.achievements, categoryAchievementId => {
      _.forEach(promised.achievements, achievement => {
        if (achievement.id === categoryAchievementId) {
          const result = _.clone(achievement)
          result.category = {
            id: category.id,
            name: category.name,
            description: category.description,
            order: category.order,
            icon: category.icon
          }
          result.group = category.group
          results.push(result)
          return false // break
        }
      })
    })
  })
  return results
}

API.processAchievements = async (request, h) => {
  const achievements = getAchievementsWithCategories(request, h)
  const myAchievements = fetch(GW2_API.URLS.ACCOUNT_ACHIEVEMENTS, getAuthHeader(request.params.apiKey))
  
  const promised = _.zipObject(['achievements', 'myAchievements'], await Promise.all(_.values([achievements, myAchievements])))
  
  const results = []
  _.forEach(promised.achievements, achievement => {
    const progress = getAchievementProgressByID(promised.myAchievements, achievement.id)
    const result = flattenAchievement(achievement, progress)
    results.push(result)
  })

  return results
}

module.exports = { 
  Cache,
  API
}