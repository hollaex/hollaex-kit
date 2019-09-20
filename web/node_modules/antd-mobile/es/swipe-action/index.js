import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import classnames from 'classnames';
import Swipeout from 'rc-swipeout';
import React from 'react';

var SwipeAction = function (_React$Component) {
  _inherits(SwipeAction, _React$Component);

  function SwipeAction() {
    _classCallCheck(this, SwipeAction);

    return _possibleConstructorReturn(this, (SwipeAction.__proto__ || Object.getPrototypeOf(SwipeAction)).apply(this, arguments));
  }

  _createClass(SwipeAction, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          style = _props.style,
          prefixCls = _props.prefixCls,
          _props$left = _props.left,
          left = _props$left === undefined ? [] : _props$left,
          _props$right = _props.right,
          right = _props$right === undefined ? [] : _props$right,
          autoClose = _props.autoClose,
          disabled = _props.disabled,
          onOpen = _props.onOpen,
          onClose = _props.onClose,
          children = _props.children;

      var wrapClass = classnames(prefixCls, className);
      return left.length || right.length ? React.createElement(
        'div',
        { style: style, className: className },
        React.createElement(
          Swipeout,
          { prefixCls: prefixCls, left: left, right: right, autoClose: autoClose, disabled: disabled, onOpen: onOpen, onClose: onClose },
          children
        )
      ) : React.createElement(
        'div',
        { style: style, className: wrapClass },
        children
      );
    }
  }]);

  return SwipeAction;
}(React.Component);

SwipeAction.defaultProps = {
  prefixCls: 'am-swipe',
  autoClose: false,
  disabled: false,
  left: [],
  right: [],
  onOpen: function onOpen() {},
  onClose: function onClose() {}
};
export default SwipeAction;