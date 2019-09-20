"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _isValid = _interopRequireDefault(require("../selectors/isValid"));

var _immutable = _interopRequireDefault(require("../structure/immutable"));

var _default = (0, _isValid["default"])(_immutable["default"]);

exports["default"] = _default;