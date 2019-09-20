"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getScrollBarSize = _interopRequireDefault(require("./getScrollBarSize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(close) {
  var bodyIsOverflowing = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && window.innerWidth > document.body.offsetWidth;

  if (!bodyIsOverflowing) {
    return;
  }

  if (close) {
    document.body.style.position = '';
    document.body.style.width = '';
    return;
  }

  var scrollBarSize = (0, _getScrollBarSize.default)();

  if (scrollBarSize) {
    document.body.style.position = 'relative';
    document.body.style.width = "calc(100% - ".concat(scrollBarSize, "px)");
  }
};

exports.default = _default;