"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _reactIs = require("react-is");

var validateComponentProp = function validateComponentProp(props, propName, componentName) {
  if (!(0, _reactIs.isValidElementType)(props[propName])) {
    return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`.');
  }

  return null;
};

var _default = validateComponentProp;
exports["default"] = _default;