# rmc-tooltip
---

React Tooltip

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rmc-tooltip.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rmc-tooltip
[travis-image]: https://img.shields.io/travis/react-component/m-tooltip.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/m-tooltip
[coveralls-image]: https://img.shields.io/coveralls/react-component/m-tooltip.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/m-tooltip?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/m-tooltip.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/m-tooltip
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rmc-tooltip.svg?style=flat-square
[download-url]: https://npmjs.org/package/rmc-tooltip

## Screenshot

<img src="http://gtms03.alicdn.com/tps/i3/TB1NQUSHpXXXXaUXFXXlQqyZXXX-1312-572.png" width="600"/>

## Install

[![rmc-tooltip](https://nodei.co/npm/rmc-tooltip.png)](https://npmjs.org/package/rmc-tooltip)

## Usage

```js
var Tooltip = require('rmc-tooltip');
var React = require('react');
var ReactDOM = require('react-dom');

// By default, the tooltip has no style.
// Consider importing the stylesheet it comes with:
// 'rmc-tooltip/assets/bootstrap_white.css'

ReactDOM.render(<Tooltip placement="left" overlay={<span>tooltip</span>}><a href='#'>hover</a></Tooltip>, container);
```

## Examples

`npm start` and then go to
[http://localhost:8007/examples](http://localhost:8007/examples)

Online examples: [http://react-component.github.io/tooltip/examples/](http://react-component.github.io/tooltip/examples/)

## API

### Props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>overlayClassName</td>
          <td>string</td>
          <td></td>
          <td>additional className added to popup overlay</td>
        </tr>
        <tr>
          <td>overlayStyle</td>
          <td>Object</td>
          <td></td>
          <td>additional style of overlay node</td>
        </tr>
        <tr>
          <td>prefixCls</td>
          <td>String</td>
          <td>rmc-tooltip</td>
          <td>prefix class name</td>
        </tr>
        <tr>
          <td>transitionName</td>
          <td>String</td>
          <td></td>
          <td>same as https://github.com/react-component/css-transition-group</td>
        </tr>
        <tr>
          <td>onVisibleChange</td>
          <td>Function</td>
          <td></td>
          <td>call when visible is changed</td>
        </tr>
        <tr>
          <td>afterVisibleChange</td>
          <td>Function</td>
          <td></td>
          <td>call after visible is changed</td>
        </tr>
        <tr>
          <td>visible</td>
          <td>boolean</td>
          <td></td>
          <td>whether tooltip is visible</td>
        </tr>
        <tr>
          <td>defaultVisible</td>
          <td>boolean</td>
          <td></td>
          <td>whether tooltip is visible initially</td>
        </tr>
        <tr>
          <td>placement</td>
          <td>String</td>
          <td></td>
          <td>one of ['left','right','top','bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight']</td>
        </tr>
        <tr>
          <td>align</td>
          <td>Object: alignConfig of [dom-align](https://github.com/yiminghe/dom-align)</td>
          <td></td>
          <td>value will be merged into placement's config</td>
        </tr>
        <tr>
          <td>onPopupAlign</td>
          <td>function(popupDomNode, align)</td>
          <td></td>
          <td>callback when popup node is aligned</td>
        </tr>
        <tr>
          <td>overlay</td>
          <td>React.Element | () => React.Element</td>
          <td></td>
          <td>popup content</td>
        </tr>
        <tr>
          <td>arrowContent</td>
          <td>React.Node</td>
          <td>null</td>
          <td>arrow content</td>
        </tr>
        <tr>
          <td>getTooltipContainer</td>
          <td>function</td>
          <td></td>
          <td>Function returning html node which will act as tooltip container. By default the tooltip attaches to the body. If you want to change the container, simply return a new element.</td>
        </tr>
        <tr>
          <td>destroyTooltipOnHide</td>
          <td>boolean</td>
          <td>false</td>
          <td>whether destroy tooltip when tooltip is hidden</td>
        </tr>
    </tbody>
</table>

## Note

`Tooltip` requires child node accepts `onClick` event.


## Development

```bash
npm install
npm start
```

## Test Case

```bash
npm test
npm run chrome-test
```

## Coverage

```bash
npm run coverage
```

## License

`rmc-tooltip` is released under the MIT license.
