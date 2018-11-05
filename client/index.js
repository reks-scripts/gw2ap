'use strict'

// Load modules
import $ from 'jquery'
import Fetch from 'node-fetch'
import Boom from 'boom'
import { forEach } from 'lodash'
import { COLUMNS } from '../config/column-definitions'

// Load application styles
import '@babel/polyfill'
import 'styles/index.scss'
import 'bootstrap'
import 'bootstrap-select'
import 'gasparesganga-jquery-loading-overlay'
import 'datatables.net-bs4/css/dataTables.bootstrap4.css'

// Data tables
import 'datatables.net-bs4'
import 'datatables.net-buttons-bs4'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-colreorder-bs4'
import 'datatables.net-fixedcolumns-bs4'
import 'datatables.net-fixedheader-bs4'
import 'datatables.net-keytable-bs4'
import 'datatables.net-responsive-bs4'
import 'datatables.net-rowreorder-bs4'
import 'datatables.net-scroller-bs4'
import 'datatables.net-select-bs4'

// Data tables plugins
import { Plugins } from './plugins'

// Data tables filters
import { Filters } from './filters'

// APP CODE
let $DataTable = null
let Categories = null

// eslint-disable-next-line
const API_URL = IS_DEV ? 'http://localhost:3000/' : ''

/* eslint-disable */
const log = data => {
  console.log(JSON.stringify(data, null, 2))
}
/* eslint-enable */

const fetch = async (url, options) => {
  options = options || {}
  const result = await Fetch(url, options)
  if (result.ok) {
    return result.json()
  }
  else {
    const error = await result.json()
    throw Boom.badRequest(error.message || 'Bad Request')
  }
}

const getGroups = async () => {
  const url = `${API_URL}api/achievements/groups`
  return fetch(url)
}

const getCategories = async () => {
  const url = `${API_URL}api/achievements/categories`
  return fetch(url)
}

const getAchievements = async apiKey => {
  const url = `${API_URL}api/achievements/${apiKey}`
  return fetch(url)
}

const setApiKey = value => {
  localStorage.setItem('api-key', value)
}

const getApiKey = () => {
  return localStorage.getItem('api-key')
}

const removeApiKey = () => {
  localStorage.removeItem('api-key')
}

const updateApiKey = (apiKey, remember) => {
  if (remember) {
    setApiKey(apiKey)
  }
  else {
    removeApiKey()
  }
}

const initDataTable = data => {
  // attach custom renderers
  $.fn.dataTable.render.ellipsis = Plugins.ellipsis
  $.fn.dataTable.render.wikiLink = Plugins.wikiLink
  $.fn.dataTable.render.category = Plugins.Category.render
  $.fn.dataTable.render.percentageBars = Plugins.percentageBars
  // attach custom orderers
  $.fn.dataTable.category = Plugins.Category.order
  $.fn.dataTable.category()

  $DataTable = $('#achievements').DataTable({
    data: data,
    dom: '<"clearfix"fl><t><ip>',
    pagingType: 'full',
    scrollCollapse: true,
    select: true,
    stateSave: false,
    responsive: true,
    language: {
      infoFiltered: ''
    },
    columnDefs: [
      {
        targets: [
          COLUMNS.TIER_PROGRESS.INDEX,
          COLUMNS.NEXT_TIER_AP.INDEX,
          COLUMNS.TOTAL_PROGRESS.INDEX,
          COLUMNS.REMAINING_AP.INDEX
        ],
        orderSequence: ['desc', 'asc']
      },
      {
        targets: [
          COLUMNS.ID.INDEX
        ],
        searchable: false
      },
      {
        targets: [
          COLUMNS.DESCRIPTION.INDEX,
          COLUMNS.REQUIREMENT.INDEX,
          COLUMNS.REWARDS.INDEX,
          COLUMNS.GROUP.INDEX,
          COLUMNS.FLAGS.INDEX,
          COLUMNS.TYPE.INDEX,
          COLUMNS.COUNT.INDEX,
          COLUMNS.ID.INDEX
        ],
        visible: false
      },
      {
        targets: COLUMNS.NAME.INDEX,
        render: $.fn.dataTable.render.wikiLink(35)
      },
      {
        targets: COLUMNS.CATEGORY.INDEX,
        render: $.fn.dataTable.render.category()
      },
      {
        targets: [
          COLUMNS.TOTAL_PROGRESS.INDEX,
          COLUMNS.TIER_PROGRESS.INDEX
        ],
        render: $.fn.dataTable.render.percentageBars()
      }
    ],
    order: [[COLUMNS.TIER_PROGRESS.INDEX, 'desc']],
    columns: [
      { data: COLUMNS.TIER_PROGRESS.DATA },
      { data: COLUMNS.NAME.DATA },
      { data: COLUMNS.NEXT_TIER_AP.DATA },
      { data: COLUMNS.TOTAL_PROGRESS.DATA },
      { data: COLUMNS.REMAINING_AP.DATA },
      { data: COLUMNS.CATEGORY.DATA },
      { data: COLUMNS.DESCRIPTION.DATA },
      { data: COLUMNS.REQUIREMENT.DATA },
      { data: COLUMNS.REWARDS.DATA },
      { data: COLUMNS.GROUP.DATA },
      { data: COLUMNS.FLAGS.DATA },
      { data: COLUMNS.TYPE.DATA },
      { data: COLUMNS.COUNT.DATA },
      { data: COLUMNS.ID.DATA }
    ]
  })
  $('.dataTable').wrap('<div style="overflow:auto" />')
}

