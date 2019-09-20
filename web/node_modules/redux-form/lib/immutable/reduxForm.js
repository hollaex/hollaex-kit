"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _createReduxForm = _interopRequireDefault(require("../createReduxForm"));

var _immutable = _interopRequireDefault(require("../structure/immutable"));

var _default = (0, _createReduxForm["default"])(_immutable["default"]);

exports["default"] = _default;