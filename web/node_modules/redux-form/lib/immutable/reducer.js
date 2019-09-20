"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _createReducer = _interopRequireDefault(require("../createReducer"));

var _immutable = _interopRequireDefault(require("../structure/immutable"));

var _default = (0, _createReducer["default"])(_immutable["default"]);

exports["default"] = _default;