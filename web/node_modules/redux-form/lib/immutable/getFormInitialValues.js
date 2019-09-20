"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _getFormInitialValues = _interopRequireDefault(require("../selectors/getFormInitialValues"));

var _immutable = _interopRequireDefault(require("../structure/immutable"));

var _default = (0, _getFormInitialValues["default"])(_immutable["default"]);

exports["default"] = _default;