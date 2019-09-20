"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _getFormError = _interopRequireDefault(require("./selectors/getFormError"));

var _plain = _interopRequireDefault(require("./structure/plain"));

var _default = (0, _getFormError["default"])(_plain["default"]);

exports["default"] = _default;