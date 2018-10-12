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
import { forEach, round, sortBy } from 'lodash'
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
import { percentageBars } from './plugins/percentage-bars'

// Data tables filters
import { filterComplete } from './filters/filter-complete'
import { filterInProgress } from './filters/filter-in-progress'
import { filterNotStarted } from './filters/filter-not-started'
import { filterCoins } from './filters/filter-reward-coins'
import { filterItem } from './filters/filter-reward-item'
import { filterMastery } from './filters/filter-reward-mastery'
import { filterTitle } from './filters/filter-reward-title'

// Is the current build a development build
//const IS_DEV = IS_DEV || false

// APP CODE
let $dataTable

const log = data => {
  console.log(JSON.stringify(data, null, 2))
}

const fetch = async (url, options) => {
  options = options || {}
  const result = await Fetch(url, options)
  return result.json()
}

const getAchievements = async apiKey => {
  let url = `api/achievements/${apiKey}`
  if (IS_DEV) {
    url = `http://localhost:3000/${url}`
  }
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
  // attach renderers
  $.fn.dataTable.render.ellipsis = ellipsis
  $.fn.dataTable.render.wikiLink = wikiLink
  $.fn.dataTable.render.percentageBars = percentageBars

  $dataTable = $('#achievements').DataTable({
    data: data,
    scrollCollapse: true,
    select: true,
    stateSave: true,
    responsive: true,
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
          COLUMNS.REWARDS.INDEX,
          COLUMNS.FLAGS.INDEX,
          COLUMNS.TYPE.INDEX,
          COLUMNS.ID.INDEX
        ],
        visible: false
      },
      {
        targets: COLUMNS.NAME.INDEX,
        render: $.fn.dataTable.render.wikiLink( 35 )
      },
      {
        targets: COLUMNS.DESCRIPTION.INDEX,
        render: $.fn.dataTable.render.ellipsis( 70, true )
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
      { data: COLUMNS.DESCRIPTION.DATA },
      { data: COLUMNS.REWARDS.DATA },
      { data: COLUMNS.FLAGS.DATA },
      { data: COLUMNS.TYPE.DATA },
      { data: COLUMNS.ID.DATA }
    ]
  })
  $('.dataTable').wrap('<div style="overflow:auto" />')
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
  $('#btn-filter-coins').on('click', filterCoins)

  $('form').on('submit', async e => {
    e.preventDefault()
    $.LoadingOverlay('show')

    const apiKey = $('#api-key').val()
    const remember = $('#remember-api-key').is(':checked')

    updateApiKey(apiKey, remember)
    const result = await getAchievements(apiKey)

    if (!$dataTable) {
      initDataTable(result)
    }
    $('#btn-filter-in-progress').click()
    $('#page-1').hide()
    $('#page-2').show()
    $.LoadingOverlay('hide')
  })
}

const loadForm = () => {
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