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

var _Range = require('rc-slider/lib/Range');

var _Range2 = _interopRequireDefault(_Range);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Range = function (_React$Component) {
    (0, _inherits3['default'])(Range, _React$Component);

    function Range() {
        (0, _classCallCheck3['default'])(this, Range);
        return (0, _possibleConstructorReturn3['default'])(this, (Range.__proto__ || Object.getPrototypeOf(Range)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Range, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { className: this.props.prefixCls + '-wrapper' },
                _react2['default'].createElement(_Range2['default'], this.props)
            );
        }
    }]);
    return Range;
}(_react2['default'].Component);

exports['default'] = Range;

Range.defaultProps = {
    prefixCls: 'am-slider'
};
module.exports = exports['default'];