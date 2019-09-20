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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var InputNumber = function (_BaseComponent) {
    (0, _inherits3['default'])(InputNumber, _BaseComponent);

    function InputNumber() {
        (0, _classCallCheck3['default'])(this, InputNumber);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (InputNumber.__proto__ || Object.getPrototypeOf(InputNumber)).apply(this, arguments));

        _this.onPressInDown = function (e) {
            _this.onPressIn('_stepDown');
            _this.down(e, true);
        };
        _this.onPressOutDown = function () {
            _this.onPressOut('_stepDown');
            _this.stop();
        };
        _this.onPressInUp = function (e) {
            _this.onPressIn('_stepUp');
            _this.up(e, true);
        };
        _this.onPressOutUp = function () {
            _this.onPressOut('_stepUp');
            _this.stop();
        };
        return _this;
    }

    (0, _createClass3['default'])(InputNumber, [{
        key: 'onPressIn',
        value: function onPressIn(type) {
            if (this.props.disabled) {
                return;
            }
            var styles = this.props.styles;

            this[type].setNativeProps({
                style: [styles.stepWrap, styles.highlightStepBorderColor]
            });
            this[type + 'Text'].setNativeProps({
                style: [styles.stepText, styles.highlightStepTextColor]
            });
        }
    }, {
        key: 'onPressOut',
        value: function onPressOut(type) {
            if (this.props.disabled) {
                return;
            }
            var styles = this.props.styles;

            this[type].setNativeProps({
                style: [styles.stepWrap]
            });
            this[type + 'Text'].setNativeProps({
                style: [styles.stepText]
            });
        }
    }, {
        key: 'getValueFromEvent',
        value: function getValueFromEvent(e) {
            return e.nativeEvent.text;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var props = this.props,
                state = this.state;
            var _props = this.props,
                style = _props.style,
                upStyle = _props.upStyle,
                downStyle = _props.downStyle,
                inputStyle = _props.inputStyle,
                styles = _props.styles;

            var editable = !this.props.readOnly && !this.props.disabled;
            var upDisabledStyle = null;
            var downDisabledStyle = null;
            var upDisabledTextStyle = null;
            var downDisabledTextStyle = null;
            var value = +state.value;
            if (!isNaN(value)) {
                var val = Number(value);
                if (val >= props.max) {
                    upDisabledStyle = styles.stepDisabled;
                    upDisabledTextStyle = styles.disabledStepTextColor;
                }
                if (val <= props.min) {
                    downDisabledStyle = styles.stepDisabled;
                    downDisabledTextStyle = styles.disabledStepTextColor;
                }
            } else {
                upDisabledStyle = styles.stepDisabled;
                downDisabledStyle = styles.stepDisabled;
                upDisabledTextStyle = styles.disabledStepTextColor;
                downDisabledTextStyle = styles.disabledStepTextColor;
            }
            var inputDisabledStyle = null;
            if (props.disabled) {
                upDisabledStyle = styles.stepDisabled;
                downDisabledStyle = styles.stepDisabled;
                upDisabledTextStyle = styles.disabledStepTextColor;
                downDisabledTextStyle = styles.disabledStepTextColor;
                inputDisabledStyle = styles.disabledStepTextColor;
            }
            var inputDisplayValue = void 0;
            if (state.focused) {
                inputDisplayValue = '' + state.inputValue;
            } else {
                inputDisplayValue = '' + state.value;
            }
            if (inputDisplayValue === undefined) {
                inputDisplayValue = '';
            }
            return _react2['default'].createElement(
                _reactNative.View,
                { style: [styles.container, style] },
                _react2['default'].createElement(
                    _reactNative.TouchableWithoutFeedback,
                    { onPressIn: editable && !downDisabledStyle ? this.onPressInDown : undefined, onPressOut: editable && !downDisabledStyle ? this.onPressOutDown : undefined, accessible: true, accessibilityLabel: 'Decrease Value', accessibilityComponentType: 'button', accessibilityTraits: editable && !downDisabledStyle ? 'button' : 'disabled' },
                    _react2['default'].createElement(
                        _reactNative.View,
                        { ref: function ref(component) {
                                return _this2._stepDown = component;
                            }, style: [styles.stepWrap, downDisabledStyle, downStyle] },
                        _react2['default'].createElement(
                            _reactNative.Text,
                            { ref: function ref(component) {
                                    return _this2._stepDownText = component;
                                }, style: [styles.stepText, downDisabledTextStyle] },
                            '-'
                        )
                    )
                ),
                _react2['default'].createElement(_reactNative.TextInput, { style: [styles.input, inputDisabledStyle, inputStyle], value: inputDisplayValue, autoFocus: props.autoFocus, editable: editable, onFocus: this.onFocus, onEndEditing: this.onBlur, onChange: this.onChange, underlineColorAndroid: 'transparent', keyboardType: props.keyboardType }),
                _react2['default'].createElement(
                    _reactNative.TouchableWithoutFeedback,
                    { onPressIn: editable && !upDisabledStyle ? this.onPressInUp : undefined, onPressOut: editable && !upDisabledStyle ? this.onPressOutUp : undefined, accessible: true, accessibilityLabel: 'Increase Value', accessibilityComponentType: 'button', accessibilityTraits: editable && !upDisabledStyle ? 'button' : 'disabled' },
                    _react2['default'].createElement(
                        _reactNative.View,
                        { ref: function ref(component) {
                                return _this2._stepUp = component;
                            }, style: [styles.stepWrap, upDisabledStyle, upStyle] },
                        _react2['default'].createElement(
                            _reactNative.Text,
                            { ref: function ref(component) {
                                    return _this2._stepUpText = component;
                                }, style: [styles.stepText, upDisabledTextStyle] },
                            '+'
                        )
                    )
                )
            );
        }
    }]);
    return InputNumber;
}(_base2['default']);

exports['default'] = InputNumber;
module.exports = exports['default'];