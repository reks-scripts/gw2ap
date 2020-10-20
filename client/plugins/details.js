'use strict'

// Load modules
import $ from 'jquery'
import _ from 'lodash'
import { API } from '../api'

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const renderLink = name => {
  let href = name.split(' ').join('_')
  href = href.replace(/[[\]{}|<>#"]/g, '')
  href = encodeURI(href)

  return $(`<a href="https://wiki.guildwars2.com/wiki/Special:Search/${href}" target="_blank">`)
}

const renderItem = skin => {
  const icon = $('<img>')
    .attr('src', skin.icon)
    .attr('title', skin.name)
    .attr('alt', skin.name)
    .attr('height', '32')
    .attr('width', '32')

  const link = renderLink(skin.name)

  return link.append(icon)
}

const renderTitle = title => {
  const icon = $('<img>')
    .attr('src', './assets/images/title.png')
    .attr('title', title.name)
    .attr('alt', title.name)
    .attr('height', '32')
    .attr('width', '32')

  const link = renderLink(title.name)

  return link.append(icon)
}

const renderMastery = mastery => {
  let title, image
  switch (mastery.region.toLowerCase()) {
  case 'tyria':
    title = 'Central Tyria Mastery Point'
    image = 'mp_central_tyria.png'
    break
  case 'maguuma':
    title = 'Heart of Thorns Mastery Point'
    image = 'mp_heart_of_thorns.png'
    break
  case 'desert':
    title = 'Path of Fire Mastery Point'
    image = 'mp_path_of_fire.png'
    break
  case 'tundra':
    title = 'Icebrood Saga Mastery Point'
    image = 'mp_icebrood_saga.png'
    break
  }

  return $('<img>')
    .attr('src', `./assets/images/${image}`)
    .attr('title', title)
    .attr('alt', title)
    .attr('height', '32')
    .attr('width', '32')
}

const renderSummary = d => {
  let section = $('<section>')

  section.append($('<p>').text(`${d.earnedAP} / ${d.totalAP}`).append($('<span>').addClass('ap')))

  if (d.tiers && d.tiers.length > 1) {
    let currentTier = 1
    _.forEach(d.tiers, (tier, index) => {
      if (tier.done) {
        currentTier = index + 1
      }
    })
    section.append($('<p>').text(`${currentTier} / ${d.tiers.length} Tiers`))
  }

  if (!_.isEmpty(d.progress)) {
    section.append($('<p>').text(`${d.progress.current} / ${d.progress.max} Objectives`))
  }

  return section
}

const renderRewards = async rewards => {
  if (typeof rewards === 'string') {
    const parsed = JSON.parse(rewards)
    let promises = []
    _.forEach(parsed, reward => {
      if (reward.type === 'Item') {
        promises.push(API.getItem(reward.id))
      }
      else if (reward.type === 'Title') {
        promises.push(API.getTitle(reward.id))
      }
    })

    const promised = await Promise.all(promises)

    const section = $('<section>')
    _.forEach(parsed, reward => {
      if (reward.type === 'Mastery') {
        section.append(renderMastery(reward))
      }
    })

    _.forEach(promised, item => {
      if (!Object.hasOwnProperty.call(item, 'type')) {
        section.append(renderTitle(item))
      }
      else {
        section.append(renderItem(item))
      }
    })

    return section
  }
  else {
    return ''
  }
}

const renderDescription = d => {
  const div = $('<div>')
  if (d.requirement) {
    div.append($('<p>').text(d.requirement))
  }
  if (d.description) {
    div.append($('<p>').addClass('flavor').html(d.description))
  }
  return div
}

const renderObjective = async d => {
  let promises = []
  const bits = $('<table>').addClass('table-sm mb-3')
  let row = $('<tr>')

  _.forEach(d.bits, bit => {
    if (bit.type === 'Text') {
      row = $('<tr>')
      if (bit.done) {
        row.append($('<td>').addClass('done').text('✓'))
      }
      else {
        row.append($('<td>').addClass('notdone').text('—')) 
      }
      row.append($('<td>').append($('<small>').text(bit.text)))
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
      const rendered = renderItem(item)
      const bit = _.find(d.bits, { id: item.id })
      if (!bit.done) {
        rendered.find('img').addClass('notdone')
      }
      row.append($('<td>').addClass('skin').append(rendered))
    })

    let title = 'Objectives:'
    if (d.bits.length) {
      if (d.bits && d.bits.length > 0 && d.bits[0].type === 'Skin' || d.bits[0].type === 'Item') {
        title = 'Collection:'
        bits.append(row)
        return $('<div>').append($('<h5>').text(title), bits)
      }
      else {
        return $('<div>').addClass('float-left mr-5').append($('<h5>').text(title), bits)
      }
    }
  }
  catch (e) {
    // bad item or skin id from API
    return ''
  }
}

const renderTiers = d => {
  if (d.tiers.length > 1) {
    const table = $('<table>').addClass('table-sm mb-3')
    _.forEach(d.tiers, (tier, index) => {
      const row = $('<tr>')
      if (tier.done) {
        row.append($('<td>').addClass('done').text('✓'))
      }
      else {
        row.append($('<td>').addClass('notdone').text('—')) 
      }
      row.append($('<td>').append($('<small>').text(`Tier ${(index + 1)}`)))
      row.append($('<td>').append($('<small>').text(`${tier.points}`).append($('<span>').addClass('ap'))))
      row.append($('<td>').append($('<small>').text(`${numberWithCommas(tier.count)} objectives completed`)))
      table.append(row)
    })

    return $('<div>').addClass('float-left').append($('<h5>').text('Tiers:'), table)
  }
  else {
    return ''
  }
}

const format = async d => {
  const div = $('<div>').addClass('details')

  div.append(renderSummary(d))
  div.append(await renderRewards(d.rewards))
  div.append(renderDescription(d))
  div.append(await renderObjective(d))
  div.append(renderTiers(d))

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
    var div = $('<div>').addClass( 'loading' ).text( 'Loading...' )
    row.child(div).show()
    tr.addClass('shown')
    row.child(await format(row.data()))
  }
}

export { details }