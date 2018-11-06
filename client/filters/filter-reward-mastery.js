'use strict'

// Load modules
import { Filter } from './filter'
import { COLUMNS } from '../../config/column-definitions'

class FilterMastery extends Filter {
  constructor() {
    super()
    // eslint-disable-next-line
    this.filter = (settings, data, dataIndex) => {
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
