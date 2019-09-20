"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _immutable = require("immutable");

var _keys = _interopRequireDefault(require("../plain/keys"));

var empty = (0, _immutable.List)();

var keys = function keys(value) {
  if (_immutable.List.isList(value)) {
    return value.map(function (i) {
      return i.name;
    });
  }

  if (_immutable.Iterable.isIterable(value)) {
    return value.keySeq();
  }

  return value ? (0, _immutable.List)((0, _keys["default"])(value)) : empty;
};

var _default = keys;
exports["default"] = _default;