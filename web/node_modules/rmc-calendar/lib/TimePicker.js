'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcDatePicker = require('rmc-date-picker');

var _rmcDatePicker2 = _interopRequireDefault(_rmcDatePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TimePicker = function (_React$PureComponent) {
    (0, _inherits3['default'])(TimePicker, _React$PureComponent);

    function TimePicker() {
        (0, _classCallCheck3['default'])(this, TimePicker);

        var _this = (0, _possibleConstructorReturn3['default'])(this, _React$PureComponent.apply(this, arguments));

        _this.onDateChange = function (date) {
            var onValueChange = _this.props.onValueChange;

            onValueChange && onValueChange(date);
        };
        return _this;
    }

    TimePicker.prototype.getMinTime = function getMinTime(date) {
        var minDate = this.props.minDate;
        if (!date || date.getFullYear() > minDate.getFullYear() || date.getMonth() > minDate.getMonth() || date.getDate() > minDate.getDate()) {
            return TimePicker.defaultProps.minDate;
        }
        return minDate;
    };

    TimePicker.prototype.getMaxTime = function getMaxTime(date) {
        var maxDate = this.props.maxDate;
        if (!date || date.getFullYear() < maxDate.getFullYear() || date.getMonth() < maxDate.getMonth() || date.getDate() < maxDate.getDate()) {
            return TimePicker.defaultProps.maxDate;
        }
        return maxDate;
    };

    TimePicker.prototype.render = function render() {
        var _props = this.props,
            locale = _props.locale,
            title = _props.title,
            value = _props.value,
            defaultValue = _props.defaultValue,
            prefixCls = _props.prefixCls,
            pickerPrefixCls = _props.pickerPrefixCls,
            clientHeight = _props.clientHeight;

        var date = value || defaultValue || undefined;
        var height = clientHeight && clientHeight * 3 / 8 - 52 || Number.POSITIVE_INFINITY;
        return _react2['default'].createElement(
            'div',
            { className: 'time-picker' },
            _react2['default'].createElement(
                'div',
                { className: 'title' },
                title
            ),
            _react2['default'].createElement(_rmcDatePicker2['default'], { prefixCls: prefixCls, pickerPrefixCls: pickerPrefixCls, style: {
                    height: height > 164 || height < 0 ? 164 : height,
                    overflow: 'hidden'
                }, mode: 'time', date: date, locale: locale, minDate: this.getMinTime(date), maxDate: this.getMaxTime(date), onDateChange: this.onDateChange, use12Hours: true })
        );
    };

    return TimePicker;
}(_react2['default'].PureComponent);

exports['default'] = TimePicker;

TimePicker.defaultProps = {
    minDate: new Date(0, 0, 0, 0, 0),
    maxDate: new Date(9999, 11, 31, 23, 59, 59),
    defaultValue: new Date(2000, 1, 1, 8)
};
module.exports = exports['default'];