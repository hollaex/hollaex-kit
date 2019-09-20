"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _isEvent = _interopRequireDefault(require("./isEvent"));

var silenceEvent = function silenceEvent(event) {
  var is = (0, _isEvent["default"])(event);

  if (is) {
    event.preventDefault();
  }

  return is;
};

var _default = silenceEvent;
exports["default"] = _default;