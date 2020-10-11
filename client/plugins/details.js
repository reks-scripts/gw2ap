'use strict'

// Load modules
import $ from 'jquery'
import _ from 'lodash'
import { API } from '../api'

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const renderSkin = skin => {
  return $('<img>')
    .attr('src', skin.icon)
    .attr('title', skin.name)
    .attr('height', '64')
    .attr('width', '64')
}

const format = async d => {
  const div = $('<div>')

  if (d.requirement) {
    div.append($('<p>').append(d.requirement))
  }
  if (d.description) {
    div.append($('<p class="flavor">').append(d.description))
  }

  const promises = []
  const bits = $('<table class="table-sm mb-3">')
  let row = $('<tr>')

  _.forEach(d.bits, async bit => {
    if (bit.type === 'Text') {
      row = $('<tr>')
      if (bit.done) {
        row.append($('<td class="done">').append('✓'))
      }
      else {
        row.append($('<td class="notdone">').append('—')) 
      }
      row.append($('<td>').append(`<small>${bit.text}</small>`))
      bits.append(row)
    }
    else if (bit.type === 'Skin') {
      promises.push(API.getSkin(bit.id))
    }
    else if (bit.type === 'Item') {
      promises.push(API.getItem(bit.id))
    }
  })

  try {
    const promised = await Promise.all(promises)

    _.forEach(promised, item => {
      const rendered = renderSkin(item)
      const bit = _.find(d.bits, { id: item.id })
      if (!bit.done) {
        rendered.addClass('notdone')
      }
      row.append($('<td class="skin">').append(rendered))
    })

    let title = 'Objectives:'
    if (d.bits.length) {
      if (d.bits[0].type === 'Skin' || d.bits[0].type === 'Item') {
        title = 'Collection:'
        bits.append(row)
        div.append($('<div>').append($('<h5>').text(title), bits))
      }
      else {
        div.append($('<div class="float-left mr-5">').append($('<h5>').text(title), bits))
      }
    }
  }
  catch (e) {
    // bad item or skin id from API
  }

  const tiers = $('<table class="table-sm mb-3">')
  _.forEach(d.tiers, (tier, index) => {
    const row = $('<tr>')
    if (tier.done) {
      row.append($('<td class="done">').append('✓'))
    }
    else {
      row.append($('<td class="notdone">').append('—')) 
    }
    row.append($('<td>').append(`<small>Tier  ${(index + 1)}</small>`))
    row.append($('<td>').append(`<small>${tier.points} <span class="ap"></span></small>`))
    row.append($('<td>').append(`<small>${numberWithCommas(tier.count)} objectives completed</small>`))
    tiers.append(row)
  })
  if (d.tiers.length > 1) {
    div.append($('<div class="float-left">').append($('<h5>').text('Tiers:'), tiers))
  }

  return div
}

const details = async function() {
  const tr = $(this).closest('tr')
  const row = $(this).closest('table').DataTable().row(tr)

  if (row.child.isShown()) {
    row.child.hide()
    tr.removeClass('shown')
  }
  else {
    row.child(await format(row.data())).show()
    tr.addClass('shown')
  }
}

export { details }