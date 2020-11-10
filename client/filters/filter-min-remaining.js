'use strict'

// Load modules
import $ from 'jquery'
import _ from 'lodash'
import { Filter } from './filter'
import COLUMNS from '../../config/column-definitions'

class FilterMinRemaining extends Filter {
  constructor() {
    super()
    this.filter = (settings, data) => {
      const remainingAp = parseInt(data[COLUMNS.REMAINING_AP.INDEX])
      if (remainingAp >= this.minRemaining) {
        return true
      }
      else {
        return false
      }
    }
    this.minRemaining = 0
    this.active = false
  }
  // override base class action()
  action(e) {
    if (!parseInt(e.key)) {
      e.preventDefault()
    }
    if (parseInt($(e.target).val()) > 50) {
      $(e.target).val('50')
    }
    if (parseInt($(e.target).val()) < 0) {
      $(e.target).val('0')
    }

    this.minRemaining = parseInt($(e.target).val())

    if (this.active && this.minRemaining === 0) {
      _.forEach($.fn.dataTable.ext.search, (value, key) => {
        if (value === this.filter) {
          $.fn.dataTable.ext.search.splice(key, 1)
          return false
        }
      })
      this.active = false
    }
    else if (!this.active && this.minRemaining !== '') {
      $.fn.dataTable.ext.search.push(this.filter)
      this.active = true
    }

    $('#achievements').DataTable().draw()
  }
}

const _filterMinRemaining = new FilterMinRemaining()
export default _filterMinRemaining.action.bind(_filterMinRemaining)