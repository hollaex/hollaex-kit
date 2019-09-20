'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var CardFooter = function (_React$Component) {
    (0, _inherits3['default'])(CardFooter, _React$Component);

    function CardFooter() {
        (0, _classCallCheck3['default'])(this, CardFooter);
        return (0, _possibleConstructorReturn3['default'])(this, (CardFooter.__proto__ || Object.getPrototypeOf(CardFooter)).apply(this, arguments));
    }

    (0, _createClass3['default'])(CardFooter, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                prefixCls = _a.prefixCls,
                content = _a.content,
                className = _a.className,
                extra = _a.extra,
                restProps = __rest(_a, ["prefixCls", "content", "className", "extra"]);
            var wrapCls = (0, _classnames2['default'])(prefixCls + '-footer', className);
            return _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({ className: wrapCls }, restProps),
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-footer-content' },
                    content
                ),
                extra && _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-footer-extra' },
                    extra
                )
            );
        }
    }]);
    return CardFooter;
}(_react2['default'].Component);

exports['default'] = CardFooter;

CardFooter.defaultProps = {
    prefixCls: 'am-card'
};
module.exports = exports['default'];