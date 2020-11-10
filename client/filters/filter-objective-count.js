'use strict'

// Load modules
import $ from 'jquery'
import { Filter } from './filter'
import COLUMNS from '../../config/column-definitions'

class FilterObjectiveCount extends Filter {
  constructor() {
    super()
    this.filter = (settings, data) => {
      const count = parseInt(data[COLUMNS.COUNT.INDEX])
      if (this.objectiveLogic === 'gte' && count >= this.objectiveCount) {
        return true
      }
      else if (this.objectiveLogic === 'lte' && count <= this.objectiveCount) {
        return true
      }
      else {
        return false
      }
    }
    this.objectiveCount = 0
    this.objectiveLogic = 'gte'
    this.active = false
  }
  // override base class action()
  action(e) {
    if (!parseInt(e.key)) {
      e.preventDefault()
    }
    if (parseInt($(e.target).val()) > 100000) {
      $(e.target).val('100000')
    }
    if (parseInt($(e.target).val()) < 0) {
      $(e.target).val('0')
    }

    this.objectiveCount = parseInt($('#filter-objective-count').val())
    this.objectiveLogic = $('#filter-objective-logic').val()

    if (!this.active) {
      $.fn.dataTable.ext.search.push(this.filter)
      this.active = true
    }

    $('#achievements').DataTable().draw()
  }
}

const _filterObjectiveCount = new FilterObjectiveCount()
export default _filterObjectiveCount.action.bind(_filterObjectiveCount)