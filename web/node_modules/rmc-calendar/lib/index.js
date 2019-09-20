'use strict';

exports.__esModule = true;
exports.Locale = exports.DatePicker = exports.Calendar = undefined;

var _Calendar = require('./Calendar');

Object.defineProperty(exports, 'Calendar', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Calendar)['default'];
  }
});

var _DatePicker = require('./DatePicker');

Object.defineProperty(exports, 'DatePicker', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DatePicker)['default'];
  }
});

var _zh_CN = require('./locale/zh_CN');

var _zh_CN2 = _interopRequireDefault(_zh_CN);

var _en_US = require('./locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Locale = { zhCN: _zh_CN2['default'], enUS: _en_US2['default'] };
exports.Locale = Locale;