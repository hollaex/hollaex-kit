"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var isReactNative = typeof window !== 'undefined' && window.navigator && window.navigator.product && window.navigator.product === 'ReactNative';
var _default = isReactNative;
exports["default"] = _default;