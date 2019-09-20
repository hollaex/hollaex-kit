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

var _Slider = require('rc-slider/lib/Slider');

var _Slider2 = _interopRequireDefault(_Slider);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Slider = function (_React$Component) {
    (0, _inherits3['default'])(Slider, _React$Component);

    function Slider() {
        (0, _classCallCheck3['default'])(this, Slider);
        return (0, _possibleConstructorReturn3['default'])(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Slider, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { className: this.props.prefixCls + '-wrapper' },
                _react2['default'].createElement(_Slider2['default'], this.props)
            );
        }
    }]);
    return Slider;
}(_react2['default'].Component);

exports['default'] = Slider;

Slider.defaultProps = {
    prefixCls: 'am-slider'
};
module.exports = exports['default'];