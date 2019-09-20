'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _rmcDrawer = require('rmc-drawer');

var _rmcDrawer2 = _interopRequireDefault(_rmcDrawer);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Drawer = function (_React$Component) {
    (0, _inherits3['default'])(Drawer, _React$Component);

    function Drawer() {
        (0, _classCallCheck3['default'])(this, Drawer);
        return (0, _possibleConstructorReturn3['default'])(this, (Drawer.__proto__ || Object.getPrototypeOf(Drawer)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Drawer, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(_rmcDrawer2['default'], this.props);
        }
    }]);
    return Drawer;
}(_react2['default'].Component);

exports['default'] = Drawer;

Drawer.defaultProps = {
    prefixCls: 'am-drawer',
    enableDragHandle: false
};
module.exports = exports['default'];