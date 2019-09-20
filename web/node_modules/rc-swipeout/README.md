# rc-swipeout
---

iOS-style swipeout buttons that appear from behind a component (web & react-native support)

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

[npm-image]: http://img.shields.io/npm/v/rc-swipeout.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-swipeout
[travis-image]: https://img.shields.io/travis/react-component/swipeout.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/swipeout
[coveralls-image]: https://img.shields.io/coveralls/react-component/swipeout.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/swipeout?branch=master

## Screenshots

![rc-swipeout](https://zos.alipayobjects.com/rmsportal/dqxQTtxrKrGMVEc.gif)

## Installation

`npm install --save rc-swipeout`

## Development

```
web:
npm install
npm start

rn:
tnpm run rn-start
```

## Example

- local: http://localhost:8000/examples/
- online: http://react-component.github.io/swipeout/

## react-native

```
./node_modules/rc-tools run react-native-init
react-native run-ios
```

## Usage

```js
import Swipeout from 'rc-swipeout';
import 'rc-swipeout/assets/index.less'; (web only)

<Swipeout
  left={[
    {
      text: 'reply',
      onPress:() => console.log('reply'),
      style: { backgroundColor: 'orange', color: 'white' },
      className: 'custom-class-1'
    }
  ]}
  right={[
    {
      text: 'delete',
      onPress:() => console.log('delete'),
      style: { backgroundColor: 'red', color: 'white' },
      className: 'custom-class-2'
    }
  ]}
  onOpen={() => console.log('open')}
  onClose={() => console.log('close')}
>
  <div style={{height: 44}}> swipeout demo </div>
</Swipeout>

```


## API

### props

| name        | description                   | type   | default    |
|-------------|------------------------|--------|------------|
| prefixCls       | className prefix     | String | `rc-swipeout` |
| style       | swipeout style      | Object | `` |
| left       | swipeout buttons on left      | Array | `[]` |
| right       | swipeout buttons on right      | Array | `[]` |
| autoClose       | auto close on button press   | Boolean | `function() {}` |
| onOpen       |       | Function | `function() {}` |
| onClose       |       | Function | `function() {}` |
| disabled       |   disabled swipeout    | Boolean | `false` |

### button props

| name        | description                   | type   | default    |
|-------------|------------------------|--------|------------|
| text       | button text     | String | `Click` |
| style       | button style     | Object | `` |
| onPress       | button press function      | Function | `function() {}` |
| className       | button custom class     | String | `` |

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

rc-swipeout is released under the MIT license.
