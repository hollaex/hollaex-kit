'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexedList = exports.DataSource = undefined;

var _ListView = require('./ListView');

var _ListView2 = _interopRequireDefault(_ListView);

var _Indexed = require('./Indexed');

var _Indexed2 = _interopRequireDefault(_Indexed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export this package's api
_ListView2['default'].IndexedList = _Indexed2['default'];
var DataSource = _ListView2['default'].DataSource;

exports.DataSource = DataSource;
exports.IndexedList = _Indexed2['default'];
exports['default'] = _ListView2['default'];