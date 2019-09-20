import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import React from 'react';

var ActivityIndicator = function (_React$Component) {
    _inherits(ActivityIndicator, _React$Component);

    function ActivityIndicator() {
        _classCallCheck(this, ActivityIndicator);

        return _possibleConstructorReturn(this, (ActivityIndicator.__proto__ || Object.getPrototypeOf(ActivityIndicator)).apply(this, arguments));
    }

    _createClass(ActivityIndicator, [{
        key: 'render',
        value: function render() {
            var _classnames;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                className = _props.className,
                animating = _props.animating,
                toast = _props.toast,
                size = _props.size,
                text = _props.text;

            var wrapClass = classnames(prefixCls, className, (_classnames = {}, _defineProperty(_classnames, prefixCls + '-lg', size === 'large'), _defineProperty(_classnames, prefixCls + '-sm', size === 'small'), _defineProperty(_classnames, prefixCls + '-toast', !!toast), _classnames));
            var spinnerClass = classnames(prefixCls + '-spinner', _defineProperty({}, prefixCls + '-spinner-lg', !!toast || size === 'large'));
            if (animating) {
                if (toast) {
                    return React.createElement(
                        'div',
                        { className: wrapClass },
                        text ? React.createElement(
                            'div',
                            { className: prefixCls + '-content' },
                            React.createElement('span', { className: spinnerClass, 'aria-hidden': 'true' }),
                            React.createElement(
                                'span',
                                { className: prefixCls + '-toast' },
                                text
                            )
                        ) : React.createElement(
                            'div',
                            { className: prefixCls + '-content' },
                            React.createElement('span', { className: spinnerClass, 'aria-label': 'Loading' })
                        )
                    );
                } else {
                    return text ? React.createElement(
                        'div',
                        { className: wrapClass },
                        React.createElement('span', { className: spinnerClass, 'aria-hidden': 'true' }),
                        React.createElement(
                            'span',
                            { className: prefixCls + '-tip' },
                            text
                        )
                    ) : React.createElement(
                        'div',
                        { className: wrapClass },
                        React.createElement('span', { className: spinnerClass, 'aria-label': 'loading' })
                    );
                }
            } else {
                return null;
            }
        }
    }]);

    return ActivityIndicator;
}(React.Component);

export default ActivityIndicator;

ActivityIndicator.defaultProps = {
    prefixCls: 'am-activity-indicator',
    animating: true,
    size: 'small',
    panelColor: 'rgba(34,34,34,0.6)',
    toast: false
};