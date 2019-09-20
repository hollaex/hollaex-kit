"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _splice = _interopRequireDefault(require("./splice"));

var _getIn = _interopRequireDefault(require("./getIn"));

var _setIn = _interopRequireDefault(require("./setIn"));

var _deepEqual = _interopRequireDefault(require("./deepEqual"));

var _deleteIn = _interopRequireDefault(require("./deleteIn"));

var _keys = _interopRequireDefault(require("./keys"));

var structure = {
  allowsArrayErrors: true,
  empty: {},
  emptyList: [],
  getIn: _getIn["default"],
  setIn: _setIn["default"],
  deepEqual: _deepEqual["default"],
  deleteIn: _deleteIn["default"],
  forEach: function forEach(items, callback) {
    return items.forEach(callback);
  },
  fromJS: function fromJS(value) {
    return value;
  },
  keys: _keys["default"],
  size: function size(array) {
    return array ? array.length : 0;
  },
  some: function some(items, callback) {
    return items.some(callback);
  },
  splice: _splice["default"],
  equals: function equals(a, b) {
    return b.every(function (val) {
      return ~a.indexOf(val);
    });
  },
  orderChanged: function orderChanged(a, b) {
    return b.some(function (val, index) {
      return val !== a[index];
    });
  },
  toJS: function toJS(value) {
    return value;
  }
};
var _default = structure;
exports["default"] = _default;