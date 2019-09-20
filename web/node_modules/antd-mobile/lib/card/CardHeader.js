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

var CardHeader = function (_React$Component) {
    (0, _inherits3['default'])(CardHeader, _React$Component);

    function CardHeader() {
        (0, _classCallCheck3['default'])(this, CardHeader);
        return (0, _possibleConstructorReturn3['default'])(this, (CardHeader.__proto__ || Object.getPrototypeOf(CardHeader)).apply(this, arguments));
    }

    (0, _createClass3['default'])(CardHeader, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                prefixCls = _a.prefixCls,
                className = _a.className,
                title = _a.title,
                thumb = _a.thumb,
                thumbStyle = _a.thumbStyle,
                extra = _a.extra,
                restProps = __rest(_a, ["prefixCls", "className", "title", "thumb", "thumbStyle", "extra"]);
            var wrapCls = (0, _classnames2['default'])(prefixCls + '-header', className);
            return _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({ className: wrapCls }, restProps),
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-header-content' },
                    typeof thumb === 'string' ?
                    // tslint:disable-next-line:jsx-no-multiline-js
                    _react2['default'].createElement('img', { style: thumbStyle, src: thumb }) : thumb,
                    title
                ),
                extra ?
                // tslint:disable-next-line:jsx-no-multiline-js
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-header-extra' },
                    extra
                ) : null
            );
        }
    }]);
    return CardHeader;
}(_react2['default'].Component);

exports['default'] = CardHeader;

CardHeader.defaultProps = {
    prefixCls: 'am-card',
    thumbStyle: {}
};
module.exports = exports['default'];