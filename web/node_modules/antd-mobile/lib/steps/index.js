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

var _rmcSteps = require('rmc-steps');

var _rmcSteps2 = _interopRequireDefault(_rmcSteps);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Steps = function (_React$Component) {
    (0, _inherits3['default'])(Steps, _React$Component);

    function Steps() {
        (0, _classCallCheck3['default'])(this, Steps);
        return (0, _possibleConstructorReturn3['default'])(this, (Steps.__proto__ || Object.getPrototypeOf(Steps)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Steps, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.componentDidUpdate();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.direction !== 'horizontal') {
                return;
            }
            // set tail's left position based on main's width for each step dynamically.
            this.stepRefs.forEach(function (s) {
                if (s.refs.tail) {
                    s.refs.tail.style.left = s.refs.main.offsetWidth / 2 + 'px';
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            this.stepRefs = [];
            var _props = this.props,
                children = _props.children,
                status = _props.status,
                size = _props.size;

            var current = this.props.current;
            // flattern the array at first https://github.com/ant-design/ant-design-mobile/issues/934
            var filterChildren = [];
            if (children && children.length) {
                children.forEach(function (item) {
                    if (_react2['default'].isValidElement(item)) {
                        filterChildren.push(item);
                    }
                });
            }
            var newChildren = _react2['default'].Children.map(filterChildren, function (item, index) {
                var className = item.props.className;
                if (index < filterChildren.length - 1 && filterChildren[index + 1].props.status === 'error') {
                    className = className ? className + ' error-tail' : 'error-tail';
                }
                var icon = item.props.icon;
                if (!icon) {
                    if (index < current) {
                        // 对应 state: finish
                        icon = 'check-circle-o';
                    } else if (index > current) {
                        // 对应 state: wait
                        icon = 'ellipsis';
                        className = className ? className + ' ellipsis-item' : 'ellipsis-item';
                    }
                    if (status === 'error' && index === current || item.props.status === 'error') {
                        icon = 'cross-circle-o';
                    }
                }
                icon = typeof icon === 'string' ? _react2['default'].createElement(_icon2['default'], { type: icon, size: size === 'small' ? status === 'wait' ? 'xxs' : 'xs' : 'md' }) : icon;
                return _react2['default'].cloneElement(item, {
                    icon: icon,
                    className: className,
                    ref: function ref(c) {
                        return _this2.stepRefs[index] = c;
                    }
                });
            });
            return _react2['default'].createElement(
                _rmcSteps2['default'],
                (0, _extends3['default'])({ ref: function ref(el) {
                        return _this2.stepsRef = el;
                    } }, this.props),
                newChildren
            );
        }
    }]);
    return Steps;
}(_react2['default'].Component);

exports['default'] = Steps;

Steps.Step = _rmcSteps2['default'].Step;
Steps.defaultProps = {
    prefixCls: 'am-steps',
    iconPrefix: 'ant',
    labelPlacement: 'vertical',
    direction: 'vertical',
    current: 0
};
module.exports = exports['default'];