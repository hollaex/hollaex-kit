'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = undefined;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var render = exports.render = function render(rootComponent, domElement) {
  if (navigator.userAgent.match(/Node\.js/i) && window && window.reactSnapshotRender) {
    domElement.innerHTML = _server2.default.renderToString(rootComponent);
    window.reactSnapshotRender();
  } else {
    _reactDom2.default.render(rootComponent, domElement);
  }
};