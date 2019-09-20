# zscroller
---

dom scroller based on [zynga scroller](https://zynga.github.io/scroller/)


[![NPM version][npm-image]][npm-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/zscroller.svg?style=flat-square
[npm-url]: http://npmjs.org/package/zscroller
[travis-image]: https://img.shields.io/travis/yiminghe/zscroller.svg?style=flat-square
[travis-url]: https://travis-ci.org/yiminghe/zscroller
[coveralls-image]: https://img.shields.io/coveralls/yiminghe/zscroller.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yiminghe/zscroller?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/yiminghe/zscroller.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/yiminghe/zscroller
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/zscroller.svg?style=flat-square
[download-url]: https://npmjs.org/package/zscroller


## Usage

```
import DOMScroller from 'zscroller/lib/DOMScroller';
var domScroller = new DOMScroller(contentNode, options);
```

## Example

http://localhost:8000/examples/

online example: http://yiminghe.github.io/zscroller/

## install

[![zscroller](https://nodei.co/npm/zscroller.png)](https://npmjs.org/package/zscroller)


## API

### options

most same with [zynga scroller](https://zynga.github.io/scroller/), extra:

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
|scrollbars |whether show scrollbars | bool | false |
|onScroll | onScroll callback | () => void | null |

### method



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

zscroller is released under the MIT license.
