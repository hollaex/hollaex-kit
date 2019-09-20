'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _rcCheckbox = require('rc-checkbox');

var _rcCheckbox2 = _interopRequireDefault(_rcCheckbox);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var Checkbox = function (_React$Component) {
    (0, _inherits3['default'])(Checkbox, _React$Component);

    function Checkbox() {
        (0, _classCallCheck3['default'])(this, Checkbox);
        return (0, _possibleConstructorReturn3['default'])(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Checkbox, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                className = _a.className,
                style = _a.style,
                restProps = __rest(_a, ["className", "style"]);var prefixCls = restProps.prefixCls,
                children = restProps.children;

            var wrapCls = (0, _classnames2['default'])(prefixCls + '-wrapper', className);
            // Todo: wait for https://github.com/developit/preact-compat/issues/422, then we can remove class below
            if ('class' in restProps) {
                /* tslint:disable:no-string-literal */
                delete restProps['class'];
            }
            var mark = _react2['default'].createElement(
                'label',
                { className: wrapCls, style: style },
                _react2['default'].createElement(_rcCheckbox2['default'], restProps),
                children
            );
            if (this.props.wrapLabel) {
                return mark;
            }
            return _react2['default'].createElement(_rcCheckbox2['default'], this.props);
        }
    }]);
    return Checkbox;
}(_react2['default'].Component);

exports['default'] = Checkbox;

Checkbox.defaultProps = {
    prefixCls: 'am-checkbox',
    wrapLabel: true
};
module.exports = exports['default'];