'use strict'

// Load modules
import { Filter } from './filter'
import { COLUMNS } from '../../config/column-definitions'

class FilterItem extends Filter {
  constructor() {
    super()
    // eslint-disable-next-line
    this.filter = (settings, data, dataIndex) => {
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
