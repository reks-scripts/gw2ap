'use strict'

// Load modules
import { Filter, FILTER_GROUPS } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterTitle extends Filter {
  constructor() {
    super(FILTER_GROUPS.REWARDS)
    this.filter = (settings, data, dataIndex) => {
      let match = false
      const rewards = data[COLUMNS.REWARDS.INDEX]
      if (rewards && rewards.length) {
        return rewards.includes('Title')
      } else {
        return false
      }
    }
  }
}

const _filterTitle = new FilterTitle()
const filterTitle = _filterTitle.action.bind(_filterTitle)
export { filterTitle }
