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

var Checkbox = function (_React$Component) {
    _inherits(Checkbox, _React$Component);

    function Checkbox() {
        _classCallCheck(this, Checkbox);

        return _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
    }

    _createClass(Checkbox, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                className = _a.className,
                style = _a.style,
                restProps = __rest(_a, ["className", "style"]);var prefixCls = restProps.prefixCls,
                children = restProps.children;

            var wrapCls = classnames(prefixCls + '-wrapper', className);
            // Todo: wait for https://github.com/developit/preact-compat/issues/422, then we can remove class below
            if ('class' in restProps) {
                /* tslint:disable:no-string-literal */
                delete restProps['class'];
            }
            var mark = React.createElement(
                'label',
                { className: wrapCls, style: style },
                React.createElement(RcCheckbox, restProps),
                children
            );
            if (this.props.wrapLabel) {
                return mark;
            }
            return React.createElement(RcCheckbox, this.props);
        }
    }]);

    return Checkbox;
}(React.Component);

export default Checkbox;

Checkbox.defaultProps = {
    prefixCls: 'am-checkbox',
    wrapLabel: true
};