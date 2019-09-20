import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
function noop() {}
function defaultParser(input) {
    return input.replace(/[^\w\.-]+/g, '');
}
/**
 * When click and hold on a button - the speed of auto changin the value.
 */
var SPEED = 200;
/**
 * When click and hold on a button - the delay before auto changin the value.
 */
var DELAY = 600;
/**
 * Max Safe Integer -- on IE this is not available, so manually set the number in that case.
 * The reason this is used, instead of Infinity is because numbers above the MSI are unstable
 */
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var BaseComponent = function (_React$Component) {
    _inherits(BaseComponent, _React$Component);

    function BaseComponent(props) {
        _classCallCheck(this, BaseComponent);

        var _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this, props));

        _this.onChange = function (e) {
            var _this$props = _this.props,
                parser = _this$props.parser,
                onChange = _this$props.onChange;

            var input = parser && parser(_this.getValueFromEvent(e).trim());
            _this.setState({ inputValue: input });
            onChange && onChange(_this.toNumberWhenUserInput(input)); // valid number or invalid string
        };
        _this.onFocus = function () {
            _this.setState({
                focused: true
            });
            var onFocus = _this.props.onFocus;

            onFocus && onFocus.apply(undefined, arguments);
        };
        _this.onBlur = function (e) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            _this.setState({
                focused: false
            });
            var value = _this.getCurrentValidValue(_this.state.inputValue);
            e.persist(); // fix https://github.com/react-component/input-number/issues/51
            _this.setValue(value, function () {
                var onBlur = _this.props.onBlur;

                onBlur && onBlur.apply(undefined, [e].concat(args));
            });
        };
        _this.getCurrentValidValue = function (value) {
            var val = value;
            if (val === '') {
                val = '';
            } else if (!_this.isNotCompleteNumber(val)) {
                val = _this.getValidValue(val);
            } else {
                val = _this.state.value;
            }
            return _this.toNumber(val);
        };
        _this.getValidValue = function (value) {
            var val = parseFloat(value);
            // https://github.com/ant-design/ant-design/issues/7358
            if (isNaN(val)) {
                return value;
            }
            if (val < _this.props.min) {
                val = _this.props.min;
            }
            if (val > _this.props.max) {
                val = _this.props.max;
            }
            return val;
        };
        _this.setValue = function (v, callback) {
            // trigger onChange
            var newValue = _this.isNotCompleteNumber(parseFloat(v)) ? undefined : parseFloat(v);
            var changed = newValue !== _this.state.value || '' + newValue !== '' + _this.state.inputValue; // https://github.com/ant-design/ant-design/issues/7363
            if (!('value' in _this.props)) {
                _this.setState({
                    value: newValue,
                    inputValue: _this.toPrecisionAsStep(v)
                }, callback);
            } else {
                // always set input value same as value
                _this.setState({
                    inputValue: _this.toPrecisionAsStep(_this.state.value)
                }, callback);
            }
            if (changed) {
                var onChange = _this.props.onChange;

                onChange && onChange(newValue);
            }
        };
        _this.getPrecision = function (value) {
            if ('precision' in _this.props) {
                return _this.props.precision;
            }
            var valueString = value.toString();
            if (valueString.indexOf('e-') >= 0) {
                return parseInt(valueString.slice(valueString.indexOf('e-') + 2), 10);
            }
            var precision = 0;
            if (valueString.indexOf('.') >= 0) {
                precision = valueString.length - valueString.indexOf('.') - 1;
            }
            return precision;
        };
        // step={1.0} value={1.51}
        // press +
        // then value should be 2.51, rather than 2.5
        // if this.props.precision is undefined
        // https://github.com/react-component/input-number/issues/39
        _this.getMaxPrecision = function (currentValue) {
            var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            if ('precision' in _this.props) {
                return _this.props.precision;
            }
            var step = _this.props.step;

            var ratioPrecision = _this.getPrecision(ratio);
            var stepPrecision = _this.getPrecision(step);
            var currentValuePrecision = _this.getPrecision(currentValue);
            if (!currentValue) {
                return ratioPrecision + stepPrecision;
            }
            return Math.max(currentValuePrecision, ratioPrecision + stepPrecision);
        };
        _this.getPrecisionFactor = function (currentValue) {
            var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            var precision = _this.getMaxPrecision(currentValue, ratio);
            return Math.pow(10, precision);
        };
        _this.toPrecisionAsStep = function (num) {
            if (_this.isNotCompleteNumber(num) || num === '') {
                return num;
            }
            var precision = Math.abs(_this.getMaxPrecision(num));
            if (!isNaN(precision)) {
                return Number(num).toFixed(precision);
            }
            return num.toString();
        };
        // '1.' '1x' 'xx' '' => are not complete numbers
        _this.isNotCompleteNumber = function (num) {
            return isNaN(num) || num === '' || num === null || num && num.toString().indexOf('.') === num.toString().length - 1;
        };
        _this.toNumber = function (num) {
            if (_this.isNotCompleteNumber(num)) {
                return num;
            }
            if ('precision' in _this.props) {
                return Number(Number(num).toFixed(_this.props.precision));
            }
            return Number(num);
        };
        // '1.0' '1.00'  => may be a inputing number
        _this.toNumberWhenUserInput = function (num) {
            // num.length > 16 => prevent input large number will became Infinity
            if ((/\.\d*0$/.test(num) || num.length > 16) && _this.state.focused) {
                return num;
            }
            return _this.toNumber(num);
        };
        _this.stepCompute = function (type, val, rat) {
            var _this$props2 = _this.props,
                step = _this$props2.step,
                min = _this$props2.min;

            var precisionFactor = _this.getPrecisionFactor(val, rat);
            var precision = Math.abs(_this.getMaxPrecision(val, rat));
            var result = void 0;
            var direct = type === 'up' ? 1 : -1;
            if (typeof val === 'number') {
                result = ((precisionFactor * val + direct * precisionFactor * +step * rat) / precisionFactor).toFixed(precision);
            } else {
                result = min === -Infinity ? direct * +step : min;
            }
            return _this.toNumber(result);
        };
        _this.step = function (type, e) {
            var ratio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            if (e) {
                e.preventDefault();
            }
            var props = _this.props;
            if (props.disabled) {
                return false;
            }
            var value = _this.getCurrentValidValue(_this.state.inputValue) || 0;
            if (_this.isNotCompleteNumber(value)) {
                return false;
            }
            var val = _this.stepCompute(type, value, ratio);
            var outOfRange = val > props.max || val < props.min;
            if (val > props.max) {
                val = props.max;
            } else if (val < props.min) {
                val = props.min;
            }
            _this.setValue(val);
            _this.setState({
                focused: true
            });
            return !outOfRange;
        };
        _this.stop = function () {
            if (_this.autoStepTimer) {
                clearTimeout(_this.autoStepTimer);
            }
        };
        _this.action = function (type, e, ratio, recursive) {
            if (e.persist) {
                e.persist();
            }
            _this.stop();
            if (_this.step(type, e, ratio)) {
                _this.autoStepTimer = setTimeout(function () {
                    _this.action(type, e, ratio, true);
                }, recursive ? SPEED : DELAY);
            }
        };
        _this.down = function (e, ratio, recursive) {
            _this.action('down', e, ratio, recursive);
        };
        _this.up = function (e, ratio, recursive) {
            _this.action('up', e, ratio, recursive);
        };
        var value = void 0;
        if ('value' in props) {
            value = props.value;
        } else {
            value = props.defaultValue;
        }
        value = _this.toNumber(value);
        _this.state = {
            inputValue: _this.toPrecisionAsStep(value),
            value: value,
            focused: props.autoFocus
        };
        return _this;
    }

    _createClass(BaseComponent, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if ('value' in nextProps) {
                var value = this.state.focused ? nextProps.value : this.getValidValue(nextProps.value);
                this.setState({
                    value: value,
                    inputValue: value
                });
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.stop();
        }
    }]);

    return BaseComponent;
}(React.Component);

export default BaseComponent;

BaseComponent.defaultProps = {
    max: MAX_SAFE_INTEGER,
    min: -MAX_SAFE_INTEGER,
    step: 1,
    style: {},
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    parser: defaultParser
};
;