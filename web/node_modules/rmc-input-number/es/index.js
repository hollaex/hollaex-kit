import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import classNames from 'classnames';
import BaseComponent from './base';
import InputHandler from './InputHandler';
function noop() {}
function preventDefault(e) {
    e.preventDefault();
}

var InputNumber = function (_BaseComponent) {
    _inherits(InputNumber, _BaseComponent);

    function InputNumber() {
        _classCallCheck(this, InputNumber);

        var _this = _possibleConstructorReturn(this, (InputNumber.__proto__ || Object.getPrototypeOf(InputNumber)).apply(this, arguments));

        _this.setInput = function (input) {
            _this.input = input;
        };
        return _this;
    }

    _createClass(InputNumber, [{
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

            var props = _extends({}, this.props);
            var _props$prefixCls = props.prefixCls,
                prefixCls = _props$prefixCls === undefined ? '' : _props$prefixCls,
                disabled = props.disabled,
                readOnly = props.readOnly,
                max = props.max,
                min = props.min;

            var classes = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls, true), _defineProperty(_classNames, props.className, !!props.className), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _defineProperty(_classNames, prefixCls + '-focused', this.state.focused), _classNames));
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
            return React.createElement(
                'div',
                { className: classes, style: props.style },
                React.createElement(
                    'div',
                    { className: prefixCls + '-handler-wrap' },
                    React.createElement(
                        InputHandler,
                        _extends({ disabled: isUpDisabled, prefixCls: prefixCls, unselectable: 'unselectable' }, upEvents, { role: 'button', 'aria-label': 'Increase Value', 'aria-disabled': !!isUpDisabled, className: prefixCls + '-handler ' + prefixCls + '-handler-up ' + upDisabledClass }),
                        this.props.upHandler || React.createElement('span', { unselectable: 'unselectable', className: prefixCls + '-handler-up-inner', onClick: preventDefault })
                    ),
                    React.createElement(
                        InputHandler,
                        _extends({ disabled: isDownDisabled, prefixCls: prefixCls, unselectable: 'unselectable' }, downEvents, { role: 'button', 'aria-label': 'Decrease Value', 'aria-disabled': !!isDownDisabled, className: prefixCls + '-handler ' + prefixCls + '-handler-down ' + downDisabledClass }),
                        this.props.downHandler || React.createElement('span', { unselectable: 'unselectable', className: prefixCls + '-handler-down-inner', onClick: preventDefault })
                    )
                ),
                React.createElement(
                    'div',
                    { className: prefixCls + '-input-wrap', role: 'spinbutton', 'aria-valuemin': props.min, 'aria-valuemax': props.max, 'aria-valuenow': value },
                    React.createElement('input', { className: prefixCls + '-input', tabIndex: props.tabIndex, autoComplete: 'off', onFocus: this.onFocus, onBlur: this.onBlur, autoFocus: props.autoFocus, readOnly: props.readOnly, disabled: props.disabled, max: props.max, min: props.min, step: props.step, onChange: this.onChange, ref: this.setInput, value: inputDisplayValueFormat })
                )
            );
        }
    }]);

    return InputNumber;
}(BaseComponent);

export default InputNumber;

InputNumber.defaultProps = _extends({}, BaseComponent.defaultProps, { focusOnUpDown: false, useTouch: false, prefixCls: 'rmc-input-number' });