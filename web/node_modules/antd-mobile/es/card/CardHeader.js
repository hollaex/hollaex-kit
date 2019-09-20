import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
import classnames from 'classnames';
import React from 'react';

var CardHeader = function (_React$Component) {
    _inherits(CardHeader, _React$Component);

    function CardHeader() {
        _classCallCheck(this, CardHeader);

        return _possibleConstructorReturn(this, (CardHeader.__proto__ || Object.getPrototypeOf(CardHeader)).apply(this, arguments));
    }

    _createClass(CardHeader, [{
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
            var wrapCls = classnames(prefixCls + '-header', className);
            return React.createElement(
                'div',
                _extends({ className: wrapCls }, restProps),
                React.createElement(
                    'div',
                    { className: prefixCls + '-header-content' },
                    typeof thumb === 'string' ?
                    // tslint:disable-next-line:jsx-no-multiline-js
                    React.createElement('img', { style: thumbStyle, src: thumb }) : thumb,
                    title
                ),
                extra ?
                // tslint:disable-next-line:jsx-no-multiline-js
                React.createElement(
                    'div',
                    { className: prefixCls + '-header-extra' },
                    extra
                ) : null
            );
        }
    }]);

    return CardHeader;
}(React.Component);

export default CardHeader;

CardHeader.defaultProps = {
    prefixCls: 'am-card',
    thumbStyle: {}
};