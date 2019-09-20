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

var _DatePicker = require('rmc-date-picker/lib/DatePicker');

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _Popup = require('rmc-date-picker/lib/Popup');

var _Popup2 = _interopRequireDefault(_Popup);

var _getLocale = require('../_util/getLocale');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* tslint:disable:jsx-no-multiline-js */
var DatePicker = function (_React$Component) {
    (0, _inherits3['default'])(DatePicker, _React$Component);

    function DatePicker() {
        (0, _classCallCheck3['default'])(this, DatePicker);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).apply(this, arguments));

        _this.setScrollValue = function (v) {
            _this.scrollValue = v;
        };
        _this.onOk = function (v) {
            if (_this.scrollValue !== undefined) {
                v = _this.scrollValue;
            }
            if (_this.props.onChange) {
                _this.props.onChange(v);
            }
            if (_this.props.onOk) {
                _this.props.onOk(v);
            }
        };
        _this.onVisibleChange = function (visible) {
            _this.scrollValue = undefined;
            if (_this.props.onVisibleChange) {
                _this.props.onVisibleChange(visible);
            }
        };
        _this.fixOnOk = function (picker) {
            if (picker) {
                picker.onOk = _this.onOk;
            }
        };
        return _this;
    }

    (0, _createClass3['default'])(DatePicker, [{
        key: 'render',
        value: function render() {
            // tslint:disable-next-line:no-this-assignment
            var props = this.props,
                context = this.context;
            var children = props.children,
                value = props.value,
                popupPrefixCls = props.popupPrefixCls;

            var locale = (0, _getLocale.getComponentLocale)(props, context, 'DatePicker', function () {
                return require('./locale/zh_CN');
            });
            var okText = locale.okText,
                dismissText = locale.dismissText,
                extra = locale.extra,
                DatePickerLocale = locale.DatePickerLocale;
            /**
             * 注意:
             * 受控 表示 通过设置 value 属性、组件的最终状态跟 value 设置值一致。
             * 默认不设置 value 或 只设置 defaultValue 表示非受控。
             *
             * DatePickerView 对外通过 value “只支持 受控” 模式（可以使用 defaultDate 支持 非受控 模式，但不对外）
             * PickerView 对外通过 value “只支持 受控” 模式
             *
             * DatePicker / Picker 对外只有 value 属性 (没有 defaultValue)，
             * 其中 List 展示部分 “只支持 受控” 模式，
             * 弹出的 选择器部分 会随外部 value 改变而变、同时能自由滚动
             * （即不会因为传入的 value 不变而不能滚动 (不像原生 input 的受控行为)）
             *
             */

            var dataPicker = _react2['default'].createElement(_DatePicker2['default'], { minuteStep: props.minuteStep, locale: DatePickerLocale, minDate: props.minDate, maxDate: props.maxDate, mode: props.mode, pickerPrefixCls: props.pickerPrefixCls, prefixCls: props.prefixCls, defaultDate: value || new Date(), use12Hours: props.use12Hours, onValueChange: props.onValueChange, onScrollChange: this.setScrollValue });
            return _react2['default'].createElement(
                _Popup2['default'],
                (0, _extends3['default'])({ datePicker: dataPicker, WrapComponent: 'div', transitionName: 'am-slide-up', maskTransitionName: 'am-fade' }, props, { prefixCls: popupPrefixCls, date: value || new Date(), dismissText: this.props.dismissText || dismissText, okText: this.props.okText || okText, ref: this.fixOnOk, onVisibleChange: this.onVisibleChange }),
                children && _react2['default'].isValidElement(children) && _react2['default'].cloneElement(children, {
                    extra: value ? (0, _utils.formatFn)(this, value) : this.props.extra || extra
                })
            );
        }
    }]);
    return DatePicker;
}(_react2['default'].Component);

exports['default'] = DatePicker;

DatePicker.defaultProps = {
    mode: 'datetime',
    prefixCls: 'am-picker',
    pickerPrefixCls: 'am-picker-col',
    popupPrefixCls: 'am-picker-popup',
    minuteStep: 1,
    use12Hours: false
};
DatePicker.contextTypes = {
    antLocale: _propTypes2['default'].object
};
module.exports = exports['default'];