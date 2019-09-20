import _extends from "babel-runtime/helpers/extends";
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
import React from 'react';

var Input = function (_React$Component) {
    _inherits(Input, _React$Component);

    function Input() {
        _classCallCheck(this, Input);

        var _this = _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).apply(this, arguments));

        _this.onInputBlur = function (e) {
            var value = e.target.value;
            if (_this.props.onBlur) {
                _this.props.onBlur(value);
            }
        };
        _this.onInputFocus = function (e) {
            // here should have a value definition but none.
            var value = e.target.value;
            if (_this.props.onFocus) {
                _this.props.onFocus(value);
            }
        };
        _this.focus = function () {
            if (_this.inputRef) {
                _this.inputRef.focus();
            }
        };
        return _this;
    }

    _createClass(Input, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var _a = this.props,
                onBlur = _a.onBlur,
                onFocus = _a.onFocus,
                restProps = __rest(_a, ["onBlur", "onFocus"]);
            return React.createElement("input", _extends({ ref: function ref(el) {
                    return _this2.inputRef = el;
                }, onBlur: this.onInputBlur, onFocus: this.onInputFocus }, restProps));
        }
    }]);

    return Input;
}(React.Component);

export default Input;