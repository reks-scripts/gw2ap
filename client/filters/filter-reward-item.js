'use strict'

// Load modules
import { Filter, FILTER_GROUPS } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterItem extends Filter {
  constructor() {
    super(FILTER_GROUPS.REWARDS)
    this.filter = (settings, data, dataIndex) => {
      let match = false
      const rewards = data[COLUMNS.REWARDS.INDEX]
      if (rewards && rewards.length) {
        return rewards.includes('Item')
      } else {
        return false
      }
    }
  }
}

const _filterItem = new FilterItem()
const filterItem = _filterItem.action.bind(_filterItem)
export { filterItem }
