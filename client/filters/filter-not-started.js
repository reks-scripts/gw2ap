'use strict'

// Load modules
import { Filter } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterNotStarted extends Filter {
  constructor () {
    super()
    this.filter = ( settings, data, dataIndex ) => {
      if (parseInt(data[COLUMNS.TOTAL_PROGRESS.INDEX]) === 0) {
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