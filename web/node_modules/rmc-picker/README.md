# rmc-picker
---

React Mobile Picker Component (web and react-native)


[![NPM version][npm-image]][npm-url]
![react-native](https://img.shields.io/badge/react--native-%3E%3D_0.30.0-green.svg)
![react](https://img.shields.io/badge/react-%3E%3D_15.2.0-green.svg)
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rmc-picker.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rmc-picker
[travis-image]: https://img.shields.io/travis/react-component/m-picker.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/m-picker
[coveralls-image]: https://img.shields.io/coveralls/react-component/m-picker.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/m-picker?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/m-picker.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/m-picker
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rmc-picker.svg?style=flat-square
[download-url]: https://npmjs.org/package/rmc-picker

## Screenshots

<img src="https://os.alipayobjects.com/rmsportal/fOaDvpIJukLYznc.png" width="288"/>


## Development

```
npm i
npm start
```

## Example

http://localhost:8000/examples/

online example: http://react-component.github.io/m-picker/

## react-native

```
npm run rn-init
npm run watch-tsc
react-native start
react-native run-ios
```

## install

[![rmc-picker](https://nodei.co/npm/rmc-picker.png)](https://npmjs.org/package/rmc-picker)


# 4.x beta docs

> If you are looking for 3.x doc, please see [rmc-picker@3.x](https://github.com/react-component/m-picker/tree/3.x)


## Usage
```jsx
<MultiPicker
  selectedValue={this.state.value}
  onValueChange={this.onChange}
>
  <Picker indicatorClassName="my-picker-indicator">
    <Picker.Item className="my-picker-view-item" value="1">one</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="2">two</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="3">three</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="4">four</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="5">five</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="6">six</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="7">seven</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="8">eight</Picker.Item>
  </Picker>
  <Picker indicatorClassName="my-picker-indicator">
    <Picker.Item className="my-picker-view-item" value="11">eleven</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="12">twelve</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="13">thirteen</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="14">fourteen</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="15">fifteen</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="16">sixteen</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="17">seventeen</Picker.Item>
    <Picker.Item className="my-picker-view-item" value="18">eighteen</Picker.Item>
  </Picker>
</MultiPicker>
```

## API

### MultiPicker props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
|className(web) | additional css class of root dom node | String |  |
|prefixCls(web) | prefix class | String | '' |
|defaultSelectedValue(web) | default selected values | string[]/number[] |  |
|selectedValue | current selected values | string[]/number[] |  |
|onValueChange | fire when picker change | Function(value) |  |


### Picker props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
|className(web) | additional css class of root dom node | String |  |
|prefixCls(web) | prefix class | String | '' |
|defaultSelectedValue(web) | default selected values | string/number |  |
|selectedValue | current selected values | string/number |  |
|onValueChange | fire when picker change | Function(value) |  |
|disabled     | whether picker is disabled | bool | false
|indicatorClassName     | className of indicator | String |
|indicatorStyle     | style of indicator | object |

### Picker.Item props
| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
|className(web) | additional css class of root dom node | String |  |
|value | value of item | String |  |

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

rmc-picker is released under the MIT license.
