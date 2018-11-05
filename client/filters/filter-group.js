'use strict'

// Load modules
import $ from 'jquery'
import { Filter } from './filter'
import { COLUMNS } from '../../config/column-definitions'

class FilterGroup extends Filter {
  constructor() {
    super()
    // eslint-disable-next-line
    this.filter = (settings, data, dataIndex) => {
      const groupId = data[COLUMNS.GROUP.INDEX]

      if (this.filterGroups.includes(groupId)) {
        return true
      }
      else {
        return false
      }
    }
    this.active = false
  }
  // override base class action()
  action(e) {
    this.filterGroups = e
    if (!this.active) {
      $.fn.dataTable.ext.search.push(this.filter)
      this.active = true
    }
    $('#achievements').DataTable().draw()
  }
}

const _filterGroup = new FilterGroup()
const filterGroup = _filterGroup.action.bind(_filterGroup)
export { filterGroup }