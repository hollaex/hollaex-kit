import _extends from 'babel-runtime/helpers/extends';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import React from 'react';
import Animate from 'rc-animate';
import TimePicker from './TimePicker';
import DatePicker from './DatePicker';
import ConfirmPanel from './calendar/ConfirmPanel';
import ShortcutPanel from './calendar/ShortcutPanel';
import AnimateWrapper from './calendar/AnimateWrapper';
import Header from './calendar/Header';
import { mergeDateTime } from './util';
import defaultLocale from './locale/zh_CN';
export var StateType = function StateType() {
    _classCallCheck(this, StateType);

    this.showTimePicker = false;
    this.startDate = undefined;
    this.endDate = undefined;
    this.disConfirmBtn = true;
    this.clientHight = 0;
};

var Calendar = function (_React$PureComponent) {
    _inherits(Calendar, _React$PureComponent);

    function Calendar(props) {
        _classCallCheck(this, Calendar);

        var _this = _possibleConstructorReturn(this, _React$PureComponent.call(this, props));

        _this.selectDate = function (date) {
            var useDateTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var oldState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _this.props;

            if (!date) return {};
            var newState = {};
            var type = props.type,
                pickTime = props.pickTime,
                defaultTimeValue = props.defaultTimeValue,
                _props$locale = props.locale,
                locale = _props$locale === undefined ? {} : _props$locale;

            var newDate = pickTime && !useDateTime ? mergeDateTime(date, defaultTimeValue) : date;
            var startDate = oldState.startDate,
                endDate = oldState.endDate;

            switch (type) {
                case 'one':
                    newState = _extends({}, newState, { startDate: newDate, disConfirmBtn: false });
                    if (pickTime) {
                        newState = _extends({}, newState, { timePickerTitle: locale.selectTime, showTimePicker: true });
                    }
                    break;
                case 'range':
                    if (!startDate || endDate) {
                        newState = _extends({}, newState, { startDate: newDate, endDate: undefined, disConfirmBtn: true });
                        if (pickTime) {
                            newState = _extends({}, newState, { timePickerTitle: locale.selectStartTime, showTimePicker: true });
                        }
                    } else {
                        newState = _extends({}, newState, { timePickerTitle: +newDate >= +startDate ? locale.selectEndTime : locale.selectStartTime, disConfirmBtn: false, endDate: pickTime && !useDateTime && +newDate >= +startDate ? new Date(+mergeDateTime(newDate, startDate) + 3600000) : newDate });
                    }
                    break;
            }
            return newState;
        };
        _this.onSelectedDate = function (date) {
            var _this$state = _this.state,
                startDate = _this$state.startDate,
                endDate = _this$state.endDate;
            var onSelect = _this.props.onSelect;

            if (onSelect) {
                var value = onSelect(date, [startDate, endDate]);
                if (value) {
                    _this.shortcutSelect(value[0], value[1]);
                    return;
                }
            }
            _this.setState(_this.selectDate(date, false, { startDate: startDate, endDate: endDate }));
        };
        _this.onSelectHasDisableDate = function (date) {
            _this.onClear();
            if (_this.props.onSelectHasDisableDate) {
                _this.props.onSelectHasDisableDate(date);
            }
        };
        _this.onClose = function () {
            _this.setState(new StateType());
        };
        _this.onCancel = function () {
            _this.props.onCancel && _this.props.onCancel();
            _this.onClose();
        };
        _this.onConfirm = function () {
            var onConfirm = _this.props.onConfirm;
            var _this$state2 = _this.state,
                startDate = _this$state2.startDate,
                endDate = _this$state2.endDate;

            if (startDate && endDate && +startDate > +endDate) {
                return onConfirm && onConfirm(endDate, startDate);
            }
            onConfirm && onConfirm(startDate, endDate);
            _this.onClose();
        };
        _this.onTimeChange = function (date) {
            var _this$state3 = _this.state,
                startDate = _this$state3.startDate,
                endDate = _this$state3.endDate;

            if (endDate) {
                _this.setState({
                    endDate: date
                });
            } else if (startDate) {
                _this.setState({
                    startDate: date
                });
            }
        };
        _this.onClear = function () {
            _this.setState({
                startDate: undefined,
                endDate: undefined,
                showTimePicker: false
            });
            _this.props.onClear && _this.props.onClear();
        };
        _this.shortcutSelect = function (startDate, endDate) {
            var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this.props;

            _this.setState(_extends({ startDate: startDate }, _this.selectDate(endDate, true, { startDate: startDate }, props), { showTimePicker: false }));
        };
        _this.setClientHeight = function (height) {
            _this.setState({
                clientHight: height
            });
        };
        _this.state = new StateType();
        if (props.defaultValue) {
            var defaultValue = props.defaultValue;
            _this.state = _extends({}, _this.state, _this.selectDate(defaultValue[1], true, { startDate: defaultValue[0] }, props));
        }
        return _this;
    }

    Calendar.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible && nextProps.defaultValue) {
            this.shortcutSelect(nextProps.defaultValue[0], nextProps.defaultValue[1], nextProps);
        }
    };

    Calendar.prototype.render = function render() {
        var _props = this.props,
            type = _props.type,
            _props$locale2 = _props.locale,
            locale = _props$locale2 === undefined ? {} : _props$locale2,
            prefixCls = _props.prefixCls,
            visible = _props.visible,
            pickTime = _props.pickTime,
            showShortcut = _props.showShortcut,
            renderHeader = _props.renderHeader,
            infiniteOpt = _props.infiniteOpt,
            initalMonths = _props.initalMonths,
            defaultDate = _props.defaultDate,
            minDate = _props.minDate,
            maxDate = _props.maxDate,
            getDateExtra = _props.getDateExtra,
            rowSize = _props.rowSize,
            defaultTimeValue = _props.defaultTimeValue,
            renderShortcut = _props.renderShortcut,
            enterDirection = _props.enterDirection,
            timePickerPrefixCls = _props.timePickerPrefixCls,
            timePickerPickerPrefixCls = _props.timePickerPickerPrefixCls,
            style = _props.style;
        var _state = this.state,
            showTimePicker = _state.showTimePicker,
            timePickerTitle = _state.timePickerTitle,
            startDate = _state.startDate,
            endDate = _state.endDate,
            disConfirmBtn = _state.disConfirmBtn,
            clientHight = _state.clientHight;

        var headerProps = {
            locale: locale,
            showClear: !!startDate,
            onCancel: this.onCancel,
            onClear: this.onClear
        };
        return React.createElement(
            'div',
            { className: '' + prefixCls, style: style },
            React.createElement(
                Animate,
                { showProp: 'visible', transitionName: 'fade' },
                React.createElement(AnimateWrapper, { className: 'mask', visible: !!visible })
            ),
            React.createElement(
                Animate,
                { showProp: 'visible', transitionName: enterDirection === 'horizontal' ? 'slideH' : 'slideV' },
                React.createElement(
                    AnimateWrapper,
                    { className: 'content', visible: !!visible },
                    renderHeader ? renderHeader(headerProps) : React.createElement(Header, headerProps),
                    React.createElement(DatePicker, { locale: locale, type: type, prefixCls: prefixCls, infiniteOpt: infiniteOpt, initalMonths: initalMonths, defaultDate: defaultDate, minDate: minDate, maxDate: maxDate, getDateExtra: getDateExtra, onCellClick: this.onSelectedDate, onSelectHasDisableDate: this.onSelectHasDisableDate, onLayout: this.setClientHeight, startDate: startDate, endDate: endDate, rowSize: rowSize }),
                    showTimePicker && React.createElement(TimePicker, { prefixCls: timePickerPrefixCls, pickerPrefixCls: timePickerPickerPrefixCls, locale: locale, title: timePickerTitle, defaultValue: defaultTimeValue, value: endDate ? endDate : startDate, onValueChange: this.onTimeChange, minDate: minDate, maxDate: maxDate, clientHeight: clientHight }),
                    showShortcut && !showTimePicker && (renderShortcut ? renderShortcut(this.shortcutSelect) : React.createElement(ShortcutPanel, { locale: locale, onSelect: this.shortcutSelect })),
                    startDate && React.createElement(ConfirmPanel, { type: type, locale: locale, startDateTime: startDate, endDateTime: endDate, onConfirm: this.onConfirm, disableBtn: disConfirmBtn, formatStr: pickTime ? locale.dateTimeFormat : locale.dateFormat })
                )
            )
        );
    };

    return Calendar;
}(React.PureComponent);

export default Calendar;

Calendar.DefaultHeader = Header;
Calendar.DefaultShortcut = ShortcutPanel;
Calendar.defaultProps = {
    visible: false,
    showHeader: true,
    locale: defaultLocale,
    pickTime: false,
    showShortcut: false,
    prefixCls: 'rmc-calendar',
    type: 'range',
    defaultTimeValue: new Date(2000, 0, 1, 8)
};