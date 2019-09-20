import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import classnames from 'classnames';
import React from 'react';

var WingBlank = function (_React$Component) {
    _inherits(WingBlank, _React$Component);

    function WingBlank() {
        _classCallCheck(this, WingBlank);

        return _possibleConstructorReturn(this, (WingBlank.__proto__ || Object.getPrototypeOf(WingBlank)).apply(this, arguments));
    }

    _createClass(WingBlank, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                prefixCls = _props.prefixCls,
                size = _props.size,
                className = _props.className,
                children = _props.children,
                style = _props.style;

            var wrapCls = classnames(prefixCls, prefixCls + '-' + size, className);
            return React.createElement(
                'div',
                { className: wrapCls, style: style },
                children
            );
        }
    }]);

    return WingBlank;
}(React.Component);

export default WingBlank;

WingBlank.defaultProps = {
    prefixCls: 'am-wingblank',
    size: 'lg'
};