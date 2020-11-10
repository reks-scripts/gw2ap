'use strict'

// Load modules
import $ from 'jquery'

const category = {}

// DATA TABLES PLUGIN
category.render = () => {
  return d => {
    return `<img src="${d.icon}" alt="${d.name}" title="${d.name}" data-type="category" data-category-id="${d.id}" width="32" height="32" />`
  }
}

category.order = () => {
  let types = $.fn.dataTable.ext.type

  // Add type detection
  types.detect.unshift(d => {
    try {
      const type = $(d).data('type')
      if (type === 'category') {
        return 'category'
      } else {
        return null
      }
    } catch (e) {
      return null
    }
  })

  // Add sorting method
  types.order['category-pre'] = d => {
    const category = $(d).attr('title')
    return category
  }
}

export default category