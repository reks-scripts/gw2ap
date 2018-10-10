'use strict'

// Load modules
import { Filter } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterComplete extends Filter {
  constructor () {
    super()
    this.filter = ( settings, data, dataIndex ) => {
      if (parseInt(data[COLUMNS.TOTAL_PROGRESS.INDEX]) === 100) {
        return true
      } else {
        return false
      }
    }
  }
}

const _filterComplete = new FilterComplete()
const filterComplete = _filterComplete.action.bind(_filterComplete)
export { filterComplete }
