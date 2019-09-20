'use strict';

exports.__esModule = true;
exports.StateType = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _TimePicker = require('./TimePicker');

var _TimePicker2 = _interopRequireDefault(_TimePicker);

var _DatePicker = require('./DatePicker');

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _ConfirmPanel = require('./calendar/ConfirmPanel');

var _ConfirmPanel2 = _interopRequireDefault(_ConfirmPanel);

var _ShortcutPanel = require('./calendar/ShortcutPanel');

var _ShortcutPanel2 = _interopRequireDefault(_ShortcutPanel);

var _AnimateWrapper = require('./calendar/AnimateWrapper');

var _AnimateWrapper2 = _interopRequireDefault(_AnimateWrapper);

var _Header = require('./calendar/Header');

var _Header2 = _interopRequireDefault(_Header);

var _util = require('./util');

var _zh_CN = require('./locale/zh_CN');

var _zh_CN2 = _interopRequireDefault(_zh_CN);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var StateType = exports.StateType = function StateType() {
    (0, _classCallCheck3['default'])(this, StateType);

    this.showTimePicker = false;
    this.startDate = undefined;
    this.endDate = undefined;
    this.disConfirmBtn = true;
    this.clientHight = 0;
};

var Calendar = function (_React$PureComponent) {
    (0, _inherits3['default'])(Calendar, _React$PureComponent);

    function Calendar(props) {
        (0, _classCallCheck3['default'])(this, Calendar);

        var _this = (0, _possibleConstructorReturn3['default'])(this, _React$PureComponent.call(this, props));

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

            var newDate = pickTime && !useDateTime ? (0, _util.mergeDateTime)(date, defaultTimeValue) : date;
            var startDate = oldState.startDate,
                endDate = oldState.endDate;

            switch (type) {
                case 'one':
                    newState = (0, _extends3['default'])({}, newState, { startDate: newDate, disConfirmBtn: false });
                    if (pickTime) {
                        newState = (0, _extends3['default'])({}, newState, { timePickerTitle: locale.selectTime, showTimePicker: true });
                    }
                    break;
                case 'range':
                    if (!startDate || endDate) {
                        newState = (0, _extends3['default'])({}, newState, { startDate: newDate, endDate: undefined, disConfirmBtn: true });
                        if (pickTime) {
                            newState = (0, _extends3['default'])({}, newState, { timePickerTitle: locale.selectStartTime, showTimePicker: true });
                        }
                    } else {
                        newState = (0, _extends3['default'])({}, newState, { timePickerTitle: +newDate >= +startDate ? locale.selectEndTime : locale.selectStartTime, disConfirmBtn: false, endDate: pickTime && !useDateTime && +newDate >= +startDate ? new Date(+(0, _util.mergeDateTime)(newDate, startDate) + 3600000) : newDate });
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

            _this.setState((0, _extends3['default'])({ startDate: startDate }, _this.selectDate(endDate, true, { startDate: startDate }, props), { showTimePicker: false }));
        };
        _this.setClientHeight = function (height) {
            _this.setState({
                clientHight: height
            });
        };
        _this.state = new StateType();
        if (props.defaultValue) {
            var defaultValue = props.defaultValue;
            _this.state = (0, _extends3['default'])({}, _this.state, _this.selectDate(defaultValue[1], true, { startDate: defaultValue[0] }, props));
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
        return _react2['default'].createElement(
            'div',
            { className: '' + prefixCls, style: style },
            _react2['default'].createElement(
                _rcAnimate2['default'],
                { showProp: 'visible', transitionName: 'fade' },
                _react2['default'].createElement(_AnimateWrapper2['default'], { className: 'mask', visible: !!visible })
            ),
            _react2['default'].createElement(
                _rcAnimate2['default'],
                { showProp: 'visible', transitionName: enterDirection === 'horizontal' ? 'slideH' : 'slideV' },
                _react2['default'].createElement(
                    _AnimateWrapper2['default'],
                    { className: 'content', visible: !!visible },
                    renderHeader ? renderHeader(headerProps) : _react2['default'].createElement(_Header2['default'], headerProps),
                    _react2['default'].createElement(_DatePicker2['default'], { locale: locale, type: type, prefixCls: prefixCls, infiniteOpt: infiniteOpt, initalMonths: initalMonths, defaultDate: defaultDate, minDate: minDate, maxDate: maxDate, getDateExtra: getDateExtra, onCellClick: this.onSelectedDate, onSelectHasDisableDate: this.onSelectHasDisableDate, onLayout: this.setClientHeight, startDate: startDate, endDate: endDate, rowSize: rowSize }),
                    showTimePicker && _react2['default'].createElement(_TimePicker2['default'], { prefixCls: timePickerPrefixCls, pickerPrefixCls: timePickerPickerPrefixCls, locale: locale, title: timePickerTitle, defaultValue: defaultTimeValue, value: endDate ? endDate : startDate, onValueChange: this.onTimeChange, minDate: minDate, maxDate: maxDate, clientHeight: clientHight }),
                    showShortcut && !showTimePicker && (renderShortcut ? renderShortcut(this.shortcutSelect) : _react2['default'].createElement(_ShortcutPanel2['default'], { locale: locale, onSelect: this.shortcutSelect })),
                    startDate && _react2['default'].createElement(_ConfirmPanel2['default'], { type: type, locale: locale, startDateTime: startDate, endDateTime: endDate, onConfirm: this.onConfirm, disableBtn: disConfirmBtn, formatStr: pickTime ? locale.dateTimeFormat : locale.dateFormat })
                )
            )
        );
    };

    return Calendar;
}(_react2['default'].PureComponent);

exports['default'] = Calendar;

Calendar.DefaultHeader = _Header2['default'];
Calendar.DefaultShortcut = _ShortcutPanel2['default'];
Calendar.defaultProps = {
    visible: false,
    showHeader: true,
    locale: _zh_CN2['default'],
    pickTime: false,
    showShortcut: false,
    prefixCls: 'rmc-calendar',
    type: 'range',
    defaultTimeValue: new Date(2000, 0, 1, 8)
};