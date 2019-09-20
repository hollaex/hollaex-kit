'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Progress = function (_React$Component) {
    (0, _inherits3['default'])(Progress, _React$Component);

    function Progress() {
        (0, _classCallCheck3['default'])(this, Progress);
        return (0, _possibleConstructorReturn3['default'])(this, (Progress.__proto__ || Object.getPrototypeOf(Progress)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Progress, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps() {
            this.noAppearTransition = true;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            if (this.props.appearTransition) {
                setTimeout(function () {
                    if (_this2.barRef) {
                        _this2.barRef.style.width = _this2.props.percent + '%';
                    }
                }, 10);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _classnames,
                _this3 = this;

            var _props = this.props,
                className = _props.className,
                prefixCls = _props.prefixCls,
                position = _props.position,
                unfilled = _props.unfilled,
                _props$style = _props.style,
                style = _props$style === undefined ? {} : _props$style,
                _props$barStyle = _props.barStyle,
                barStyle = _props$barStyle === undefined ? {} : _props$barStyle;

            var percentStyle = {
                width: this.noAppearTransition || !this.props.appearTransition ? this.props.percent + '%' : 0,
                height: 0
            };
            var wrapCls = (0, _classnames3['default'])(prefixCls + '-outer', className, (_classnames = {}, (0, _defineProperty3['default'])(_classnames, prefixCls + '-fixed-outer', position === 'fixed'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-hide-outer', !unfilled), _classnames));
            return _react2['default'].createElement(
                'div',
                { style: style, className: wrapCls, role: 'progressbar', 'aria-valuenow': this.props.percent, 'aria-valuemin': 0, 'aria-valuemax': 100 },
                _react2['default'].createElement('div', { ref: function ref(el) {
                        return _this3.barRef = el;
                    }, className: prefixCls + '-bar', style: (0, _extends3['default'])({}, barStyle, percentStyle) })
            );
        }
    }]);
    return Progress;
}(_react2['default'].Component);

exports['default'] = Progress;

Progress.defaultProps = {
    prefixCls: 'am-progress',
    percent: 0,
    position: 'fixed',
    unfilled: true,
    appearTransition: false
};
module.exports = exports['default'];