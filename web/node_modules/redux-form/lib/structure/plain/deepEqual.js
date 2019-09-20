"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _isEqualWith2 = _interopRequireDefault(require("lodash/isEqualWith"));

var _react = _interopRequireDefault(require("react"));

var isEmpty = function isEmpty(obj) {
  return (0, _isNil2["default"])(obj) || obj === '' || isNaN(obj);
};

var customizer = function customizer(obj, other) {
  if (obj === other) return true;

  if (!obj && !other) {
    return isEmpty(obj) === isEmpty(other);
  }

  if (obj && other && obj._error !== other._error) return false;
  if (obj && other && obj._warning !== other._warning) return false;
  if (_react["default"].isValidElement(obj) || _react["default"].isValidElement(other)) return false;
};

var deepEqual = function deepEqual(a, b) {
  return (0, _isEqualWith2["default"])(a, b, customizer);
};

var _default = deepEqual;
exports["default"] = _default;