import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function isString(str) {
  return typeof str === 'string';
}

var Step = function (_React$Component) {
  _inherits(Step, _React$Component);

  function Step() {
    var _temp, _this, _ret;

    _classCallCheck(this, Step);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
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
    var iconClassName = classNames(prefixCls + '-icon', iconPrefix + 'icon', (_classNames = {}, _classNames[iconPrefix + 'icon-' + icon] = icon && isString(icon), _classNames[iconPrefix + 'icon-check'] = !icon && status === 'finish' && icons && !icons.finish, _classNames[iconPrefix + 'icon-close'] = !icon && status === 'error' && icons && !icons.error, _classNames));
    var iconDot = React.createElement('span', { className: prefixCls + '-icon-dot' });
    // `progressDot` enjoy the highest priority
    if (progressDot) {
      if (typeof progressDot === 'function') {
        iconNode = React.createElement(
          'span',
          { className: prefixCls + '-icon' },
          progressDot(iconDot, { index: stepNumber - 1, status: status, title: title, description: description })
        );
      } else {
        iconNode = React.createElement(
          'span',
          { className: prefixCls + '-icon' },
          iconDot
        );
      }
    } else if (icon && !isString(icon)) {
      iconNode = React.createElement(
        'span',
        { className: prefixCls + '-icon' },
        icon
      );
    } else if (icons && icons.finish && status === 'finish') {
      iconNode = React.createElement(
        'span',
        { className: prefixCls + '-icon' },
        icons.finish
      );
    } else if (icons && icons.error && status === 'error') {
      iconNode = React.createElement(
        'span',
        { className: prefixCls + '-icon' },
        icons.error
      );
    } else if (icon || status === 'finish' || status === 'error') {
      iconNode = React.createElement('span', { className: iconClassName });
    } else {
      iconNode = React.createElement(
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
        restProps = _objectWithoutProperties(_props2, ['className', 'prefixCls', 'style', 'itemWidth', 'status', 'iconPrefix', 'icon', 'wrapperStyle', 'adjustMarginRight', 'stepNumber', 'description', 'title', 'progressDot', 'tailContent', 'icons', 'stepIndex', 'onStepClick', 'onClick']);

    var classString = classNames(prefixCls + '-item', prefixCls + '-item-' + status, className, (_classNames2 = {}, _classNames2[prefixCls + '-item-custom'] = icon, _classNames2));
    var stepItemStyle = _extends({}, style);
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

    return React.createElement(
      'div',
      _extends({
        onClick: onClick
      }, accessibilityProps, restProps, {
        className: classString,
        style: stepItemStyle
      }),
      React.createElement(
        'div',
        { className: prefixCls + '-item-tail' },
        tailContent
      ),
      React.createElement(
        'div',
        { className: prefixCls + '-item-icon' },
        this.renderIconNode()
      ),
      React.createElement(
        'div',
        { className: prefixCls + '-item-content' },
        React.createElement(
          'div',
          { className: prefixCls + '-item-title' },
          title
        ),
        description && React.createElement(
          'div',
          { className: prefixCls + '-item-description' },
          description
        )
      )
    );
  };

  return Step;
}(React.Component);

Step.propTypes = {
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  style: PropTypes.object,
  wrapperStyle: PropTypes.object,
  itemWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  status: PropTypes.string,
  iconPrefix: PropTypes.string,
  icon: PropTypes.node,
  adjustMarginRight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  stepNumber: PropTypes.string,
  stepIndex: PropTypes.number,
  description: PropTypes.any,
  title: PropTypes.any,
  progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  tailContent: PropTypes.any,
  icons: PropTypes.shape({
    finish: PropTypes.node,
    error: PropTypes.node
  }),
  onClick: PropTypes.func,
  onStepClick: PropTypes.func
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

export default Step;