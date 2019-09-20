![](https://ruigomes.me/bitcoin-address-validation.png?v=1)

# bitcoin-address-validation

[![Build Status](https://img.shields.io/travis/ruigomeseu/bitcoin-address-validation.svg)](https://travis-ci.org/ruigomeseu/bitcoin-address-validation)
[![npm version](https://badge.fury.io/js/bitcoin-address-validation.svg)](https://www.npmjs.com/package/bitcoin-address-validation)
[![David](https://img.shields.io/david/ruigomeseu/bitcoin-address-validation.svg)](https://www.npmjs.com/package/bitcoin-address-validation)
[![npm](https://img.shields.io/npm/dt/bitcoin-address-validation.svg)](https://www.npmjs.com/package/bitcoin-address-validation)
[![Twitter Follow](https://img.shields.io/twitter/follow/ruigomeseu.svg?style=social)](https://twitter.com/ruigomeseu)

Validate Bitcoin addresses - Bech32, P2PKH and P2SH! Available for ES6 and Node.js.

```js
validate('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4');

{
  bech32: true,
  testnet: false,
  address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
  type: 'p2wpkh'
}
```

## Installation
Add `bitcoin-address-validation` to your Javascript project dependencies using Yarn:
```bash
yarn add bitcoin-address-validation
```
Or NPM:
```bash
npm install bitcoin-address-validation --save
```

## Usage

### Importing
Import using ES6:

```js
import validate from 'bitcoin-address-validation';
```

Or AMD:

```js
var validate = require('bitcoin-address-validation');
```

### Validating addresses

Validation is done using the `validate(address)` function.
```js
validate('17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem')

{
  address: '17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem',
  type: 'p2pkh',
  testnet: false,
  bech32: false
}
```

#### Bech32 Example

```js
validate('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4');

{
  bech32: true,
  testnet: false,
  address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
  type: 'p2wpkh'
}
```

#### Invalid addresses

`validate(address)` will return `false` for any invalid address, regardless of the address type:

```js
validate('bc1qw508d6qejxtdg4y5r3zrrvary0c5xw7kv8f3t4')

false
```

## Author

Rui Gomes  
https://ruigomes.me  

## License

The MIT License (MIT). Please see [LICENSE file](https://github.com/ruigomeseu/bitcoin-address-validation/blob/master/LICENSE.md) for more information.
