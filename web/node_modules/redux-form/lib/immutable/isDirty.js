"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _isDirty = _interopRequireDefault(require("../selectors/isDirty"));

var _immutable = _interopRequireDefault(require("../structure/immutable"));

var _default = (0, _isDirty["default"])(_immutable["default"]);

exports["default"] = _default;