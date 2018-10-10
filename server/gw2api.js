'use strict'

const Fetch = require('node-fetch')
const _ = require('lodash')

const BASE_API = 'https://api.guildwars2.com/v2/'

const GW2_API = {
  MAX_BATCH_SIZE: 200,
  URL: `${BASE_API}`,
  ACCOUNT: {
    URL: `${BASE_API}account`,
    ACHIEVEMENTS: {
      URL: `${BASE_API}account/achievements`
    }
  },
  ACHIEVEMENTS: {
    URL: `${BASE_API}achievements`
  }
}

const log = data => {
  console.log(JSON.stringify(data, null, 2))
}

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

const getAchievementsByBatch = async (achievementIds, batchSize) => {
  batchSize = batchSize || GW2_API.MAX_BATCH_SIZE
  const promises = []
  
  while(achievementIds.length) {
    const ids = achievementIds.splice(0, batchSize)
    const promise = fetch(`${GW2_API.ACHIEVEMENTS.URL}?ids=${ids.toString()}`)
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
  return result
}

const getRewards = achievement => {
  let result = ''
  if (!achievement.rewards || !achievement.rewards.length) {
    return result
  }
  result = []
  _.forEach(achievement.rewards, reward => {
    result.push(reward.type)
  })
  return result.join(', ')
}

const getFlags = achievement => {
  let result = ''
  if (!achievement.flags || !achievement.flags.length) {
    return result
  }
  result = achievement.flags.join(', ')
  return result
}

const sortAchievementsByProperty = (achievements, property) => {
  return _.orderBy(achievements, property, 'desc')
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
  result.type = achievement.type
  result.id = achievement.id
  return result
}

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

const processAchievements = async (apiKey) => {

  const achievementIds = await fetch(GW2_API.ACHIEVEMENTS.URL)
  const achievements = await getAchievementsByBatch(achievementIds)
  const myAchievements = await fetch(GW2_API.ACCOUNT.ACHIEVEMENTS.URL, getAuthHeader(apiKey))

  let results = []
  _.forEach(achievements, achievement => {
    const progress = getAchievementProgressByID(myAchievements, achievement.id)
    const result = flattenAchievement(achievement, progress)
    results.push(result)
  })

  return results
}

module.exports = processAchievements