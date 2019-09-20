"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _createFormValueSelector = _interopRequireDefault(require("../createFormValueSelector"));

var _immutable = _interopRequireDefault(require("../structure/immutable"));

var _default = (0, _createFormValueSelector["default"])(_immutable["default"]);

exports["default"] = _default;