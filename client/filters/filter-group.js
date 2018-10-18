'use strict'

// Load modules
import $ from 'jquery'
import { forEach } from 'lodash'
import { Filter } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterGroup extends Filter {
  constructor() {
    super()
    // eslint-disable-next-line
    this.filter = (settings, data, dataIndex) => {
      const groupId = data[COLUMNS.GROUP.INDEX]

      if (this.filterGroupId === groupId) {
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
    this.filterGroupId = e
    if (this.active && this.filterGroupId === '') {
      forEach($.fn.dataTable.ext.search, (value, key) => {
        if (value === this.filter) {
          $.fn.dataTable.ext.search.splice(key, 1)
          return false
        }
      })
      $('#select-category').val('')
      $('#select-category option').each((index, option) => {
        // don't hide 'All'
        if ($(option).val() !== '') {
          $(option).hide()
        }
      })
      $('#select-category').trigger('change')
      this.active = false
    } 
    else {
      if (!this.active) {
        $.fn.dataTable.ext.search.push(this.filter)
        this.active = true
      }
      $('#select-category').val('')
      $('#select-category option').each((index, option) => {
        if ($(option).data('group-id') === this.filterGroupId) {
          $(option).show()
        }
        // don't hide 'All'
        else if ($(option).val() !== '') {
          $(option).hide()
        }
      })
      $('#select-category').trigger('change')
    }
    $('#achievements').DataTable().draw()
  }
}

const _filterGroup = new FilterGroup()
const filterGroup = _filterGroup.action.bind(_filterGroup)
export { filterGroup }