const initGroupSelect = groups => {
  forEach(groups, group => {
    $('#select-group').append(`<option value="${group.id}" selected>${group.name}</option>`)
  })
  $('#select-group').selectpicker({
    style: 'form-control custom-select',
    selectedTextFormat: 'count > 2',
    noneSelectedText: 'None',
    actionsBox: true,
    size: 10,
    countSelectedText: (numSelected, numTotal) => {
      if (numSelected === numTotal) {
        return 'All'
      } else {
        return '{0} groups selected'
      }
    }
  })
  $('#select-group').on('changed.bs.select', e => {
    const groups = $(e.currentTarget).val()
    Filters.filterGroup(groups)
    buildCategorySelect()
    $('#select-category').selectpicker('refresh')
  })
}

const buildCategorySelect = () => {
  const groups = $('#select-group').val()
  let currentOptGroup = ''
  $('#select-category').empty()
  forEach(Categories, category => {
    if (groups.includes(category.group.id)) {
      if (currentOptGroup !== category.group.name) {
        currentOptGroup = category.group.name
        $('#select-category').append(`<optgroup label="${category.group.name}" />`)
      }
      $('#select-category optgroup:last').append(`<option value="${category.id}" data-group-id="${category.group.id}" selected>${category.name}</option>`)
    }
  })
}

const initCategorySelect = () => {
  buildCategorySelect()
  $('#select-category').selectpicker({
    style: 'form-control custom-select',
    selectedTextFormat: 'count > 1',
    noneSelectedText: 'None',
    actionsBox: true,
    size: 10,
    countSelectedText: (numSelected, numTotal) => {
      if (numSelected === numTotal) {
        return 'All'
      } else {
        return '{0} categories selected'
      }
    }
  })
  $('#select-category').on('changed.bs.select refreshed.bs.select', e => {
    const categories = $(e.currentTarget).val()
    Filters.filterCategory(categories)
  })
}

const toggleAdditionalFilters = e => {
  if ($(e.currentTarget).hasClass('collapsed')) {
    $(e.currentTarget).text('Hide additional filters')
  } else {
    $(e.currentTarget).text('Show additional filters')
  }
}

const bindEvents = () => {
  window.addEventListener('resize', () => {
    if ($DataTable) {
      $DataTable.draw()
    }
  })

  $('#btn-filter-in-progress').on('click', Filters.filterInProgress)
  $('#btn-filter-not-started').on('click', Filters.filterNotStarted)
  $('#btn-filter-complete').on('click', Filters.filterComplete)
  $('#btn-filter-title').on('click', Filters.filterTitle)
  $('#btn-filter-mastery').on('click', Filters.filterMastery)
  $('#btn-filter-item').on('click', Filters.filterItem)
  $('#filter-min-next-tier').on('blur change keyup', Filters.filterMinNextTier)
  $('#filter-min-remaining').on('blur change keyup', Filters.filterMinRemaining)
  $('#filter-objective-logic').on('change', Filters.filterObjectiveCount)
  $('#filter-objective-count').on('blur change keyup', Filters.filterObjectiveCount)

  $('#btn-additional-filters').on('click', toggleAdditionalFilters)

  $('form').on('submit', async e => {
    e.preventDefault()
    $.LoadingOverlay('show')
    $('#error').hide().empty()

    const apiKey = $('#api-key').val()
    const remember = $('#remember-api-key').is(':checked')

    updateApiKey(apiKey, remember)
    
    try {
      const achievements = await getAchievements(apiKey)

      if (!$DataTable) {
        initDataTable(achievements)
      }

      const groups = await getGroups()
      initGroupSelect(groups)
      Categories = await getCategories()
      initCategorySelect()

      $('#btn-filter-in-progress').click()
      $('#page-1').hide()
      $('#page-2').show()
    } 
    catch (e) {
      let error = e.output.payload.error || 'Bad Request'
      if (e.output.payload.message) {
        error = `${error}: ${e.output.payload.message}`
      }
      $('#error').append(`${error}`).show()
    }
    $.LoadingOverlay('hide')
  })
}

const loadForm = async () => {
  const apiKey = getApiKey()
  if (apiKey) {
    $('#api-key').val(apiKey)
    $('#remember-api-key').prop('checked', true)
  }
  else {
    $('#api-key').val('')
    $('#remember-api-key').prop('checked', false)
  }
}

$(() => {
  loadForm()
  bindEvents()
})