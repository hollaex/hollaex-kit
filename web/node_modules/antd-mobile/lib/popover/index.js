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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcTooltip = require('rmc-tooltip');

var _rmcTooltip2 = _interopRequireDefault(_rmcTooltip);

var _Item = require('./Item');

var _Item2 = _interopRequireDefault(_Item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

function recursiveCloneChildren(children) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (ch, _) {
        return ch;
    };

    return _react2['default'].Children.map(children, function (child, index) {
        var newChild = cb(child, index);
        if (typeof newChild !== 'string' && typeof newChild !== 'number' && newChild && newChild.props && newChild.props.children) {
            return _react2['default'].cloneElement(newChild, {}, recursiveCloneChildren(newChild.props.children, cb));
        }
        return newChild;
    });
}

var Popover = function (_React$Component) {
    (0, _inherits3['default'])(Popover, _React$Component);

    function Popover() {
        (0, _classCallCheck3['default'])(this, Popover);
        return (0, _possibleConstructorReturn3['default'])(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Popover, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                overlay = _a.overlay,
                _a$onSelect = _a.onSelect,
                onSelect = _a$onSelect === undefined ? function () {} : _a$onSelect,
                restProps = __rest(_a, ["overlay", "onSelect"]);
            var overlayNode = recursiveCloneChildren(overlay, function (child, index) {
                var extraProps = { firstItem: false };
                if (child && typeof child !== 'string' && typeof child !== 'number' && child.type &&
                // Fixme: not sure where the `myName` came from.
                child.type.myName === 'PopoverItem' && !child.props.disabled) {
                    extraProps.onClick = function () {
                        return onSelect(child, index);
                    };
                    extraProps.firstItem = index === 0;
                    return _react2['default'].cloneElement(child, extraProps);
                }
                return child;
            });
            var wrapperNode = _react2['default'].createElement(
                'div',
                { className: this.props.prefixCls + '-inner-wrapper' },
                overlayNode
            );
            return _react2['default'].createElement(_rmcTooltip2['default'], (0, _extends3['default'])({}, restProps, { overlay: wrapperNode }));
        }
    }]);
    return Popover;
}(_react2['default'].Component);

exports['default'] = Popover;

Popover.defaultProps = {
    prefixCls: 'am-popover',
    placement: 'bottomRight',
    align: { overflow: { adjustY: 0, adjustX: 0 } },
    trigger: ['click']
};
Popover.Item = _Item2['default'];
module.exports = exports['default'];