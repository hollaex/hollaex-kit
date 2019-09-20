'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function isString(str) {
  return typeof str === 'string';
}

var Step = function (_React$Component) {
  (0, _inherits3['default'])(Step, _React$Component);

  function Step() {
    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Step);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  Step.prototype.renderIconNode = function renderIconNode() {
    var _classNames;

    var _props = this.props,
        prefixCls = _props.prefixCls,
        progressDot = _props.progressDot,
        stepNumber = _props.stepNumber,
        status = _props.status,
        title = _props.title,
        description = _props.description,
        icon = _props.icon,
        iconPrefix = _props.iconPrefix,
        icons = _props.icons;

    var iconNode = void 0;
    var iconClassName = (0, _classnames2['default'])(prefixCls + '-icon', iconPrefix + 'icon', (_classNames = {}, _classNames[iconPrefix + 'icon-' + icon] = icon && isString(icon), _classNames[iconPrefix + 'icon-check'] = !icon && status === 'finish' && icons && !icons.finish, _classNames[iconPrefix + 'icon-close'] = !icon && status === 'error' && icons && !icons.error, _classNames));
    var iconDot = _react2['default'].createElement('span', { className: prefixCls + '-icon-dot' });
    // `progressDot` enjoy the highest priority
    if (progressDot) {
      if (typeof progressDot === 'function') {
        iconNode = _react2['default'].createElement(
          'span',
          { className: prefixCls + '-icon' },
          progressDot(iconDot, { index: stepNumber - 1, status: status, title: title, description: description })
        );
      } else {
        iconNode = _react2['default'].createElement(
          'span',
          { className: prefixCls + '-icon' },
          iconDot
        );
      }
    } else if (icon && !isString(icon)) {
      iconNode = _react2['default'].createElement(
        'span',
        { className: prefixCls + '-icon' },
        icon
      );
    } else if (icons && icons.finish && status === 'finish') {
      iconNode = _react2['default'].createElement(
        'span',
        { className: prefixCls + '-icon' },
        icons.finish
      );
    } else if (icons && icons.error && status === 'error') {
      iconNode = _react2['default'].createElement(
        'span',
        { className: prefixCls + '-icon' },
        icons.error
      );
    } else if (icon || status === 'finish' || status === 'error') {
      iconNode = _react2['default'].createElement('span', { className: iconClassName });
    } else {
      iconNode = _react2['default'].createElement(
        'span',
        { className: prefixCls + '-icon' },
        stepNumber
      );
    }

    return iconNode;
  };

  Step.prototype.render = function render() {
    var _classNames2;

    var _props2 = this.props,
        className = _props2.className,
        prefixCls = _props2.prefixCls,
        style = _props2.style,
        itemWidth = _props2.itemWidth,
        _props2$status = _props2.status,
        status = _props2$status === undefined ? 'wait' : _props2$status,
        iconPrefix = _props2.iconPrefix,
        icon = _props2.icon,
        wrapperStyle = _props2.wrapperStyle,
        adjustMarginRight = _props2.adjustMarginRight,
        stepNumber = _props2.stepNumber,
        description = _props2.description,
        title = _props2.title,
        progressDot = _props2.progressDot,
        tailContent = _props2.tailContent,
        icons = _props2.icons,
        stepIndex = _props2.stepIndex,
        onStepClick = _props2.onStepClick,
        onClick = _props2.onClick,
        restProps = (0, _objectWithoutProperties3['default'])(_props2, ['className', 'prefixCls', 'style', 'itemWidth', 'status', 'iconPrefix', 'icon', 'wrapperStyle', 'adjustMarginRight', 'stepNumber', 'description', 'title', 'progressDot', 'tailContent', 'icons', 'stepIndex', 'onStepClick', 'onClick']);


    var classString = (0, _classnames2['default'])(prefixCls + '-item', prefixCls + '-item-' + status, className, (_classNames2 = {}, _classNames2[prefixCls + '-item-custom'] = icon, _classNames2));
    var stepItemStyle = (0, _extends3['default'])({}, style);
    if (itemWidth) {
      stepItemStyle.width = itemWidth;
    }
    if (adjustMarginRight) {
      stepItemStyle.marginRight = adjustMarginRight;
    }

    var accessibilityProps = {};
    if (onStepClick) {
      accessibilityProps.role = 'button';
      accessibilityProps.tabIndex = 0;
      accessibilityProps.onClick = this.onClick;
    }

    return _react2['default'].createElement(
      'div',
      (0, _extends3['default'])({
        onClick: onClick
      }, accessibilityProps, restProps, {
        className: classString,
        style: stepItemStyle
      }),
      _react2['default'].createElement(
        'div',
        { className: prefixCls + '-item-tail' },
        tailContent
      ),
      _react2['default'].createElement(
        'div',
        { className: prefixCls + '-item-icon' },
        this.renderIconNode()
      ),
      _react2['default'].createElement(
        'div',
        { className: prefixCls + '-item-content' },
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-item-title' },
          title
        ),
        description && _react2['default'].createElement(
          'div',
          { className: prefixCls + '-item-description' },
          description
        )
      )
    );
  };

  return Step;
}(_react2['default'].Component);

Step.propTypes = {
  className: _propTypes2['default'].string,
  prefixCls: _propTypes2['default'].string,
  style: _propTypes2['default'].object,
  wrapperStyle: _propTypes2['default'].object,
  itemWidth: _propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].string]),
  status: _propTypes2['default'].string,
  iconPrefix: _propTypes2['default'].string,
  icon: _propTypes2['default'].node,
  adjustMarginRight: _propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].string]),
  stepNumber: _propTypes2['default'].string,
  stepIndex: _propTypes2['default'].number,
  description: _propTypes2['default'].any,
  title: _propTypes2['default'].any,
  progressDot: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].func]),
  tailContent: _propTypes2['default'].any,
  icons: _propTypes2['default'].shape({
    finish: _propTypes2['default'].node,
    error: _propTypes2['default'].node
  }),
  onClick: _propTypes2['default'].func,
  onStepClick: _propTypes2['default'].func
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onClick = function () {
    var _props3 = _this2.props,
        onClick = _props3.onClick,
        onStepClick = _props3.onStepClick,
        stepIndex = _props3.stepIndex;


    if (onClick) {
      onClick.apply(undefined, arguments);
    }

    onStepClick(stepIndex);
  };
};

exports['default'] = Step;
module.exports = exports['default'];