module.exports = mapSymbol

var map = require('./map')

function mapSymbol(currencyCode) {
  if (map.hasOwnProperty(currencyCode)) {
    return map[currencyCode]
  } else {
    return '?'
  }
}