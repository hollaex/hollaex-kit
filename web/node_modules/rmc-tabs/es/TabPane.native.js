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
import { View } from 'react-native';
export var TabPane = function (_React$PureComponent) {
    _inherits(TabPane, _React$PureComponent);

    function TabPane() {
        _classCallCheck(this, TabPane);

        return _possibleConstructorReturn(this, (TabPane.__proto__ || Object.getPrototypeOf(TabPane)).apply(this, arguments));
    }

    _createClass(TabPane, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                active = _a.active,
                props = __rest(_a, ["active"]);
            return React.createElement(
                View,
                props,
                props.children
            );
        }
    }]);

    return TabPane;
}(React.PureComponent);