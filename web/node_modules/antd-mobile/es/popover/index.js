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
import Tooltip from 'rmc-tooltip';
import Item from './Item';
function recursiveCloneChildren(children) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (ch, _) {
        return ch;
    };

    return React.Children.map(children, function (child, index) {
        var newChild = cb(child, index);
        if (typeof newChild !== 'string' && typeof newChild !== 'number' && newChild && newChild.props && newChild.props.children) {
            return React.cloneElement(newChild, {}, recursiveCloneChildren(newChild.props.children, cb));
        }
        return newChild;
    });
}

var Popover = function (_React$Component) {
    _inherits(Popover, _React$Component);

    function Popover() {
        _classCallCheck(this, Popover);

        return _possibleConstructorReturn(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).apply(this, arguments));
    }

    _createClass(Popover, [{
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
                    return React.cloneElement(child, extraProps);
                }
                return child;
            });
            var wrapperNode = React.createElement(
                'div',
                { className: this.props.prefixCls + '-inner-wrapper' },
                overlayNode
            );
            return React.createElement(Tooltip, _extends({}, restProps, { overlay: wrapperNode }));
        }
    }]);

    return Popover;
}(React.Component);

export default Popover;

Popover.defaultProps = {
    prefixCls: 'am-popover',
    placement: 'bottomRight',
    align: { overflow: { adjustY: 0, adjustX: 0 } },
    trigger: ['click']
};
Popover.Item = Item;