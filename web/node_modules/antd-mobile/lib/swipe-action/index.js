'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _rcSwipeout = require('rc-swipeout');

var _rcSwipeout2 = _interopRequireDefault(_rcSwipeout);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SwipeAction = function (_React$Component) {
  (0, _inherits3['default'])(SwipeAction, _React$Component);

  function SwipeAction() {
    (0, _classCallCheck3['default'])(this, SwipeAction);
    return (0, _possibleConstructorReturn3['default'])(this, (SwipeAction.__proto__ || Object.getPrototypeOf(SwipeAction)).apply(this, arguments));
  }

  (0, _createClass3['default'])(SwipeAction, [{
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

      var wrapClass = (0, _classnames2['default'])(prefixCls, className);
      return left.length || right.length ? _react2['default'].createElement(
        'div',
        { style: style, className: className },
        _react2['default'].createElement(
          _rcSwipeout2['default'],
          { prefixCls: prefixCls, left: left, right: right, autoClose: autoClose, disabled: disabled, onOpen: onOpen, onClose: onClose },
          children
        )
      ) : _react2['default'].createElement(
        'div',
        { style: style, className: wrapClass },
        children
      );
    }
  }]);
  return SwipeAction;
}(_react2['default'].Component);

SwipeAction.defaultProps = {
  prefixCls: 'am-swipe',
  autoClose: false,
  disabled: false,
  left: [],
  right: [],
  onOpen: function onOpen() {},
  onClose: function onClose() {}
};
exports['default'] = SwipeAction;
module.exports = exports['default'];