'use strict'

// Load modules
import _ from 'lodash'
import { Filter } from './filter'
import { COLUMNS } from '../../config/column-definitions'

class FilterItem extends Filter {
  constructor() {
    super()
    // eslint-disable-next-line
    this.filter = (settings, data, dataIndex) => {
      const rewards = data[COLUMNS.REWARDS.INDEX]
      if (rewards && rewards.length) {
        const parsed = JSON.parse(rewards)
        const found = _.find(parsed, { type: 'Item'})
        if (found) {
          return true
        }
        return false
      } else {
        return false
      }
    }
  }
}

const _filterItem = new FilterItem()
const filterItem = _filterItem.action.bind(_filterItem)
export { filterItem }
