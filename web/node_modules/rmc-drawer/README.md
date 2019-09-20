# rmc-drawer
---

React Drawer Component


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rmc-drawer.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rmc-drawer
[travis-image]: https://img.shields.io/travis/react-component/m-drawer.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/m-drawer
[coveralls-image]: https://img.shields.io/coveralls/react-component/m-drawer.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/m-drawer?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/m-drawer.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/m-drawer
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rmc-drawer.svg?style=flat-square
[download-url]: https://npmjs.org/package/rmc-drawer


## Screenshots

<img src="https://os.alipayobjects.com/rmsportal/gqhazYYGIaUmunx.png" width="288"/>


## Development

```
npm install
npm start
```

## Example

http://localhost:8099/examples/


online example: http://react-component.github.io/m-drawer/


## install


[![rmc-drawer](https://nodei.co/npm/rmc-drawer.png)](https://npmjs.org/package/rmc-drawer)


## Usage

```js
var Drawer = require('rmc-drawer');
var React = require('react');
React.render(<Drawer />, container);
```

## API

### props

| Property name | Description | Type | Default |
|---------------|-------------|------|---------|
| className | additional css class of root dom node | String | '' |
| prefixCls | prefix class | String | 'rmc-drawer' |
| children | The main content | any | n/a |
| style | container styles. | Object |  |
| sidebarStyle | Inline styles. | Object | {} |
| contentStyle | Inline styles. | Object | {} |
| overlayStyle | Inline styles. | Object | {} |
| dragHandleStyle | Inline styles. | Object | {} |
| sidebar | The sidebar content | any | n/a |
| onOpenChange | Callback called when the sidebar wants to change the open prop. Happens after sliding the sidebar and when the overlay is clicked when the sidebar is open. | Function | n/a |
| open | If the sidebar should be open | Boolean | false |
| position | where to place the sidebar | String | 'left', enum{'left', 'right', 'top', 'bottom'} |
| docked | If the sidebar should be docked in document | Boolean | false |
| transitions | If transitions should be enabled | Boolean | true |
| touch | If touch gestures should be enabled | Boolean | true |
| enableDragHandle | If dragHandle should be enabled | Boolean | true |
| dragToggleDistance | Distance the sidebar has to be dragged before it will open/close after it is released. | Number | 30 |

> change from [https://github.com/balloob/react-sidebar](https://github.com/balloob/react-sidebar)


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

rmc-drawer is released under the MIT license.
