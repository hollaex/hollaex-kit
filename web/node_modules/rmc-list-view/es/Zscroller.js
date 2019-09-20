import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import DOMScroller from 'zscroller';
import classNames from 'classnames';
import { throttle } from './util';

/* eslint react/prop-types: 0, react/sort-comp: 0, no-unused-expressions: 0 */

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
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.refreshControl && this.props.refreshControl) {
        var preRefreshing = prevProps.refreshing;
        var nowRefreshing = this.props.refreshing;
        if (preRefreshing && !nowRefreshing && !this._refreshControlTimer) {
          this.domScroller.scroller.finishPullToRefresh();
        } else if (!this.manuallyRefresh && !preRefreshing && nowRefreshing) {
          this.domScroller.scroller.triggerPullToRefresh();
        }
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var handleScroll = function handleScroll() {
        return _this2.props.onScroll && _this2.props.onScroll(_this2.domScroller, _this2.getMetrics());
      };
      if (this.props.scrollEventThrottle) {
        handleScroll = throttle(handleScroll, this.props.scrollEventThrottle);
      }
      this.handleScroll = handleScroll;
      this.renderZscroller();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.domScroller.destroy();
    }
  }, {
    key: 'renderZscroller',
    value: function renderZscroller() {
      var _this3 = this;

      var _props = this.props,
          scrollerOptions = _props.scrollerOptions,
          refreshControl = _props.refreshControl,
          distanceToRefresh = _props.distanceToRefresh,
          onRefresh = _props.onRefresh;

      var _scrollingComplete = scrollerOptions.scrollingComplete,
          restProps = _objectWithoutProperties(scrollerOptions, ['scrollingComplete']);

      this.domScroller = new DOMScroller(this.getInnerViewNode(), _extends({
        scrollingX: false,
        onScroll: this.handleScroll,
        scrollingComplete: function scrollingComplete() {
          if (refreshControl && _this3.state.deactive) {
            _this3.setState({ deactive: false });
          }
          if (_scrollingComplete) {
            _scrollingComplete();
          }
        }
      }, restProps));
      if (refreshControl) {
        var scroller = this.domScroller.scroller;
        scroller.activatePullToRefresh(distanceToRefresh, function () {
          // console.log('reach to the distance');
          _this3.manuallyRefresh = true;
          _this3.overDistanceThenRelease = false;
          _this3.setState({ active: true });
        }, function () {
          // console.log('back to the distance');
          _this3.manuallyRefresh = false;
          _this3.setState({
            deactive: _this3.overDistanceThenRelease,
            active: false,
            loadingState: false
          });
        }, function () {
          // console.log('Over distance and release to loading');
          _this3.overDistanceThenRelease = true;
          _this3.setState({
            deactive: false,
            loadingState: true
          });
          _this3._refreshControlTimer = setTimeout(function () {
            if (!_this3.props.refreshing) {
              scroller.finishPullToRefresh();
            }
            _this3._refreshControlTimer = undefined;
          }, 1000);
          onRefresh();
        });
        if (this.props.refreshing) {
          scroller.triggerPullToRefresh();
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this,
          _classNames;

      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          prefixCls = _props2.prefixCls,
          listPrefixCls = _props2.listPrefixCls,
          listViewPrefixCls = _props2.listViewPrefixCls,
          _props2$style = _props2.style,
          style = _props2$style === undefined ? {} : _props2$style,
          _props2$contentContai = _props2.contentContainerStyle,
          contentContainerStyle = _props2$contentContai === undefined ? {} : _props2$contentContai,
          refreshControl = _props2.refreshControl,
          icon = _props2.icon,
          loading = _props2.loading,
          refreshing = _props2.refreshing;


      var preCls = prefixCls || listViewPrefixCls || '';

      var containerProps = {
        ref: function ref(el) {
          return _this4.ScrollViewRef = el;
        },
        style: _extends({ position: 'relative', overflow: 'hidden' }, style),
        className: classNames(className, preCls + '-scrollview')
      };
      var contentContainerProps = {
        ref: function ref(el) {
          return _this4.InnerScrollViewRef = el;
        },
        style: _extends({ position: 'absolute', minWidth: '100%' }, contentContainerStyle),
        className: classNames(preCls + '-scrollview-content', listPrefixCls)
      };

      var _state = this.state,
          active = _state.active,
          deactive = _state.deactive,
          loadingState = _state.loadingState;

      var wrapCls = classNames(preCls + '-refresh-control-indicator', (_classNames = {}, _defineProperty(_classNames, preCls + '-refresh-control-active', active), _defineProperty(_classNames, preCls + '-refresh-control-deactive', deactive), _defineProperty(_classNames, preCls + '-refresh-control-loading', loadingState || refreshing), _classNames));

      if (refreshControl) {
        return React.createElement(
          'div',
          containerProps,
          React.createElement(
            'div',
            contentContainerProps,
            React.createElement(
              'div',
              { ref: function ref(el) {
                  return _this4.RefreshControlRef = el;
                }, className: wrapCls },
              React.createElement(
                'div',
                { className: preCls + '-refresh-control-indicator-icon-wrapper' },
                icon
              ),
              React.createElement(
                'div',
                { className: preCls + '-refresh-control-indicator-loading-wrapper' },
                loading
              )
            ),
            children
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

ScrollView.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  listPrefixCls: PropTypes.string,
  listViewPrefixCls: PropTypes.string,
  style: PropTypes.object,
  contentContainerStyle: PropTypes.object,
  onScroll: PropTypes.func,
  refreshControl: PropTypes.bool,
  icon: PropTypes.any,
  loading: PropTypes.any,
  distanceToRefresh: PropTypes.number,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func
};
ScrollView.defaultProps = {
  prefixCls: 'zscroller',
  distanceToRefresh: 25,
  refreshing: false,
  icon: [React.createElement(
    'div',
    { key: '0', className: 'zscroller-refresh-control-pull' },
    '\u2193 \u4E0B\u62C9'
  ), React.createElement(
    'div',
    { key: '1', className: 'zscroller-refresh-control-release' },
    '\u2191 \u91CA\u653E'
  )],
  loading: React.createElement(
    'div',
    null,
    'loading...'
  )
};

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.state = {
    active: false,
    deactive: false,
    loadingState: false
  };

  this.getMetrics = function () {
    var isVertical = !_this5.props.horizontal;
    return {
      visibleLength: _this5.domScroller.container[isVertical ? 'clientHeight' : 'clientWidth'],
      contentLength: _this5.domScroller.content[isVertical ? 'offsetHeight' : 'offsetWidth'],
      offset: _this5.domScroller.scroller.getValues()[isVertical ? 'top' : 'left']
    };
  };

  this.getInnerViewNode = function () {
    return _this5.InnerScrollViewRef;
  };

  this.scrollTo = function () {
    var _domScroller$scroller;

    // it will change zScroller's dimensions on data loaded, so it needs fire reflow.
    _this5.domScroller.reflow();
    (_domScroller$scroller = _this5.domScroller.scroller).scrollTo.apply(_domScroller$scroller, arguments);
  };
};

export default ScrollView;