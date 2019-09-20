"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var LazyRenderBox = function (_Component) {
    (0, _inherits3["default"])(LazyRenderBox, _Component);

    function LazyRenderBox() {
        (0, _classCallCheck3["default"])(this, LazyRenderBox);
        return (0, _possibleConstructorReturn3["default"])(this, (LazyRenderBox.__proto__ || Object.getPrototypeOf(LazyRenderBox)).apply(this, arguments));
    }

    (0, _createClass3["default"])(LazyRenderBox, [{
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
            if (hiddenClassName || _react2["default"].Children.count(props.children) > 1) {
                if (!visible && hiddenClassName) {
                    props.className += " " + hiddenClassName;
                }
                return _react2["default"].createElement("div", props);
            }
            return _react2["default"].Children.only(props.children);
        }
    }]);
    return LazyRenderBox;
}(_react.Component);

exports["default"] = LazyRenderBox;
module.exports = exports['default'];