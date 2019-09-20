"use strict";

exports.__esModule = true;
exports["default"] = void 0;

function keys(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(function (i) {
      return i.name;
    });
  }

  return Object.keys(value);
}

var _default = keys;
exports["default"] = _default;