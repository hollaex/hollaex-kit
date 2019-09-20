import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* eslint react/no-did-mount-set-state: 0 */
import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { isFlexSupported } from './utils';

var Steps = function (_Component) {
  _inherits(Steps, _Component);

  function Steps(props) {
    _classCallCheck(this, Steps);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.onStepClick = function (next) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          current = _this$props.current;

      if (onChange && current !== next) {
        onChange(next);
      }
    };

    _this.calcStepOffsetWidth = function () {
      if (isFlexSupported()) {
        return;
      }
      // Just for IE9
      var domNode = findDOMNode(_this);
      if (domNode.children.length > 0) {
        if (_this.calcTimeout) {
          clearTimeout(_this.calcTimeout);
        }
        _this.calcTimeout = setTimeout(function () {
          // +1 for fit edge bug of digit width, like 35.4px
          var lastStepOffsetWidth = (domNode.lastChild.offsetWidth || 0) + 1;
          // Reduce shake bug
          if (_this.state.lastStepOffsetWidth === lastStepOffsetWidth || Math.abs(_this.state.lastStepOffsetWidth - lastStepOffsetWidth) <= 3) {
            return;
          }
          _this.setState({ lastStepOffsetWidth: lastStepOffsetWidth });
        });
      }
    };

    _this.state = {
      flexSupported: true,
      lastStepOffsetWidth: 0
    };
    _this.calcStepOffsetWidth = debounce(_this.calcStepOffsetWidth, 150);
    return _this;
  }

  Steps.prototype.componentDidMount = function componentDidMount() {
    this.calcStepOffsetWidth();
    if (!isFlexSupported()) {
      this.setState({
        flexSupported: false
      });
    }
  };

  Steps.prototype.componentDidUpdate = function componentDidUpdate() {
    this.calcStepOffsetWidth();
  };

  Steps.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.calcTimeout) {
      clearTimeout(this.calcTimeout);
    }
    if (this.calcStepOffsetWidth && this.calcStepOffsetWidth.cancel) {
      this.calcStepOffsetWidth.cancel();
    }
  };

  Steps.prototype.render = function render() {
    var _classNames,
        _this2 = this;

    var _props = this.props,
        prefixCls = _props.prefixCls,
        _props$style = _props.style,
        style = _props$style === undefined ? {} : _props$style,
        className = _props.className,
        children = _props.children,
        direction = _props.direction,
        labelPlacement = _props.labelPlacement,
        iconPrefix = _props.iconPrefix,
        status = _props.status,
        size = _props.size,
        current = _props.current,
        progressDot = _props.progressDot,
        initial = _props.initial,
        icons = _props.icons,
        onChange = _props.onChange,
        restProps = _objectWithoutProperties(_props, ['prefixCls', 'style', 'className', 'children', 'direction', 'labelPlacement', 'iconPrefix', 'status', 'size', 'current', 'progressDot', 'initial', 'icons', 'onChange']);

    var _state = this.state,
        lastStepOffsetWidth = _state.lastStepOffsetWidth,
        flexSupported = _state.flexSupported;

    var filteredChildren = React.Children.toArray(children).filter(function (c) {
      return !!c;
    });
    var lastIndex = filteredChildren.length - 1;
    var adjustedlabelPlacement = !!progressDot ? 'vertical' : labelPlacement;
    var classString = classNames(prefixCls, prefixCls + '-' + direction, className, (_classNames = {}, _classNames[prefixCls + '-' + size] = size, _classNames[prefixCls + '-label-' + adjustedlabelPlacement] = direction === 'horizontal', _classNames[prefixCls + '-dot'] = !!progressDot, _classNames[prefixCls + '-flex-not-supported'] = !flexSupported, _classNames));

    return React.createElement(
      'div',
      _extends({ className: classString, style: style }, restProps),
      Children.map(filteredChildren, function (child, index) {
        if (!child) {
          return null;
        }
        var stepNumber = initial + index;
        var childProps = _extends({
          stepNumber: '' + (stepNumber + 1),
          stepIndex: stepNumber,
          prefixCls: prefixCls,
          iconPrefix: iconPrefix,
          wrapperStyle: style,
          progressDot: progressDot,
          icons: icons,
          onStepClick: onChange && _this2.onStepClick
        }, child.props);
        if (!flexSupported && direction !== 'vertical' && index !== lastIndex) {
          childProps.itemWidth = 100 / lastIndex + '%';
          childProps.adjustMarginRight = -Math.round(lastStepOffsetWidth / lastIndex + 1);
        }
        // fix tail color
        if (status === 'error' && index === current - 1) {
          childProps.className = prefixCls + '-next-error';
        }
        if (!child.props.status) {
          if (stepNumber === current) {
            childProps.status = status;
          } else if (stepNumber < current) {
            childProps.status = 'finish';
          } else {
            childProps.status = 'wait';
          }
        }
        return cloneElement(child, childProps);
      })
    );
  };

  return Steps;
}(Component);

Steps.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  iconPrefix: PropTypes.string,
  direction: PropTypes.string,
  labelPlacement: PropTypes.string,
  children: PropTypes.any,
  status: PropTypes.string,
  size: PropTypes.string,
  progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  style: PropTypes.object,
  initial: PropTypes.number,
  current: PropTypes.number,
  icons: PropTypes.shape({
    finish: PropTypes.node,
    error: PropTypes.node
  }),
  onChange: PropTypes.func
};
Steps.defaultProps = {
  prefixCls: 'rc-steps',
  iconPrefix: 'rc',
  direction: 'horizontal',
  labelPlacement: 'horizontal',
  initial: 0,
  current: 0,
  status: 'process',
  size: '',
  progressDot: false
};
export default Steps;