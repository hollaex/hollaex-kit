"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _createFormValues = _interopRequireDefault(require("./createFormValues"));

var _plain = _interopRequireDefault(require("./structure/plain"));

var _default = (0, _createFormValues["default"])(_plain["default"]);

exports["default"] = _default;