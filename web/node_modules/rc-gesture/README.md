# rc-gesture
---

Support gesture for react component, inspired by [hammer.js](https://github.com/hammerjs/hammer.js) and [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger).

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-gesture.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-gesture
[travis-image]: https://img.shields.io/travis/react-component/gesture.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/gesture
[coveralls-image]: https://img.shields.io/coveralls/react-component/gesture.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/gesture?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/gesture.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/gesture
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-gesture.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-gesture

## Screenshots


## Features



## Install

```bash
npm install --save rc-gesture
```

[![rc-gesture](https://nodei.co/npm/rc-gesture.png)](https://npmjs.org/package/rc-gesture)

## Usage

```tsx
import Gesture from 'rc-gesture';

ReactDOM.render(
  <Gesture
    onTap={(gestureStatus) => { console.log(gestureStatus); }}
  >
    <div>container</div>
  </Gesture>,
container);
```


## API

all callback funtion will have one parammeter: `type GestureHandler = (s: IGestureStatus) => void;`

- gesture: the rc-gesture state object, which contain all information you may need, see [gesture](#gesture)

### props:

#### common props
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>direction</td>
          <td>string</td>
          <th>`all`</th>
          <td>control the allowed gesture direction, could be `['all', 'vertical', 'horizontal']`</td>
      </tr>
</table>

#### Tap & Press
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>onTap</td>
          <td>function</td>
          <th></th>
          <td>single tap callback</td>
      </tr>
      <tr>
          <td>onPress</td>
          <td>function</td>
          <th></th>
          <td>long tap callback</td>
      </tr>
      <tr>
          <td>onPressOut</td>
          <td>function</td>
          <th></th>
          <td>long tap end callback</td>
      </tr>
</table>

#### Swipe
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>onSwipe</td>
          <td>function</td>
          <th></th>
          <td>swipe callback, will triggered at the same time of all of below callback</td>
      </tr>
      <tr>
          <td>onSwipeLeft</td>
          <td>function</td>
          <th></th>
          <td>swipe left callback</td>
      </tr>
      <tr>
          <td>onSwipeRight</td>
          <td>function</td>
          <th></th>
          <td>swipe right callback</td>
      </tr>
      <tr>
          <td>onSwipeTop</td>
          <td>function</td>
          <th></th>
          <td>swipe top callback</td>
      </tr>
      <tr>
          <td>onSwipeBottom</td>
          <td>function</td>
          <th></th>
          <td>swipe bottom callback</td>
      </tr>
    </tbody>
</table>

#### Pan
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>onPan</td>
          <td>function</td>
          <th></th>
          <td>pan callback, will triggered at the same time of all of below callback</td>
      </tr>
      <tr>
          <td>onPanStart</td>
          <td>function</td>
          <th></th>
          <td>drag start callback</td>
      </tr>
      <tr>
          <td>onPanMove</td>
          <td>function</td>
          <th></th>
          <td>drag move callback</td>
      </tr>
      <tr>
          <td>onPanEnd</td>
          <td>function</td>
          <th></th>
          <td>drag end callback</td>
      </tr>
      <tr>
          <td>onPanCancel</td>
          <td>function</td>
          <th></th>
          <td>drag cancel callback</td>
      </tr>
      <tr>
          <td>onPanLeft</td>
          <td>function</td>
          <th></th>
          <td>pan left callback</td>
      </tr>
      <tr>
          <td>onPanRight</td>
          <td>function</td>
          <th></th>
          <td>pan right callback</td>
      </tr>
      <tr>
          <td>onPanTop</td>
          <td>function</td>
          <th></th>
          <td>pan top callback</td>
      </tr>
      <tr>
          <td>onPanBottom</td>
          <td>function</td>
          <th></th>
          <td>pan bottom callback</td>
      </tr>
    </tbody>
</table>

#### Pinch

pinch gesture is not enabled by default, you must set `props.enablePinch = true` at first;

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>onPinch</td>
          <td>function</td>
          <th></th>
          <td>pinch callback, will triggered at the same time of all of below callback</td>
      </tr>
      <tr>
          <td>onPinchStart</td>
          <td>function</td>
          <th></th>
          <td>pinch start callback</td>
      </tr>
      <tr>
          <td>onPinchMove</td>
          <td>function</td>
          <th></th>
          <td>pinch move callback</td>
      </tr>
      <tr>
          <td>onPinchEnd</td>
          <td>function</td>
          <th></th>
          <td>pinch end callback</td>
      </tr>
      <tr>
          <td>onPanCancel</td>
          <td>function</td>
          <th></th>
          <td>pinch cancel callback</td>
      </tr>
      <tr>
          <td>onPinchIn</td>
          <td>function</td>
          <th></th>
          <td>pinch in callback</td>
      </tr>
      <tr>
          <td>onPinchOut</td>
          <td>function</td>
          <th></th>
          <td>pinch out callback</td>
      </tr>
    </tbody>
</table>


#### Rotate

pinch gesture is not enabled by default, you must set `props.enableRotate = true` at first;

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>onRotate</td>
          <td>function</td>
          <th></th>
          <td>rotate callback, will triggered at the same time of all of below callback</td>
      </tr>
      <tr>
          <td>onRotateStart</td>
          <td>function</td>
          <th></th>
          <td>rotate start callback</td>
      </tr>
      <tr>
          <td>onRotateMove</td>
          <td>function</td>
          <th></th>
          <td>rotate move callback</td>
      </tr>
      <tr>
          <td>onRotateEnd</td>
          <td>function</td>
          <th></th>
          <td>rotate end callback</td>
      </tr>
      <tr>
          <td>onRotateCancel</td>
          <td>function</td>
          <th></th>
          <td>rotate cancel callback</td>
      </tr>
    </tbody>
</table>

## gesture

```tsx
// http://hammerjs.github.io/api/#event-object
export interface IGestureStauts {
    /* start status snapshot */
    startTime: number;
    startTouches: Finger[];

    startMutliFingerStatus?: MultiFingerStatus[];

    /* now status snapshot */
    time: number;
    touches: Finger[];

    mutliFingerStatus?: MultiFingerStatus[];

    /* delta status from touchstart to now, just for singe finger */
    moveStatus?: SingeFingerMoveStatus;

    /* whether is a long tap */
    press?: boolean;

    /* whether is a swipe*/
    swipe?: boolean;
    direction?: number;

    /* whether is in pinch process */
    pinch?: boolean;
    scale?: number;

    /* whether is in rotate process */
    rotate?: boolean;
    rotation?: number; // Rotation (in deg) that has been done when multi-touch. 0 on a single touch.
};
```

## Development

```
npm install
npm start
```

## Example

`npm start` and then go to `http://localhost:8005/examples/`

Online examples: [http://react-component.github.io/gesture/](http://react-component.github.io/gesture/)

## Test Case

`http://localhost:8005/tests/runner.html?coverage`

## Coverage

`http://localhost:8005/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8088/tests/runner.html?coverage`

## License

`rc-gesture` is released under the MIT license.
