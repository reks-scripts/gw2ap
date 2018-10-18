'use strict'

// Load modules
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
  return result.json()
}

const getByIds = async (what, ids, batchSize) => {
  batchSize = batchSize || 0
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

const getTotalProgress = (achievement, progress) => {
  let result = 0
  if (progress.done) {
    return 100
  }
  _.forEach(achievement.tiers, tier => {
    if (tier.count > progress.current ) {
      result = _.round(progress.current / tier.count * 100, 1)
    }
  })
  // check for repeatable achievement
  if (achievement.flags.includes('Repeatable')) {
    // get total AP for doing achievement once
    let totalAp = 0
    _.forEach(achievement.tiers, tier => {
      totalAp += tier.points
    })
    // find how many times need for all AP
    let repeatable = achievement.point_cap / totalAp
    // calculate total progress
    if (progress.repeated) {
      result = _.round(progress.repeated / repeatable * 100, 1)
    }
    else {
      result = 0
    }
  }
  return result
}

const getTierProgress = (achievement, progress) => {
  let result = 0
  if (progress.done) {
    return 100
  }
  _.forEach(achievement.tiers, tier => {
    if (tier.count > progress.current ) {
      result = _.round(progress.current / tier.count * 100, 1)
      return false
    }
  })
  return result
}

const getNextTierAP = (achievement, progress) => {
  let result = 0
  if (progress.done) {
    return result
  }
  _.forEach(achievement.tiers, tier => {
    if (tier.count > progress.current ) {
      result = tier.points
      return false
    }
  })
  return result
}

const getRemainingAP = (achievement, progress) => {
  let result = 0
  if (progress.done) {
    return result
  }
  _.forEach(achievement.tiers, tier => {
    if (tier.count > progress.current ) {
      result += tier.points
    }
  })
  // check for repeatable achievement
  if (achievement.flags.includes('Repeatable')) {
    // get total AP for doing achievement once
    let totalAp = 0
    _.forEach(achievement.tiers, tier => {
      totalAp += tier.points
    })
    // calculate how many AP player has earned by repeating
    let repeatAp = 0
    if (progress.repeated) {
      repeatAp = totalAp * progress.repeated
    }
    // update result with remaining AP
    result = achievement.point_cap - repeatAp
  }
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

const getAchievementProgressByID = (myAchievements, id) => {
  let result = {}
  _.forEach(myAchievements, myAchievement => {
    if (myAchievement.id === id) {
      result = myAchievement
      return false
    }
  })
  return result
}

const flattenAchievement = (achievement, progress) => {
  const result = {}
  result.tierProgress = getTierProgress(achievement, progress)
  result.name = achievement.name
  result.nextTierAP = getNextTierAP(achievement, progress)
  result.totalProgress = getTotalProgress(achievement, progress)
  result.remainingAP = getRemainingAP(achievement, progress)
  result.rewards = getRewards(achievement)
  result.flags = getFlags(achievement)
  result.description = achievement.description
  result.requirement = achievement.requirement
  result.category = achievement.category
  result.group = achievement.group
  result.type = achievement.type
  result.id = achievement.id
  return result
}

/* eslint-disable */
const possibleResults = {  
  "types":[  
     "Default",
     "ItemSet"
  ],
  "flags":[  
     "Permanent",
     "Pvp",
     "CategoryDisplay",
     "RepairOnLogin",
     "Hidden",
     "MoveToTop",
     "IgnoreNearlyComplete",
     "Repeatable",
     "RequiresUnlock",
     "Daily"
  ],
  "rewards":[  
     null,
     "Title",
     "Mastery",
     "Item",
     "Coins"
  ]
}
/* eslint-enable */

const Cache = {}

Cache.getAchievementGroups = async () => {
  const groupIds = await fetch(GW2_API.URLS.ACHIEVEMENTS_GROUPS)
  const groups = await getByIds(GW2_API.URLS.ACHIEVEMENTS_GROUPS, groupIds)
  // don't include dailies
  _.forEach(groups, (group, key) => {
    if (group.id === GW2_API.DAILY_GROUP_ID) {
      groups.splice(key, 1)
      return false
    }
  })
  return _.orderBy(groups, group => {
    return group.order 
  })
}

Cache.getAchievementCategories = async () => {
  const categoryIds = await fetch(GW2_API.URLS.ACHIEVEMENTS_CATEGORIES)
  const categories = await getByIds(GW2_API.URLS.ACHIEVEMENTS_CATEGORIES, categoryIds)
  return categories
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
          return false
        }
      })
    })
  })
  return results
}

const getAchievementsWithCategories = async (request, h) => {
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
          return false
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