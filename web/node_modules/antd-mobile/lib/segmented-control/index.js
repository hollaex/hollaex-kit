'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcFeedback = require('rmc-feedback');

var _rmcFeedback2 = _interopRequireDefault(_rmcFeedback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SegmentedControl = function (_React$Component) {
    (0, _inherits3['default'])(SegmentedControl, _React$Component);

    function SegmentedControl(props) {
        (0, _classCallCheck3['default'])(this, SegmentedControl);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (SegmentedControl.__proto__ || Object.getPrototypeOf(SegmentedControl)).call(this, props));

        _this.state = {
            selectedIndex: props.selectedIndex
        };
        return _this;
    }

    (0, _createClass3['default'])(SegmentedControl, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.selectedIndex !== this.state.selectedIndex) {
                this.setState({
                    selectedIndex: nextProps.selectedIndex
                });
            }
        }
    }, {
        key: 'onClick',
        value: function onClick(e, index, value) {
            var _props = this.props,
                disabled = _props.disabled,
                onChange = _props.onChange,
                onValueChange = _props.onValueChange;

            if (!disabled && this.state.selectedIndex !== index) {
                // just do a mock so that the api to be the same as react-native
                e.nativeEvent = e.nativeEvent ? e.nativeEvent : {};
                e.nativeEvent.selectedSegmentIndex = index;
                e.nativeEvent.value = value;
                if (onChange) {
                    onChange(e);
                }
                if (onValueChange) {
                    onValueChange(value);
                }
                this.setState({
                    selectedIndex: index
                });
            }
        }
    }, {
        key: 'renderSegmentItem',
        value: function renderSegmentItem(idx, value, selected) {
            var _this2 = this;

            var _props2 = this.props,
                prefixCls = _props2.prefixCls,
                disabled = _props2.disabled,
                tintColor = _props2.tintColor;

            var itemCls = (0, _classnames4['default'])(prefixCls + '-item', (0, _defineProperty3['default'])({}, prefixCls + '-item-selected', selected));
            var itemStyle = {
                color: selected ? '#fff' : tintColor,
                backgroundColor: selected ? tintColor : 'transparent',
                borderColor: tintColor
            };
            var activeInnerStyle = tintColor ? {
                backgroundColor: tintColor
            } : {};
            return _react2['default'].createElement(
                _rmcFeedback2['default'],
                { key: idx, disabled: disabled, activeClassName: prefixCls + '-item-active' },
                _react2['default'].createElement(
                    'div',
                    { className: itemCls, style: itemStyle, role: 'tab', 'aria-selected': selected && !disabled, 'aria-disabled': disabled, onClick: disabled ? undefined : function (e) {
                            return _this2.onClick(e, idx, value);
                        } },
                    _react2['default'].createElement('div', { className: prefixCls + '-item-inner', style: activeInnerStyle }),
                    value
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props3 = this.props,
                className = _props3.className,
                prefixCls = _props3.prefixCls,
                style = _props3.style,
                disabled = _props3.disabled,
                _props3$values = _props3.values,
                values = _props3$values === undefined ? [] : _props3$values;

            var wrapCls = (0, _classnames4['default'])(className, prefixCls, (0, _defineProperty3['default'])({}, prefixCls + '-disabled', disabled));
            return _react2['default'].createElement(
                'div',
                { className: wrapCls, style: style, role: 'tablist' },
                values.map(function (value, idx) {
                    return (
                        // tslint:disable-next-line:jsx-no-multiline-js
                        _this3.renderSegmentItem(idx, value, idx === _this3.state.selectedIndex)
                    );
                })
            );
        }
    }]);
    return SegmentedControl;
}(_react2['default'].Component);

exports['default'] = SegmentedControl;

SegmentedControl.defaultProps = {
    prefixCls: 'am-segment',
    selectedIndex: 0,
    disabled: false,
    values: [],
    onChange: function onChange() {},
    onValueChange: function onValueChange() {},

    style: {},
    tintColor: ''
};
module.exports = exports['default'];