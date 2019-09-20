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
import classnames from 'classnames';
import React from 'react';
import loadSprite from './loadSprite';

var Icon = function (_React$Component) {
    _inherits(Icon, _React$Component);

    function Icon() {
        _classCallCheck(this, Icon);

        return _possibleConstructorReturn(this, (Icon.__proto__ || Object.getPrototypeOf(Icon)).apply(this, arguments));
    }

    _createClass(Icon, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            loadSprite();
        }
    }, {
        key: 'render',
        value: function render() {
            var _a = this.props,
                type = _a.type,
                className = _a.className,
                size = _a.size,
                restProps = __rest(_a, ["type", "className", "size"]);
            var cls = classnames(className, 'am-icon', 'am-icon-' + type, 'am-icon-' + size);
            return React.createElement(
                'svg',
                _extends({ className: cls }, restProps),
                React.createElement('use', { xlinkHref: '#' + type })
            );
        }
    }]);

    return Icon;
}(React.Component);

export default Icon;

Icon.defaultProps = {
    size: 'md'
};