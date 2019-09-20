# currency-symbol-map

A function to lookup the currency symbol for a given currency code

## Installation

    npm install currency-symbol-map

## Usage

```js
var getSymbol = require('currency-symbol-map')
getSymbol('GBP') //=> '£'
getSymbol('EUR') //=> '€'
getSymbol('USD') //=> '$'
getSymbol('NOT A VALID CODE') //=> '?'
```

## Credits

Currency symbols originally sourced from [xe](http://www.xe.com/symbols.php), but maintained
and updated by [contributors](https://github.com/bengourley/currency-symbol-map/pulls?q=is%3Apr+is%3Aclosed).
