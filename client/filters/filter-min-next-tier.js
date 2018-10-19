'use strict'

// Load modules
import $ from 'jquery'
import { forEach } from 'lodash'
import { Filter } from './filter'
import { COLUMNS } from '../helpers/column-definitions'

class FilterMinNextTier extends Filter {
  constructor() {
    super()
    // eslint-disable-next-line
    this.filter = (settings, data, dataIndex) => {
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

    if (this.active) {
      forEach($.fn.dataTable.ext.search, (value, key) => {
        if (value === this.filter) {
          $.fn.dataTable.ext.search.splice(key, 1)
          return false
        }
      })
      this.active = false
    } 

    this.minNextTier = parseInt($(e.target).val())

    if (this.active === false) {
      $.fn.dataTable.ext.search.push(this.filter)
      this.active = true
    }
    
    $('#achievements').DataTable().draw()
  }
}

const _filterMinNextTier = new FilterMinNextTier()
const filterMinNextTier = _filterMinNextTier.action.bind(_filterMinNextTier)
export { filterMinNextTier }