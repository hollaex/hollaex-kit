import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';

var AnimateWrapper = function (_React$PureComponent) {
    _inherits(AnimateWrapper, _React$PureComponent);

    function AnimateWrapper() {
        _classCallCheck(this, AnimateWrapper);

        return _possibleConstructorReturn(this, _React$PureComponent.apply(this, arguments));
    }

    AnimateWrapper.prototype.render = function render() {
        var _props = this.props,
            className = _props.className,
            displayType = _props.displayType,
            visible = _props.visible;

        return React.createElement(
            'div',
            { className: className + ' animate', style: { display: visible ? displayType : 'none' } },
            visible && this.props.children
        );
    };

    return AnimateWrapper;
}(React.PureComponent);

export default AnimateWrapper;

AnimateWrapper.defaultProps = {
    className: '',
    displayType: 'flex'
};