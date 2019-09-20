import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React from 'react';
import RCDatePicker from 'rmc-date-picker/es/DatePicker';
import { getComponentLocale } from '../_util/getLocale';

var DatePickerView = function (_React$Component) {
    _inherits(DatePickerView, _React$Component);

    function DatePickerView() {
        _classCallCheck(this, DatePickerView);

        return _possibleConstructorReturn(this, (DatePickerView.__proto__ || Object.getPrototypeOf(DatePickerView)).apply(this, arguments));
    }

    _createClass(DatePickerView, [{
        key: 'render',
        value: function render() {
            // tslint:disable-next-line:no-this-assignment
            var props = this.props,
                context = this.context;

            var locale = getComponentLocale(props, context, 'DatePickerView', function () {
                return require('./locale/zh_CN');
            });
            // DatePicker use `defaultDate`, maybe because there are PopupDatePicker inside? @yiminghe
            // Here Use `date` instead of `defaultDate`, make it controlled fully.
            return React.createElement(RCDatePicker, _extends({}, props, { locale: locale, date: props.value, onDateChange: props.onChange, onValueChange: props.onValueChange, onScrollChange: props.onScrollChange }));
        }
    }]);

    return DatePickerView;
}(React.Component);

export default DatePickerView;

DatePickerView.defaultProps = {
    mode: 'datetime',
    extra: '请选择',
    prefixCls: 'am-picker',
    pickerPrefixCls: 'am-picker-col',
    minuteStep: 1,
    use12Hours: false
};
DatePickerView.contextTypes = {
    antLocale: PropTypes.object
};