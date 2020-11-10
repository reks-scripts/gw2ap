'use strict'

// Load modules
import { Filter, FILTER_BUTTON_GROUPS } from './filter'
import COLUMNS from '../../config/column-definitions'

class FilterNotStarted extends Filter {
  constructor() {
    super(FILTER_BUTTON_GROUPS.PROGRESS)
    this.filter = (settings, data) => {
      const totalProgress = parseInt(data[COLUMNS.TOTAL_PROGRESS.INDEX])
      const tierProgress = parseInt(data[COLUMNS.TIER_PROGRESS.INDEX])
      if (tierProgress === 0 && totalProgress === 0) {
        return true
      } else {
        return false
      }
    }
  }
}

const _filterNotStarted = new FilterNotStarted()
export default _filterNotStarted.action.bind(_filterNotStarted)