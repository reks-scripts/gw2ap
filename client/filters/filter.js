'use strict'

// Load modules
import $ from 'jquery'
import { forEach } from 'lodash'

class Filter {
  constructor() {
    this.toggle = false
    this.filter = null
  }

  action(e) {
    if (this.toggle === false) {
      $('#filter-progress button.active').click()
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

export { Filter }