"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _isEqualWith2 = _interopRequireDefault(require("lodash/isEqualWith"));

var _immutable = require("immutable");

var isEmpty = function isEmpty(obj) {
  return (0, _isNil2["default"])(obj) || obj === '' || isNaN(obj);
};

var customizer = function customizer(obj, other) {
  if (obj === other) return true;

  if (!obj && !other) {
    return isEmpty(obj) === isEmpty(other);
  }

  if (_immutable.Iterable.isIterable(obj) && _immutable.Iterable.isIterable(other)) {
    return obj.count() === other.count() && obj.every(function (value, key) {
      return other.has(key) && (0, _isEqualWith2["default"])(value, other.get(key), customizer);
    });
  }

  return void 0;
};

var deepEqual = function deepEqual(a, b) {
  return (0, _isEqualWith2["default"])(a, b, customizer);
};

var _default = deepEqual;
exports["default"] = _default;