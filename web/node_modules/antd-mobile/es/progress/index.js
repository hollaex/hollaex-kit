import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import classnames from 'classnames';
import React from 'react';

var Progress = function (_React$Component) {
    _inherits(Progress, _React$Component);

    function Progress() {
        _classCallCheck(this, Progress);

        return _possibleConstructorReturn(this, (Progress.__proto__ || Object.getPrototypeOf(Progress)).apply(this, arguments));
    }

    _createClass(Progress, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps() {
            this.noAppearTransition = true;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            if (this.props.appearTransition) {
                setTimeout(function () {
                    if (_this2.barRef) {
                        _this2.barRef.style.width = _this2.props.percent + '%';
                    }
                }, 10);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _classnames,
                _this3 = this;

            var _props = this.props,
                className = _props.className,
                prefixCls = _props.prefixCls,
                position = _props.position,
                unfilled = _props.unfilled,
                _props$style = _props.style,
                style = _props$style === undefined ? {} : _props$style,
                _props$barStyle = _props.barStyle,
                barStyle = _props$barStyle === undefined ? {} : _props$barStyle;

            var percentStyle = {
                width: this.noAppearTransition || !this.props.appearTransition ? this.props.percent + '%' : 0,
                height: 0
            };
            var wrapCls = classnames(prefixCls + '-outer', className, (_classnames = {}, _defineProperty(_classnames, prefixCls + '-fixed-outer', position === 'fixed'), _defineProperty(_classnames, prefixCls + '-hide-outer', !unfilled), _classnames));
            return React.createElement(
                'div',
                { style: style, className: wrapCls, role: 'progressbar', 'aria-valuenow': this.props.percent, 'aria-valuemin': 0, 'aria-valuemax': 100 },
                React.createElement('div', { ref: function ref(el) {
                        return _this3.barRef = el;
                    }, className: prefixCls + '-bar', style: _extends({}, barStyle, percentStyle) })
            );
        }
    }]);

    return Progress;
}(React.Component);

export default Progress;

Progress.defaultProps = {
    prefixCls: 'am-progress',
    percent: 0,
    position: 'fixed',
    unfilled: true,
    appearTransition: false
};