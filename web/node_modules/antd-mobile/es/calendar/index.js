import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React from 'react';
import { Calendar as RMCalendar } from 'rmc-calendar';
import { getComponentLocale } from '../_util/getLocale';
import Icon from '../icon';

var Calendar = function (_React$Component) {
    _inherits(Calendar, _React$Component);

    function Calendar() {
        _classCallCheck(this, Calendar);

        return _possibleConstructorReturn(this, (Calendar.__proto__ || Object.getPrototypeOf(Calendar)).apply(this, arguments));
    }

    _createClass(Calendar, [{
        key: 'render',
        value: function render() {
            // tslint:disable-next-line:no-this-assignment
            var props = this.props,
                context = this.context;

            var locale = getComponentLocale(props, context, 'Calendar', function () {
                return require('./locale/zh_CN');
            });
            var Header = RMCalendar.DefaultHeader;
            return React.createElement(RMCalendar, _extends({ locale: locale
                // tslint:disable-next-line:jsx-no-multiline-js
                , renderHeader: function renderHeader(headerProps) {
                    return React.createElement(Header, _extends({}, headerProps, { closeIcon: React.createElement(Icon, { type: 'cross' }) }));
                } }, props));
        }
    }]);

    return Calendar;
}(React.Component);

export default Calendar;

Calendar.defaultProps = {
    prefixCls: 'am-calendar',
    timePickerPrefixCls: 'am-picker',
    timePickerPickerPrefixCls: 'am-picker-col'
};
Calendar.contextTypes = {
    antLocale: PropTypes.object
};