'use strict'

// DATA TABLES PLUGIN
export default (pShape, cText, cBorder, cBar, cBack, vRound, bType) => {
  pShape = pShape || 'round'
  cText = cText || '#000'
  cBorder = cBorder || '#BCBCBC'
  cBar = cBar || '#5FD868'
  cBack = cBack || '#D6D6D6'
  vRound = vRound || 0
  bType = bType || 'collapse'
  //Bar templates
  let styleRule1 = 'max-width:100px;margin:0 auto;'
  let styleRule2 = `border:2px ${bType} ${cBorder};line-height:1.5;font-size:14px;color:${cText};background:${cBack};position:relative;`
  let styleRule3 = `height:1.5em;line-height:1.5;text-align:center;background-color:${cBar};`
  //Square is default, make template round if pShape == round
  if (pShape == 'round') {
    styleRule2 += 'border-radius:5px;'
    styleRule3 += 'border-top-left-radius:4px;border-bottom-left-radius:4px;'
  }

  return function (d, type) {
    //Remove % if found in the value
    //Round to the given parameter vRound
    let s = parseFloat(d.toString().replace(/\s%|%/g, '')).toFixed(vRound)

    //Not allowed to go over 100%
    if (s > 100) {
      s = 100
    }

    // Order, search and type gets numbers
    if (type !== 'display') {
      return s
    }
    if (typeof d !== 'number' && typeof d !== 'string') {
      return d
    }

    //Return the code for the bar
    return `<div style="${styleRule1}"><div style="${styleRule2}"><div style="${styleRule3}width:${s}%;"></div><div style="width:100%;text-align:center;position:absolute;left:0;top:0;">${s}%</div></div></div>`
  }
}