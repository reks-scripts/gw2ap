'use strict'

// Load application styles
import '@babel/polyfill'
import 'styles/index.scss'
import 'bootstrap'
import 'gasparesganga-jquery-loading-overlay'
import 'datatables.net-bs4/css/dataTables.bootstrap4.css'

// Load modules
import $ from 'jquery'
import Fetch from 'node-fetch'
import { forEach } from 'lodash'
import { COLUMNS } from './helpers/column-definitions'

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
import { ellipsis } from './plugins/ellipsis'
import { wikiLink } from './plugins/wiki-link'
import * as Category from './plugins/category'
import { percentageBars } from './plugins/percentage-bars'

// Data tables filters
import { filterComplete } from './filters/filter-complete'
import { filterInProgress } from './filters/filter-in-progress'
import { filterNotStarted } from './filters/filter-not-started'
import { filterItem } from './filters/filter-reward-item'
import { filterMastery } from './filters/filter-reward-mastery'
import { filterTitle } from './filters/filter-reward-title'
import { filterGroup } from './filters/filter-group'
import { filterCategory } from './filters/filter-category'

// APP CODE
let $dataTable = null

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
  return result.json()
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
  $.fn.dataTable.render.ellipsis = ellipsis
  $.fn.dataTable.render.wikiLink = wikiLink
  $.fn.dataTable.render.category = Category.render
  $.fn.dataTable.render.percentageBars = percentageBars
  // attach custom orderers
  $.fn.dataTable.category = Category.order
  $.fn.dataTable.category()

  $dataTable = $('#achievements').DataTable({
    data: data,
    pagingType: 'full',
    scrollCollapse: true,
    select: true,
    stateSave: true,
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
      { data: COLUMNS.ID.DATA }
    ]
  })
  $('.dataTable').wrap('<div style="overflow:auto" />')
}

const initGroupSelect = groups => {
  forEach(groups, group => {
    $('#select-group').append(`<option value="${group.id}">${group.name}</option>`)
  })
  $('#select-group').on('change', e => {
    filterGroup($(e.currentTarget).val())
  })
}

const initCategorySelect = categories => {
  forEach(categories, category => {
    $('#select-category').append(`<option value="${category.id}" data-group-id="${category.group.id}" style="display:none;">${category.name}</option>`)
  })
  $('#select-category').on('change', e => {
    filterCategory($(e.currentTarget).val())
  })
}

const bindEvents = () => {
  window.addEventListener('resize', () => {
    if ($dataTable) {
      $dataTable.draw()
    }
  })

  $('#btn-filter-in-progress').on('click', filterInProgress)
  $('#btn-filter-not-started').on('click', filterNotStarted)
  $('#btn-filter-complete').on('click', filterComplete)
  $('#btn-filter-title').on('click', filterTitle)
  $('#btn-filter-mastery').on('click', filterMastery)
  $('#btn-filter-item').on('click', filterItem)

  $('form').on('submit', async e => {
    e.preventDefault()
    $.LoadingOverlay('show')

    const apiKey = $('#api-key').val()
    const remember = $('#remember-api-key').is(':checked')

    updateApiKey(apiKey, remember)
    
    const achievements = await getAchievements(apiKey)
    if (!$dataTable) {
      initDataTable(achievements)
    }

    const groups = await getGroups()
    initGroupSelect(groups)
    const categories = await getCategories()
    initCategorySelect(categories)
    
    $('#btn-filter-in-progress').click()
    $('#page-1').hide()
    $('#page-2').show()
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