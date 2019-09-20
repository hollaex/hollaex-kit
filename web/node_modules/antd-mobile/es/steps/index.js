import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import RcSteps from 'rmc-steps';
import Icon from '../icon';

var Steps = function (_React$Component) {
    _inherits(Steps, _React$Component);

    function Steps() {
        _classCallCheck(this, Steps);

        return _possibleConstructorReturn(this, (Steps.__proto__ || Object.getPrototypeOf(Steps)).apply(this, arguments));
    }

    _createClass(Steps, [{
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
                    if (React.isValidElement(item)) {
                        filterChildren.push(item);
                    }
                });
            }
            var newChildren = React.Children.map(filterChildren, function (item, index) {
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
                icon = typeof icon === 'string' ? React.createElement(Icon, { type: icon, size: size === 'small' ? status === 'wait' ? 'xxs' : 'xs' : 'md' }) : icon;
                return React.cloneElement(item, {
                    icon: icon,
                    className: className,
                    ref: function ref(c) {
                        return _this2.stepRefs[index] = c;
                    }
                });
            });
            return React.createElement(
                RcSteps,
                _extends({ ref: function ref(el) {
                        return _this2.stepsRef = el;
                    } }, this.props),
                newChildren
            );
        }
    }]);

    return Steps;
}(React.Component);

export default Steps;

Steps.Step = RcSteps.Step;
Steps.defaultProps = {
    prefixCls: 'am-steps',
    iconPrefix: 'ant',
    labelPlacement: 'vertical',
    direction: 'vertical',
    current: 0
};