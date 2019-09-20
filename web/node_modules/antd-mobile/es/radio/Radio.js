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
import RcCheckbox from 'rc-checkbox';
import React from 'react';

var Radio = function (_React$Component) {
    _inherits(Radio, _React$Component);

    function Radio() {
        _classCallCheck(this, Radio);

        return _possibleConstructorReturn(this, (Radio.__proto__ || Object.getPrototypeOf(Radio)).apply(this, arguments));
    }

    _createClass(Radio, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                className = _a.className,
                style = _a.style,
                restProps = __rest(_a, ["className", "style"]);var prefixCls = restProps.prefixCls,
                children = restProps.children;

            var wrapCls = classnames(prefixCls + '-wrapper', className);
            if ('class' in restProps) {
                // Todo https://github.com/developit/preact-compat/issues/422
                /* tslint:disable:no-string-literal */
                delete restProps['class'];
            }
            var mark = React.createElement(
                'label',
                { className: wrapCls, style: style },
                React.createElement(RcCheckbox, _extends({}, restProps, { type: 'radio' })),
                children
            );
            if (this.props.wrapLabel) {
                return mark;
            }
            return React.createElement(RcCheckbox, _extends({}, this.props, { type: 'radio' }));
        }
    }]);

    return Radio;
}(React.Component);

export default Radio;

Radio.defaultProps = {
    prefixCls: 'am-radio',
    wrapLabel: true
};