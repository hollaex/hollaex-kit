"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _isInvalid = _interopRequireDefault(require("./selectors/isInvalid"));

var _plain = _interopRequireDefault(require("./structure/plain"));

var _default = (0, _isInvalid["default"])(_plain["default"]);

exports["default"] = _default;