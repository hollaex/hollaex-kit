'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alert = require('./alert');

var _alert2 = _interopRequireDefault(_alert);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _operation = require('./operation');

var _operation2 = _interopRequireDefault(_operation);

var _prompt = require('./prompt');

var _prompt2 = _interopRequireDefault(_prompt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Modal2['default'].alert = _alert2['default'];
_Modal2['default'].prompt = _prompt2['default'];
_Modal2['default'].operation = _operation2['default'];
exports['default'] = _Modal2['default'];
module.exports = exports['default'];