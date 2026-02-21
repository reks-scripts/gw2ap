'use strict'

// Load modules
import { Filter, FILTER_BUTTON_GROUPS } from './filter'
import COLUMNS from '../../config/column-definitions'

class FilterUncompleted extends Filter {
  constructor() {
    super(FILTER_BUTTON_GROUPS.PROGRESS)
    this.filter = (settings, data) => {
      if (parseInt(data[COLUMNS.TOTAL_PROGRESS.INDEX]) < 100) {
        return true
      } else {
        return false
      }
    }
  }
}

const _filterUncompleted = new FilterUncompleted()
export default _filterUncompleted.action.bind(_filterUncompleted)
