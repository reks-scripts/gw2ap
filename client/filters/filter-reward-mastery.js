'use strict'

// Load modules
import { Filter, FILTER_GROUPS } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterMastery extends Filter {
  constructor() {
    super(FILTER_GROUPS.REWARDS)
    this.filter = (settings, data, dataIndex) => {
      let match = false
      const rewards = data[COLUMNS.REWARDS.INDEX]
      if (rewards && rewards.length) {
        return rewards.includes('Mastery')
      } else {
        return false
      }
    }
  }
}

const _filterMastery = new FilterMastery()
const filterMastery = _filterMastery.action.bind(_filterMastery)
export { filterMastery }
