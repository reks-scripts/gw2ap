'use strict'

// Load modules
import $ from 'jquery'

const category = {}

// DATA TABLES PLUGIN
category.render = () => {
  // eslint-disable-next-line
  return (d, type, row) => {
    return `<img src="${d.icon}" alt="${d.name}" title="${d.name}" data-type="category" data-category-id="${d.id}" width="32" height="32" />`
  }
}

category.order = () => {
  let types = $.fn.dataTable.ext.type

  // Add type detection
  types.detect.unshift(d => {
    try {
      const $data = $(d).data('type')
      if ($data === 'category') {
        return 'category'
      } else {
        return null
      }
    } catch (e) {
      return null
    }
  })

  // Add sorting method - use an integer for the sorting
  types.order['category-pre'] = d => {
    const category = $(d).attr('title')
    return category
  }
}

export { category }