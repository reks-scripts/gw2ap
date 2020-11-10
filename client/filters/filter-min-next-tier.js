'use strict'

// Load modules
import $ from 'jquery'
import _ from 'lodash'
import { Filter } from './filter'
import COLUMNS from '../../config/column-definitions'

class FilterMinNextTier extends Filter {
  constructor() {
    super()
    this.filter = (settings, data) => {
      const nextTierAp = parseInt(data[COLUMNS.NEXT_TIER_AP.INDEX])
      if (nextTierAp >= this.minNextTier) {
        return true
      }
      else {
        return false
      }
    }
    this.minNextTier = 0
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

    this.minNextTier = parseInt($(e.target).val())

    if (this.active && this.minNextTier === 0) {
      _.forEach($.fn.dataTable.ext.search, (value, key) => {
        if (value === this.filter) {
          $.fn.dataTable.ext.search.splice(key, 1)
          return false
        }
      })
      this.active = false
    }
    else if (!this.active && this.minNextTier !== '') {
      $.fn.dataTable.ext.search.push(this.filter)
      this.active = true
    }

    $('#achievements').DataTable().draw()
  }
}

const _filterMinNextTier = new FilterMinNextTier()
export default _filterMinNextTier.action.bind(_filterMinNextTier)