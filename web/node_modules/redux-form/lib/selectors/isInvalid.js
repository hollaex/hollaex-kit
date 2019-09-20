"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _isValid = _interopRequireDefault(require("./isValid"));

var createIsInvalid = function createIsInvalid(structure) {
  return function (form, getFormState) {
    var isValid = (0, _isValid["default"])(structure)(form, getFormState);
    return function (state) {
      return !isValid(state);
    };
  };
};

var _default = createIsInvalid;
exports["default"] = _default;