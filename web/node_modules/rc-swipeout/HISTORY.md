# History

# 2.0.7
- add browserslist config file, then tell babel need to add prefix for `display: flex`.
- refine swipe and demo
- fix: https://github.com/ant-design/ant-design-mobile/issues/1954 (#56)

# 2.0.6

- fix: https://github.com/ant-design/ant-design-mobile/issues/1954 As rc-gesture revert preventDefault in v0.0.19 for tabs+listview issue (https://github.com/ant-design/ant-design-mobile/issues/2589).
- Then, rc-gesture@v0.0.20 fixed this issue by exposing the `event` as a property of Gesture object, and the Gesture object will be passed as the first parameter when invoked panMove event callback.
- So, `rc-swipeout` invokes `event.preventDefault()` to prevent scroll event when pan moving.

# 2.0.0

- replace `hammer.js` width [rc-gesture](https://github.com/react-component/gesture)

# 1.4.5

- replace `object.omit`, update style

# ~1.4.4

- improve: disabled swipe if deltaX < deltaY

# 1.4.0

- improve: auto width for swipe buttons, #40

# 1.3.8

- fixed: only one hand can be swiped if left or right is null.

# ~1.3.7

-  fixed `removeEventListener` bug;
-  fixed binding and unbinding event bug;
-  support es module;
-  update deps;

# 1.3.1

- update react-native-swipeout version

# 1.2.7

- new: role="button"

# 1.2.6

- new: support `className` for button;

# 1.2.5

- fix: onCloseSwipe prefixCls bug;

## 1.2.3

- add cover `div`, for body touchstart
- fix: buttons cannot be hidden when pan short distance

## 1.2.2

- prevent default of event;

## 1.2.1

- support `onClose` for rn;

## 1.2.0

- click body to close swipe buttons; #19, #10
- support event arg for onPress; #18
- swipe to close for web;

## 1.1.5

- fix issue/9

## 1.1.4

- use babel-runtime

## 1.1.3

- update deps

## 1.1.0

- [`new`] react-native support

## 1.0.2

- [`fix`] error if this.refs.left/right is []

## 1.0.1
- [`fix`] npm package empty

## 1.0.0
init project
