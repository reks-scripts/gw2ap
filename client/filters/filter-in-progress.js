'use strict'

// Load modules
import { Filter, FILTER_BUTTON_GROUPS } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterInProgress extends Filter {
  constructor() {
    super(FILTER_BUTTON_GROUPS.PROGRESS)
    this.filter = (settings, data, dataIndex) => {
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
const filterInProgress = _filterInProgress.action.bind(_filterInProgress)
export { filterInProgress }
