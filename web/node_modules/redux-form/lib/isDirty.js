"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _isDirty = _interopRequireDefault(require("./selectors/isDirty"));

var _plain = _interopRequireDefault(require("./structure/plain"));

var _default = (0, _isDirty["default"])(_plain["default"]);

exports["default"] = _default;