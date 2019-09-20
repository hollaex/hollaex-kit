"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _getFormInitialValues = _interopRequireDefault(require("./selectors/getFormInitialValues"));

var _plain = _interopRequireDefault(require("./structure/plain"));

var _default = (0, _getFormInitialValues["default"])(_plain["default"]);

exports["default"] = _default;