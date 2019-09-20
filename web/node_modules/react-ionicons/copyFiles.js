'use strict'

const fs = require('fs')

fs.createReadStream('./lib/index.js').pipe(fs.createWriteStream('./docs/node_modules/react-ionicons/lib/index.js'))
fs.createReadStream('./lib/icons.js').pipe(fs.createWriteStream('./docs/node_modules/react-ionicons/lib/icons.js'))
fs.createReadStream('./lib/SVG.js').pipe(fs.createWriteStream('./docs/node_modules/react-ionicons/lib/SVG.js'))
