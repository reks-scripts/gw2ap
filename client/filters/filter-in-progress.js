'use strict'

// Load modules
import { Filter, FILTER_BUTTON_GROUPS } from './filter'
import COLUMNS from '../../config/column-definitions'

class FilterInProgress extends Filter {
  constructor() {
    super(FILTER_BUTTON_GROUPS.PROGRESS)
    this.filter = (settings, data) => {
      const totalProgress = parseInt(data[COLUMNS.TOTAL_PROGRESS.INDEX])
      const tierProgress = parseInt(data[COLUMNS.TIER_PROGRESS.INDEX])

      if ((0 < totalProgress && totalProgress < 100) || (0 < tierProgress && tierProgress < 100)) {
        return true
      } else {
        return false
      }
    }
  }
}

const _filterInProgress = new FilterInProgress()
export default _filterInProgress.action.bind(_filterInProgress)