'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TabPane = undefined;

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var TabPane = exports.TabPane = function (_React$PureComponent) {
    (0, _inherits3['default'])(TabPane, _React$PureComponent);

    function TabPane() {
        (0, _classCallCheck3['default'])(this, TabPane);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (TabPane.__proto__ || Object.getPrototypeOf(TabPane)).apply(this, arguments));

        _this.offsetX = 0;
        _this.offsetY = 0;
        _this.setLayout = function (div) {
            _this.layout = div;
        };
        return _this;
    }

    (0, _createClass3['default'])(TabPane, [{
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
            var style = (0, _extends3['default'])({}, fixX && this.offsetX ? (0, _util.getTransformPropValue)((0, _util.getPxStyle)(-this.offsetX, 'px', false)) : {}, fixY && this.offsetY ? (0, _util.getTransformPropValue)((0, _util.getPxStyle)(-this.offsetY, 'px', true)) : {});
            return _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({}, props, { style: style, ref: this.setLayout }),
                props.children
            );
        }
    }]);
    return TabPane;
}(_react2['default'].PureComponent);

TabPane.defaultProps = {
    fixX: true,
    fixY: true
};