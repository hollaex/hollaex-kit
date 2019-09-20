"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _toPath2 = _interopRequireDefault(require("lodash/toPath"));

var _immutable = require("immutable");

var _deepEqual = _interopRequireDefault(require("./deepEqual"));

var _keys = _interopRequireDefault(require("./keys"));

var _setIn = _interopRequireDefault(require("./setIn"));

var _splice = _interopRequireDefault(require("./splice"));

var _getIn = _interopRequireDefault(require("../plain/getIn"));

var emptyList = (0, _immutable.List)();
var structure = {
  allowsArrayErrors: false,
  empty: (0, _immutable.Map)(),
  emptyList: emptyList,
  getIn: function getIn(state, field) {
    return _immutable.Iterable.isIterable(state) ? state.getIn((0, _toPath2["default"])(field)) : (0, _getIn["default"])(state, field);
  },
  setIn: _setIn["default"],
  deepEqual: _deepEqual["default"],
  deleteIn: function deleteIn(state, field) {
    return state.deleteIn((0, _toPath2["default"])(field));
  },
  forEach: function forEach(items, callback) {
    items.forEach(callback);
  },
  fromJS: function fromJS(jsValue) {
    return (0, _immutable.fromJS)(jsValue, function (key, value) {
      return _immutable.Iterable.isIndexed(value) ? value.toList() : value.toMap();
    });
  },
  keys: _keys["default"],
  size: function size(list) {
    return list ? list.size : 0;
  },
  some: function some(items, callback) {
    return items.some(callback);
  },
  splice: _splice["default"],
  equals: function equals(a, b) {
    return b.equals(a) ? true : b.toSet().equals(a.toSet());
  },
  orderChanged: function orderChanged(a, b) {
    return b.some(function (val, index) {
      return val !== a.get(index);
    });
  },
  toJS: function toJS(value) {
    return _immutable.Iterable.isIterable(value) ? value.toJS() : value;
  }
};
var _default = structure;
exports["default"] = _default;