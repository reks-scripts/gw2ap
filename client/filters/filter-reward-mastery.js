'use strict'

// Load modules
import _ from 'lodash'
import { Filter } from './filter'
import COLUMNS from '../../config/column-definitions'

class FilterMastery extends Filter {
  constructor() {
    super()
    this.filter = (settings, data) => {
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
export default _filterMastery.action.bind(_filterMastery)