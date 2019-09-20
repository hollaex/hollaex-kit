import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";
import _possibleConstructorReturn from "babel-runtime/helpers/possibleConstructorReturn";
import _inherits from "babel-runtime/helpers/inherits";
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
import React, { Component } from 'react';

var LazyRenderBox = function (_Component) {
    _inherits(LazyRenderBox, _Component);

    function LazyRenderBox() {
        _classCallCheck(this, LazyRenderBox);

        return _possibleConstructorReturn(this, (LazyRenderBox.__proto__ || Object.getPrototypeOf(LazyRenderBox)).apply(this, arguments));
    }

    _createClass(LazyRenderBox, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps) {
            return nextProps.hiddenClassName || nextProps.visible;
        }
    }, {
        key: "render",
        value: function render() {
            var _a = this.props,
                hiddenClassName = _a.hiddenClassName,
                visible = _a.visible,
                props = __rest(_a, ["hiddenClassName", "visible"]);
            if (hiddenClassName || React.Children.count(props.children) > 1) {
                if (!visible && hiddenClassName) {
                    props.className += " " + hiddenClassName;
                }
                return React.createElement("div", props);
            }
            return React.Children.only(props.children);
        }
    }]);

    return LazyRenderBox;
}(Component);

export default LazyRenderBox;