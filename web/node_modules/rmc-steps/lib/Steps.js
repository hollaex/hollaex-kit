'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
/* eslint react/no-did-mount-set-state: 0 */

var Steps = function (_Component) {
    (0, _inherits3['default'])(Steps, _Component);

    function Steps() {
        (0, _classCallCheck3['default'])(this, Steps);
        return (0, _possibleConstructorReturn3['default'])(this, (Steps.__proto__ || Object.getPrototypeOf(Steps)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Steps, [{
        key: 'render',
        value: function render() {
            var _classNames;

            var _a = this.props,
                prefixCls = _a.prefixCls,
                _a$style = _a.style,
                style = _a$style === undefined ? {} : _a$style,
                className = _a.className,
                children = _a.children,
                direction = _a.direction,
                labelPlacement = _a.labelPlacement,
                iconPrefix = _a.iconPrefix,
                status = _a.status,
                size = _a.size,
                current = _a.current,
                progressDot = _a.progressDot,
                restProps = __rest(_a, ["prefixCls", "style", "className", "children", "direction", "labelPlacement", "iconPrefix", "status", "size", "current", "progressDot"]);
            var filteredChildren = _react2['default'].Children.toArray(children).filter(function (c) {
                return !!c;
            });
            var adjustedlabelPlacement = !!progressDot ? 'vertical' : labelPlacement;
            var classString = (0, _classnames2['default'])(prefixCls, prefixCls + '-' + direction, className, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-' + size, size), (0, _defineProperty3['default'])(_classNames, prefixCls + '-label-' + adjustedlabelPlacement, direction === 'horizontal'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-dot', !!progressDot), _classNames));
            return _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({ className: classString, style: style }, restProps),
                _react.Children.map(filteredChildren, function (child, index) {
                    if (!child) {
                        return null;
                    }
                    var childProps = (0, _extends3['default'])({ stepNumber: '' + (index + 1), prefixCls: prefixCls,
                        iconPrefix: iconPrefix, wrapperStyle: style, progressDot: progressDot }, child.props);
                    // fix tail color
                    if (status === 'error' && index === current - 1) {
                        childProps.className = prefixCls + '-next-error';
                    }
                    if (!child.props.status) {
                        if (index === current) {
                            childProps.status = status;
                        } else if (index < current) {
                            childProps.status = 'finish';
                        } else {
                            childProps.status = 'wait';
                        }
                    }
                    return (0, _react.cloneElement)(child, childProps);
                })
            );
        }
    }]);
    return Steps;
}(_react.Component);

exports['default'] = Steps;

Steps.defaultProps = {
    prefixCls: 'rmc-steps',
    iconPrefix: 'rmc',
    direction: 'horizontal',
    labelPlacement: 'horizontal',
    current: 0,
    status: 'process',
    size: '',
    progressDot: false
};
module.exports = exports['default'];