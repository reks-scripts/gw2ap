'use strict'

// Load modules
import { Filter } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterInProgress extends Filter {
  constructor () {
    super()
    this.filter = ( settings, data, dataIndex ) => {
      const progress = parseInt(data[COLUMNS.TOTAL_PROGRESS.INDEX])
      if (0 < progress && progress < 100) {
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
