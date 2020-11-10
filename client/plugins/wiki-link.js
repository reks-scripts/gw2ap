'use strict'

// Load modules
import ellipsis from './ellipsis'

// DATA TABLES PLUGIN
export default (cutoff, wordbreak) => {

  const truncate = ellipsis(cutoff, wordbreak)

  return d => {
    let link = d.split(' ').join('_')
    link = link.replace(/[[\]{}|<>#"]/g, '')
    link = encodeURI(link)
    const text = truncate(d, 'display')

    return `<a href="https://wiki.guildwars2.com/wiki/Special:Search/${link}" target="_blank">${text}</a>`
  }
}