'use strict'

// Load modules
import $ from 'jquery'
import { forEach } from 'lodash'

const FILTER_GROUPS = {
  PROGRESS: 'progress',
  REWARDS: 'rewards'
}

class Filter {
  constructor(group) {
    this.toggle = false
    this.filter = null
    this.group = group || null
  }

  action(e) {
    if (this.toggle === false) {
      if (this.group) {
        $(`#filter-${this.group} button.active`).click()
      }
      $.fn.dataTable.ext.search.push(this.filter)
      this.toggle = true
    } else {
      forEach($.fn.dataTable.ext.search, (value, key) => {
        if (value === this.filter) {
          $.fn.dataTable.ext.search.splice(key, 1)
          return false
        }
      })
      this.toggle = false
    }
    $('#achievements').DataTable().draw()
  }
}

export { Filter, FILTER_GROUPS }