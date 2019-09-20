import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* tslint:disable:jsx-no-multiline-js */
import PropTypes from 'prop-types';
import React from 'react';
import RCDatePicker from 'rmc-date-picker/es/DatePicker';
import PopupDatePicker from 'rmc-date-picker/es/Popup';
import { getComponentLocale } from '../_util/getLocale';
import { formatFn } from './utils';

var DatePicker = function (_React$Component) {
    _inherits(DatePicker, _React$Component);

    function DatePicker() {
        _classCallCheck(this, DatePicker);

        var _this = _possibleConstructorReturn(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).apply(this, arguments));

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

    _createClass(DatePicker, [{
        key: 'render',
        value: function render() {
            // tslint:disable-next-line:no-this-assignment
            var props = this.props,
                context = this.context;
            var children = props.children,
                value = props.value,
                popupPrefixCls = props.popupPrefixCls;

            var locale = getComponentLocale(props, context, 'DatePicker', function () {
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

            var dataPicker = React.createElement(RCDatePicker, { minuteStep: props.minuteStep, locale: DatePickerLocale, minDate: props.minDate, maxDate: props.maxDate, mode: props.mode, pickerPrefixCls: props.pickerPrefixCls, prefixCls: props.prefixCls, defaultDate: value || new Date(), use12Hours: props.use12Hours, onValueChange: props.onValueChange, onScrollChange: this.setScrollValue });
            return React.createElement(
                PopupDatePicker,
                _extends({ datePicker: dataPicker, WrapComponent: 'div', transitionName: 'am-slide-up', maskTransitionName: 'am-fade' }, props, { prefixCls: popupPrefixCls, date: value || new Date(), dismissText: this.props.dismissText || dismissText, okText: this.props.okText || okText, ref: this.fixOnOk, onVisibleChange: this.onVisibleChange }),
                children && React.isValidElement(children) && React.cloneElement(children, {
                    extra: value ? formatFn(this, value) : this.props.extra || extra
                })
            );
        }
    }]);

    return DatePicker;
}(React.Component);

export default DatePicker;

DatePicker.defaultProps = {
    mode: 'datetime',
    prefixCls: 'am-picker',
    pickerPrefixCls: 'am-picker-col',
    popupPrefixCls: 'am-picker-popup',
    minuteStep: 1,
    use12Hours: false
};
DatePicker.contextTypes = {
    antLocale: PropTypes.object
};