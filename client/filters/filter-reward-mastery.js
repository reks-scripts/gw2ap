'use strict'

// Load modules
import { Filter, FILTER_BUTTON_GROUPS } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterMastery extends Filter {
  constructor() {
    super(FILTER_BUTTON_GROUPS.REWARDS)
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
