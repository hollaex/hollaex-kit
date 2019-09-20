"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetWarned = resetWarned;
exports["default"] = void 0;

var _warning = _interopRequireDefault(require("warning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var warned = {};

function resetWarned() {
  warned = {};
}

var _default = function _default(valid, component, message) {
  if (!valid && !warned[message]) {
    (0, _warning["default"])(false, "[antd: ".concat(component, "] ").concat(message));
    warned[message] = true;
  }
};

exports["default"] = _default;
//# sourceMappingURL=warning.js.map
