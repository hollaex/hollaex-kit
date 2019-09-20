'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcCalendar = require('rmc-calendar');

var _getLocale = require('../_util/getLocale');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Calendar = function (_React$Component) {
    (0, _inherits3['default'])(Calendar, _React$Component);

    function Calendar() {
        (0, _classCallCheck3['default'])(this, Calendar);
        return (0, _possibleConstructorReturn3['default'])(this, (Calendar.__proto__ || Object.getPrototypeOf(Calendar)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Calendar, [{
        key: 'render',
        value: function render() {
            // tslint:disable-next-line:no-this-assignment
            var props = this.props,
                context = this.context;

            var locale = (0, _getLocale.getComponentLocale)(props, context, 'Calendar', function () {
                return require('./locale/zh_CN');
            });
            var Header = _rmcCalendar.Calendar.DefaultHeader;
            return _react2['default'].createElement(_rmcCalendar.Calendar, (0, _extends3['default'])({ locale: locale
                // tslint:disable-next-line:jsx-no-multiline-js
                , renderHeader: function renderHeader(headerProps) {
                    return _react2['default'].createElement(Header, (0, _extends3['default'])({}, headerProps, { closeIcon: _react2['default'].createElement(_icon2['default'], { type: 'cross' }) }));
                } }, props));
        }
    }]);
    return Calendar;
}(_react2['default'].Component);

exports['default'] = Calendar;

Calendar.defaultProps = {
    prefixCls: 'am-calendar',
    timePickerPrefixCls: 'am-picker',
    timePickerPickerPrefixCls: 'am-picker-col'
};
Calendar.contextTypes = {
    antLocale: _propTypes2['default'].object
};
module.exports = exports['default'];