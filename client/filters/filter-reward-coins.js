'use strict'

// Load modules
import { Filter, FILTER_GROUPS } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterCoins extends Filter {
  constructor() {
    super(FILTER_GROUPS.REWARDS)
    this.filter = (settings, data, dataIndex) => {
      let match = false
      const rewards = data[COLUMNS.REWARDS.INDEX]
      if (rewards && rewards.length) {
        return rewards.includes('Coins')
      } else {
        return false
      }
    }
  }
}

const _filterCoins = new FilterCoins()
const filterCoins = _filterCoins.action.bind(_filterCoins)
export { filterCoins }
