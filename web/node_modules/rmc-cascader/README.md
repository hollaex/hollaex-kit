# rmc-cascader
---

React Mobile Cascader Component (web and react-native)


[![NPM version][npm-image]][npm-url]
![react-native](https://img.shields.io/badge/react--native-%3E%3D_0.28.0-green.svg)
![react](https://img.shields.io/badge/react-%3E%3D_15.2.0-green.svg)
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rmc-cascader.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rmc-cascader
[travis-image]: https://img.shields.io/travis/react-component/m-cascader.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/m-cascader
[coveralls-image]: https://img.shields.io/coveralls/react-component/m-cascader.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/m-cascader?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/m-cascader.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/m-cascader
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rmc-cascader.svg?style=flat-square
[download-url]: https://npmjs.org/package/rmc-cascader


## Screenshots

### web

<img src="https://os.alipayobjects.com/rmsportal/EJtTSrdrAcdTbFm.png" width="288"/>

### native

<img src="https://img.alicdn.com/tps/TB1tlMtKpXXXXazXXXXXXXXXXXX-397-709.png" width="288"/>

## Development

```
npm i
npm start
```

## Example

http://localhost:8000/examples/

online example: http://react-component.github.io/m-cascader/

## react-native

```
npm run rn-init
npm run watch-tsc
react-native start
react-native run-ios
```

## install

[![rmc-cascader](https://nodei.co/npm/rmc-cascader.png)](https://npmjs.org/package/rmc-cascader)


## API

### Cascader props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
|className(web) | additional css class of root dom node | String | '' |
|prefixCls(web) | prefix class | String | 'rmc-cascader' |
|pickerPrefixCls(web) | picker prefix class | String | 'rmc-picker' |
|pickerItemStyle | picker item style | {} |  |
|data | The data of cascade | array  |  |
|value | selected value | array  |  |
|defaultValue | initial selected value | array  |  |
|onChange |  | Function(value) | - |


### rmc-cascader/lib/Popup props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
|className(web) | additional css class of modal node | String | '' |
|prefixCls(web) | prefix class | String | 'rmc-picker-popup' |
|style(web) | additional style | object | {} |
|value | selected value | array  |  |
|cascader | React Cascader element |   |  |
|onChange | exec on ok | Function(value) |  |
|onDismiss | exec on dismiss | function |  |
|okText | ok button text | String | 'Ok' |
|dismissText | dismiss button text | String | 'Dismiss' |
|title | Popup title | String | '' |
|visible | whether pop picker is visible | Boolean | |
|onVisibleChange | called when pop picker visible change | Function | |

## Test Case

```
npm test
npm run chrome-test
```

## Coverage

```
npm run coverage
```

open coverage/ dir

## License

rmc-cascader is released under the MIT license.
