'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultTabBar = undefined;

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcTabs = require('rmc-tabs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DefaultTabBar = exports.DefaultTabBar = function (_RMCDefaultTabBar) {
    (0, _inherits3['default'])(DefaultTabBar, _RMCDefaultTabBar);

    function DefaultTabBar() {
        (0, _classCallCheck3['default'])(this, DefaultTabBar);
        return (0, _possibleConstructorReturn3['default'])(this, (DefaultTabBar.__proto__ || Object.getPrototypeOf(DefaultTabBar)).apply(this, arguments));
    }

    return DefaultTabBar;
}(_rmcTabs.DefaultTabBar);

DefaultTabBar.defaultProps = (0, _extends3['default'])({}, _rmcTabs.DefaultTabBar.defaultProps, { prefixCls: 'am-tabs-default-bar' });

var Tabs = function (_React$PureComponent) {
    (0, _inherits3['default'])(Tabs, _React$PureComponent);

    function Tabs() {
        (0, _classCallCheck3['default'])(this, Tabs);

        var _this2 = (0, _possibleConstructorReturn3['default'])(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).apply(this, arguments));

        _this2.renderTabBar = function (props) {
            var renderTab = _this2.props.renderTab;

            return _react2['default'].createElement(DefaultTabBar, (0, _extends3['default'])({}, props, { renderTab: renderTab }));
        };
        return _this2;
    }

    (0, _createClass3['default'])(Tabs, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(_rmcTabs.Tabs, (0, _extends3['default'])({ renderTabBar: this.renderTabBar }, this.props));
        }
    }]);
    return Tabs;
}(_react2['default'].PureComponent);

exports['default'] = Tabs;

Tabs.DefaultTabBar = DefaultTabBar;
Tabs.defaultProps = {
    prefixCls: 'am-tabs'
};