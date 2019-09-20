'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _InputHandler = require('./InputHandler');

var _InputHandler2 = _interopRequireDefault(_InputHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
function preventDefault(e) {
    e.preventDefault();
}

var InputNumber = function (_BaseComponent) {
    (0, _inherits3['default'])(InputNumber, _BaseComponent);

    function InputNumber() {
        (0, _classCallCheck3['default'])(this, InputNumber);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (InputNumber.__proto__ || Object.getPrototypeOf(InputNumber)).apply(this, arguments));

        _this.setInput = function (input) {
            _this.input = input;
        };
        return _this;
    }

    (0, _createClass3['default'])(InputNumber, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.componentDidUpdate();
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate() {
            try {
                this.start = this.input.selectionStart;
                this.end = this.input.selectionEnd;
            } catch (e) {
                // Fix error in Chrome:
                // Failed to read the 'selectionStart' property from 'HTMLInputElement'
                // http://stackoverflow.com/q/21177489/3040605
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.focusOnUpDown && this.state.focused) {
                var selectionRange = this.input.setSelectionRange;
                if (selectionRange && typeof selectionRange === 'function' && this.start !== undefined && this.end !== undefined && this.start !== this.end) {
                    this.input.setSelectionRange(this.start, this.end);
                } else {
                    this.focus();
                }
            }
        }
    }, {
        key: 'getRatio',
        value: function getRatio(e) {
            var ratio = 1;
            if (e.metaKey || e.ctrlKey) {
                ratio = 0.1;
            } else if (e.shiftKey) {
                ratio = 10;
            }
            return ratio;
        }
    }, {
        key: 'getValueFromEvent',
        value: function getValueFromEvent(e) {
            return e.target.value;
        }
    }, {
        key: 'focus',
        value: function focus() {
            this.input.focus();
        }
    }, {
        key: 'formatWrapper',
        value: function formatWrapper(num) {
            if (this.props.formatter) {
                return this.props.formatter(num);
            }
            return num;
        }
    }, {
        key: 'render',
        value: function render() {
            var _classNames;

            var props = (0, _extends3['default'])({}, this.props);
            var _props$prefixCls = props.prefixCls,
                prefixCls = _props$prefixCls === undefined ? '' : _props$prefixCls,
                disabled = props.disabled,
                readOnly = props.readOnly,
                max = props.max,
                min = props.min;

            var classes = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls, true), (0, _defineProperty3['default'])(_classNames, props.className, !!props.className), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_classNames, prefixCls + '-focused', this.state.focused), _classNames));
            var upDisabledClass = '';
            var downDisabledClass = '';
            var value = this.state.value;

            if (value || value === 0) {
                if (!isNaN(value)) {
                    var val = Number(value);
                    if (val >= max) {
                        upDisabledClass = prefixCls + '-handler-up-disabled';
                    }
                    if (val <= min) {
                        downDisabledClass = prefixCls + '-handler-down-disabled';
                    }
                } else {
                    upDisabledClass = prefixCls + '-handler-up-disabled';
                    downDisabledClass = prefixCls + '-handler-down-disabled';
                }
            }
            var editable = !props.readOnly && !props.disabled;
            // focus state, show input value
            // unfocus state, show valid value
            var inputDisplayValue = void 0;
            if (this.state.focused) {
                inputDisplayValue = this.state.inputValue;
            } else {
                inputDisplayValue = this.toPrecisionAsStep(this.state.value);
            }
            if (inputDisplayValue === undefined || inputDisplayValue === null) {
                inputDisplayValue = '';
            }
            var upEvents = void 0;
            var downEvents = void 0;
            upEvents = {
                onTouchStart: editable && !upDisabledClass ? this.up : noop,
                onTouchEnd: this.stop
            };
            downEvents = {
                onTouchStart: editable && !downDisabledClass ? this.down : noop,
                onTouchEnd: this.stop
            };
            var inputDisplayValueFormat = this.formatWrapper(inputDisplayValue);
            var isUpDisabled = !!upDisabledClass || disabled || readOnly;
            var isDownDisabled = !!downDisabledClass || disabled || readOnly;
            return _react2['default'].createElement(
                'div',
                { className: classes, style: props.style },
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-handler-wrap' },
                    _react2['default'].createElement(
                        _InputHandler2['default'],
                        (0, _extends3['default'])({ disabled: isUpDisabled, prefixCls: prefixCls, unselectable: 'unselectable' }, upEvents, { role: 'button', 'aria-label': 'Increase Value', 'aria-disabled': !!isUpDisabled, className: prefixCls + '-handler ' + prefixCls + '-handler-up ' + upDisabledClass }),
                        this.props.upHandler || _react2['default'].createElement('span', { unselectable: 'unselectable', className: prefixCls + '-handler-up-inner', onClick: preventDefault })
                    ),
                    _react2['default'].createElement(
                        _InputHandler2['default'],
                        (0, _extends3['default'])({ disabled: isDownDisabled, prefixCls: prefixCls, unselectable: 'unselectable' }, downEvents, { role: 'button', 'aria-label': 'Decrease Value', 'aria-disabled': !!isDownDisabled, className: prefixCls + '-handler ' + prefixCls + '-handler-down ' + downDisabledClass }),
                        this.props.downHandler || _react2['default'].createElement('span', { unselectable: 'unselectable', className: prefixCls + '-handler-down-inner', onClick: preventDefault })
                    )
                ),
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-input-wrap', role: 'spinbutton', 'aria-valuemin': props.min, 'aria-valuemax': props.max, 'aria-valuenow': value },
                    _react2['default'].createElement('input', { className: prefixCls + '-input', tabIndex: props.tabIndex, autoComplete: 'off', onFocus: this.onFocus, onBlur: this.onBlur, autoFocus: props.autoFocus, readOnly: props.readOnly, disabled: props.disabled, max: props.max, min: props.min, step: props.step, onChange: this.onChange, ref: this.setInput, value: inputDisplayValueFormat })
                )
            );
        }
    }]);
    return InputNumber;
}(_base2['default']);

exports['default'] = InputNumber;

InputNumber.defaultProps = (0, _extends3['default'])({}, _base2['default'].defaultProps, { focusOnUpDown: false, useTouch: false, prefixCls: 'rmc-input-number' });
module.exports = exports['default'];