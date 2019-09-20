"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _getValue = _interopRequireDefault(require("./getValue"));

var _isReactNative = _interopRequireDefault(require("../isReactNative"));

var onChangeValue = function onChangeValue(event, _ref) {
  var name = _ref.name,
      parse = _ref.parse,
      normalize = _ref.normalize;
  // read value from input
  var value = (0, _getValue["default"])(event, _isReactNative["default"]); // parse value if we have a parser

  if (parse) {
    value = parse(value, name);
  } // normalize value


  if (normalize) {
    value = normalize(name, value);
  }

  return value;
};

var _default = onChangeValue;
exports["default"] = _default;