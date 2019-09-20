import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { throttle } from './util';

// const SCROLLVIEW = 'ScrollViewRef';
// const INNERVIEW = 'InnerScrollViewRef';

// https://github.com/facebook/react-native/blob/0.26-stable/Libraries/Components/ScrollView/ScrollView.js

/* eslint react/prop-types: 0, react/sort-comp: 0, no-unused-expressions: 0 */

var propTypes = {
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  listPrefixCls: PropTypes.string,
  listViewPrefixCls: PropTypes.string,
  style: PropTypes.object,
  contentContainerStyle: PropTypes.object,
  onScroll: PropTypes.func
};

var ScrollView = function (_React$Component) {
  _inherits(ScrollView, _React$Component);

  function ScrollView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ScrollView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ScrollView.__proto__ || Object.getPrototypeOf(ScrollView)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ScrollView, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      // https://github.com/ant-design/ant-design-mobile/issues/1480
      // https://stackoverflow.com/questions/1386696/make-scrollleft-scrolltop-changes-not-trigger-scroll-event
      // 问题情景：用户滚动内容后，改变 dataSource 触发 ListView componentWillReceiveProps
      // 内容变化后 scrollTop 如果改变、会自动触发 scroll 事件，而此事件应该避免被执行
      if ((this.props.dataSource !== nextProps.dataSource || this.props.initialListSize !== nextProps.initialListSize) && this.handleScroll) {
        // console.log('componentWillUpdate');
        if (this.props.useBodyScroll) {
          window.removeEventListener('scroll', this.handleScroll);
        } else {
          this.ScrollViewRef.removeEventListener('scroll', this.handleScroll);
        }
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      // handle componentWillUpdate accordingly
      if ((this.props.dataSource !== prevProps.dataSource || this.props.initialListSize !== prevProps.initialListSize) && this.handleScroll) {
        setTimeout(function () {
          if (_this2.props.useBodyScroll) {
            window.addEventListener('scroll', _this2.handleScroll);
          } else {
            _this2.ScrollViewRef.addEventListener('scroll', _this2.handleScroll);
          }
        }, 0);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      var handleScroll = function handleScroll(e) {
        return _this3.props.onScroll && _this3.props.onScroll(e, _this3.getMetrics());
      };
      if (this.props.scrollEventThrottle) {
        handleScroll = throttle(handleScroll, this.props.scrollEventThrottle);
      }
      this.handleScroll = handleScroll;

      // IE supports onresize on all HTML elements.
      // In all other Browsers the onresize is only available at the window object
      this.onLayout = function () {
        return _this3.props.onLayout({
          nativeEvent: { layout: { width: window.innerWidth, height: window.innerHeight } }
        });
      };

      if (this.props.useBodyScroll) {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.onLayout);
      } else {
        this.ScrollViewRef.addEventListener('scroll', this.handleScroll);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.useBodyScroll) {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.onLayout);
      } else {
        this.ScrollViewRef.removeEventListener('scroll', this.handleScroll);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          children = _props.children,
          className = _props.className,
          prefixCls = _props.prefixCls,
          listPrefixCls = _props.listPrefixCls,
          listViewPrefixCls = _props.listViewPrefixCls,
          _props$style = _props.style,
          style = _props$style === undefined ? {} : _props$style,
          _props$contentContain = _props.contentContainerStyle,
          contentContainerStyle = _props$contentContain === undefined ? {} : _props$contentContain,
          useBodyScroll = _props.useBodyScroll,
          pullToRefresh = _props.pullToRefresh;


      var styleBase = {
        position: 'relative',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      };
      var preCls = prefixCls || listViewPrefixCls || '';

      var containerProps = {
        ref: function ref(el) {
          return _this4.ScrollViewRef = el || _this4.ScrollViewRef;
        },
        style: _extends({}, useBodyScroll ? {} : styleBase, style),
        className: classNames(className, preCls + '-scrollview')
      };
      var contentContainerProps = {
        ref: function ref(el) {
          return _this4.InnerScrollViewRef = el;
        },
        style: _extends({ position: 'absolute', minWidth: '100%' }, contentContainerStyle),
        className: classNames(preCls + '-scrollview-content', listPrefixCls)
      };

      var clonePullToRefresh = function clonePullToRefresh(isBody) {
        return React.cloneElement(pullToRefresh, {
          getScrollContainer: isBody ? function () {
            return document.body;
          } : function () {
            return _this4.ScrollViewRef;
          }
        }, children);
      };

      if (useBodyScroll) {
        if (pullToRefresh) {
          return React.createElement(
            'div',
            containerProps,
            clonePullToRefresh(true)
          );
        }
        return React.createElement(
          'div',
          containerProps,
          children
        );
      }

      if (pullToRefresh) {
        return React.createElement(
          'div',
          containerProps,
          React.createElement(
            'div',
            contentContainerProps,
            clonePullToRefresh()
          )
        );
      }

      return React.createElement(
        'div',
        containerProps,
        React.createElement(
          'div',
          contentContainerProps,
          children
        )
      );
    }
  }]);

  return ScrollView;
}(React.Component);

ScrollView.propTypes = propTypes;

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.getMetrics = function () {
    var isVertical = !_this5.props.horizontal;
    if (_this5.props.useBodyScroll) {
      // In chrome61 `document.body.scrollTop` is invalid,
      // and add new `document.scrollingElement`(chrome61, iOS support).
      // In old-android-browser and iOS `document.documentElement.scrollTop` is invalid.
      var scrollNode = document.scrollingElement ? document.scrollingElement : document.body;
      // todos: Why sometimes do not have `this.ScrollViewRef` ?
      return {
        visibleLength: window[isVertical ? 'innerHeight' : 'innerWidth'],
        contentLength: _this5.ScrollViewRef ? _this5.ScrollViewRef[isVertical ? 'scrollHeight' : 'scrollWidth'] : 0,
        offset: scrollNode[isVertical ? 'scrollTop' : 'scrollLeft']
      };
    }
    return {
      visibleLength: _this5.ScrollViewRef[isVertical ? 'offsetHeight' : 'offsetWidth'],
      contentLength: _this5.ScrollViewRef[isVertical ? 'scrollHeight' : 'scrollWidth'],
      offset: _this5.ScrollViewRef[isVertical ? 'scrollTop' : 'scrollLeft']
    };
  };

  this.getInnerViewNode = function () {
    return _this5.InnerScrollViewRef;
  };

  this.scrollTo = function () {
    if (_this5.props.useBodyScroll) {
      var _window;

      (_window = window).scrollTo.apply(_window, arguments);
    } else {
      _this5.ScrollViewRef.scrollLeft = arguments.length <= 0 ? undefined : arguments[0];
      _this5.ScrollViewRef.scrollTop = arguments.length <= 1 ? undefined : arguments[1];
    }
  };
};

export default ScrollView;