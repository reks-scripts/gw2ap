'use strict'

// Load modules
import $ from 'jquery'
import { forEach } from 'lodash'
import { Filter } from './filter'
import { COLUMNS } from '../../config/column-definitions'

class FilterCategory extends Filter {
  constructor() {
    super()
    // eslint-disable-next-line
    this.filter = (settings, data, dataIndex) => {
      const category = data[COLUMNS.CATEGORY.INDEX]
      try {
        const categoryId = $(category).data('category-id')
        if (parseInt(categoryId) === parseInt(this.filterCategoryId)) {
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
    this.filterCategoryId = e
    if (this.active && this.filterCategoryId === '') {
      forEach($.fn.dataTable.ext.search, (value, key) => {
        if (value === this.filter) {
          $.fn.dataTable.ext.search.splice(key, 1)
          return false
        }
      })
      this.active = false
    } 
    else if (!this.active && this.filterCategoryId !== '') {
      $.fn.dataTable.ext.search.push(this.filter)
      this.active = true
    }
    $('#achievements').DataTable().draw()
  }
}

const _filterCategory = new FilterCategory()
const filterCategory = _filterCategory.action.bind(_filterCategory)
export { filterCategory }