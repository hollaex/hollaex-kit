'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _getDataAttr = require('../_util/getDataAttr');

var _getDataAttr2 = _interopRequireDefault(_getDataAttr);

var _Checkbox = require('./Checkbox');

var _Checkbox2 = _interopRequireDefault(_Checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var AgreeItem = function (_React$Component) {
    (0, _inherits3['default'])(AgreeItem, _React$Component);

    function AgreeItem() {
        (0, _classCallCheck3['default'])(this, AgreeItem);
        return (0, _possibleConstructorReturn3['default'])(this, (AgreeItem.__proto__ || Object.getPrototypeOf(AgreeItem)).apply(this, arguments));
    }

    (0, _createClass3['default'])(AgreeItem, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                style = _a.style,
                restProps = __rest(_a, ["style"]);var prefixCls = restProps.prefixCls,
                className = restProps.className;

            var wrapCls = (0, _classnames2['default'])(prefixCls + '-agree', className);
            return _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({}, (0, _getDataAttr2['default'])(restProps), { className: wrapCls, style: style }),
                _react2['default'].createElement(_Checkbox2['default'], (0, _extends3['default'])({}, restProps, { className: prefixCls + '-agree-label' }))
            );
        }
    }]);
    return AgreeItem;
}(_react2['default'].Component);

exports['default'] = AgreeItem;

AgreeItem.defaultProps = {
    prefixCls: 'am-checkbox'
};
module.exports = exports['default'];