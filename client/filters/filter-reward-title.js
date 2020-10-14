'use strict'

// Load modules
import _ from 'lodash'
import { Filter } from './filter'
import { COLUMNS } from '../../config/column-definitions'

class FilterTitle extends Filter {
  constructor() {
    super()
    // eslint-disable-next-line
    this.filter = (settings, data, dataIndex) => {
      const rewards = data[COLUMNS.REWARDS.INDEX]
      if (rewards && rewards.length) {
        const parsed = JSON.parse(rewards)
        const found = _.find(parsed, { type: 'Title'})
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

const _filterTitle = new FilterTitle()
const filterTitle = _filterTitle.action.bind(_filterTitle)
export { filterTitle }
