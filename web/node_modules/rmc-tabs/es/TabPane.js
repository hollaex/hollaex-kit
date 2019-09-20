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
import { getPxStyle, getTransformPropValue } from './util';
export var TabPane = function (_React$PureComponent) {
    _inherits(TabPane, _React$PureComponent);

    function TabPane() {
        _classCallCheck(this, TabPane);

        var _this = _possibleConstructorReturn(this, (TabPane.__proto__ || Object.getPrototypeOf(TabPane)).apply(this, arguments));

        _this.offsetX = 0;
        _this.offsetY = 0;
        _this.setLayout = function (div) {
            _this.layout = div;
        };
        return _this;
    }

    _createClass(TabPane, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.active !== nextProps.active) {
                if (nextProps.active) {
                    this.offsetX = 0;
                    this.offsetY = 0;
                } else {
                    this.offsetX = this.layout.scrollLeft;
                    this.offsetY = this.layout.scrollTop;
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _a = this.props,
                active = _a.active,
                fixX = _a.fixX,
                fixY = _a.fixY,
                props = __rest(_a, ["active", "fixX", "fixY"]);
            var style = _extends({}, fixX && this.offsetX ? getTransformPropValue(getPxStyle(-this.offsetX, 'px', false)) : {}, fixY && this.offsetY ? getTransformPropValue(getPxStyle(-this.offsetY, 'px', true)) : {});
            return React.createElement(
                'div',
                _extends({}, props, { style: style, ref: this.setLayout }),
                props.children
            );
        }
    }]);

    return TabPane;
}(React.PureComponent);
TabPane.defaultProps = {
    fixX: true,
    fixY: true
};