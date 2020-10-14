'use strict'

// Load modules
import _ from 'lodash'
import { Filter } from './filter'
import { COLUMNS } from '../../config/column-definitions'

class FilterMastery extends Filter {
  constructor() {
    super()
    // eslint-disable-next-line
    this.filter = (settings, data, dataIndex) => {
      const rewards = data[COLUMNS.REWARDS.INDEX]
      if (rewards && rewards.length) {
        const parsed = JSON.parse(rewards)
        const found = _.find(parsed, { type: 'Mastery'})
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

const _filterMastery = new FilterMastery()
const filterMastery = _filterMastery.action.bind(_filterMastery)
export { filterMastery }
