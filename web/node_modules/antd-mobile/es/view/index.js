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
import React from 'react';

var View = function (_React$Component) {
    _inherits(View, _React$Component);

    function View() {
        _classCallCheck(this, View);

        return _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).apply(this, arguments));
    }

    _createClass(View, [{
        key: 'render',
        value: function render() {
            var props = _extends({}, this.props);
            if (Array.isArray(props.style)) {
                var style = {};
                props.style.forEach(function (s) {
                    style = _extends({}, style, s);
                });
                props.style = style;
            }

            var _props$Component = props.Component,
                Component = _props$Component === undefined ? 'div' : _props$Component,
                restProps = __rest(props, ["Component"]);

            return React.createElement(Component, restProps);
        }
    }]);

    return View;
}(React.Component);

export default View;

View.defaultProps = {
    Component: 'div'
};