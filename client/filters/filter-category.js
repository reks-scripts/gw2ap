'use strict'

// Load modules
import $ from 'jquery'
import { Filter } from './filter'
import COLUMNS from '../../config/column-definitions'

class FilterCategory extends Filter {
  constructor() {
    super()
    this.filter = (settings, data) => {
      const category = data[COLUMNS.CATEGORY.INDEX]
      try {
        const categoryId = $(category).data('category-id')
        if (this.filterCategories.includes(categoryId.toString())) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    }
    this.active = false
  }
  // override base class action()
  action(e) {
    this.filterCategories = e
    if (!this.active) {
      $.fn.dataTable.ext.search.push(this.filter)
      this.active = true
    }
    $('#achievements').DataTable().draw()
  }
}

const _filterCategory = new FilterCategory()
export default _filterCategory.action.bind(_filterCategory)