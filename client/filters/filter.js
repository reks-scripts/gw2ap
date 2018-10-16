'use strict'

// Load modules
import $ from 'jquery'
import { forEach } from 'lodash'

const FILTER_BUTTON_GROUPS = {
  PROGRESS: 'progress',
  REWARDS: 'rewards'
}

class Filter {
  constructor(buttonGroup) {
    this.toggle = false
    this.filter = null
    this.buttonGroup = buttonGroup || null
  }

  action(e) {
    if (this.toggle === false) {
      if (this.buttonGroup) {
        $(`#filter-${this.buttonGroup} button.active`).click()
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

export { Filter, FILTER_BUTTON_GROUPS }