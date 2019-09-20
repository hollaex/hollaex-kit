"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var isEvent = function isEvent(candidate) {
  return !!(candidate && candidate.stopPropagation && candidate.preventDefault);
};

var _default = isEvent;
exports["default"] = _default;