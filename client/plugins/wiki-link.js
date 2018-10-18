'use strict'

// Load modules
import { ellipsis } from './ellipsis'

// DATA TABLES PLUGIN
const wikiLink = (cutoff, wordbreak) => {

  const truncate = ellipsis(cutoff, wordbreak)
  
  // eslint-disable-next-line
  return (d, type, row) => {
    const link = d.split(' ').join('_')
    const text = truncate(d, 'display')

    return `<a href="https://wiki.guildwars2.com/wiki/${link}" target="_blank">${text}</a>`
  }
}

export { wikiLink }
