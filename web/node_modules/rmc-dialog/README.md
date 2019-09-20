# m-dialog
---

react dialog component for mobile

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rmc-dialog.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rmc-dialog
[travis-image]: https://img.shields.io/travis/react-component/m-dialog.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/m-dialog
[coveralls-image]: https://img.shields.io/coveralls/react-component/m-dialog.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/m-dialog?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/m-dialog.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/m-dialog
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rmc-dialog.svg?style=flat-square
[download-url]: https://npmjs.org/package/rmc-dialog

## Screenshot

<img src="http://gtms04.alicdn.com/tps/i4/TB1dp5lHXXXXXbmXpXXyVug.FXX-664-480.png" />

## Install

[![rmc-dialog](https://nodei.co/npm/rmc-dialog.png)](https://npmjs.org/package/rmc-dialog)

## Usage

```js
var Dialog = require('rmc-dialog');

ReactDOM.render(
  <Dialog title={title} onClose={callback1} visible>
      <p>first dialog</p>
  </Dialog>
), document.getElementById('t1'));

// use dialog
```

## API

### rmc-dialog(web)

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
| prefixCls | The dialog dom node's prefixCls | String | `rmc-dialog` |
| className | additional className for dialog | String |  |
| wrapClassName | additional className for dialog wrap | String |  |
| style | Root style for dialog element.Such as width, height | Object | {} |
| zIndex | z-index | Number |  |
| bodyStyle | body style for dialog body element.Such as height | Object | {} |
| maskStyle | style for mask element. | Object | {} |
| visible | current dialog's visible status | Boolean | false |
| animation | part of dialog animation css class name | String |  |
| maskAnimation | part of dialog's mask animation css class name | String |  |
| transitionName | dialog animation css class name | String |  |
| maskTransitionName | mask animation css class name | String |  |
| title | Title of the dialog | String|React.Element |  |
| footer | footer of the dialog | React.Element |  |
| closable | whether show close button | Boolean | true |
| mask | whether show mask | Boolean | true |
| maskClosable | whether click mask to close | Boolean | true |
| onClose | called when click close button or mask | function |  |

### rmc-dialog/lib/Dialog (react-native)

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
| wrapStyle | style for modal wrap | Object | {} |
| maskStyle | style for modal mask | Object | {} |
| style | style for modal | Object | {} |
| animationType | animation type for modal content, can be one of `none|fade|slide-up|slide-down` | String | slide-up |
| animationDuration | animation duration | number | 300 |
| visible | visible state | boolean | false |
| animateAppear | whether animation on first show | boolean | false |
| onClose | called when close | Function | ()=>void |
| onAnimationEnd | called when animation end | Function | (visible:boolean)=>void (animationType !== 'none') |


## Development

```
npm install
npm start
```

## Example

http://localhost:8007/examples/

online example: http://react-component.github.io/m-dialog/

## react-native

```
npm run rn-init
npm run watch-tsc
react-native start
react-native run-ios
```

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

rmc-dialog is released under the MIT license.
