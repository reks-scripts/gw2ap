'use strict'

// Load modules
import { Filter, FILTER_GROUPS } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterNotStarted extends Filter {
  constructor() {
    super(FILTER_GROUPS.PROGRESS)
    this.filter = (settings, data, dataIndex) => {
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
const filterNotStarted = _filterNotStarted.action.bind(_filterNotStarted)
export { filterNotStarted }