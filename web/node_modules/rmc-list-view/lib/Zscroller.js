'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _zscroller = require('zscroller');

var _zscroller2 = _interopRequireDefault(_zscroller);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint react/prop-types: 0, react/sort-comp: 0, no-unused-expressions: 0 */

var ScrollView = function (_React$Component) {
  (0, _inherits3['default'])(ScrollView, _React$Component);

  function ScrollView() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, ScrollView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = ScrollView.__proto__ || Object.getPrototypeOf(ScrollView)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(ScrollView, [{
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
        handleScroll = (0, _util.throttle)(handleScroll, this.props.scrollEventThrottle);
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
          restProps = (0, _objectWithoutProperties3['default'])(scrollerOptions, ['scrollingComplete']);

      this.domScroller = new _zscroller2['default'](this.getInnerViewNode(), (0, _extends3['default'])({
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
        style: (0, _extends3['default'])({ position: 'relative', overflow: 'hidden' }, style),
        className: (0, _classnames2['default'])(className, preCls + '-scrollview')
      };
      var contentContainerProps = {
        ref: function ref(el) {
          return _this4.InnerScrollViewRef = el;
        },
        style: (0, _extends3['default'])({ position: 'absolute', minWidth: '100%' }, contentContainerStyle),
        className: (0, _classnames2['default'])(preCls + '-scrollview-content', listPrefixCls)
      };

      var _state = this.state,
          active = _state.active,
          deactive = _state.deactive,
          loadingState = _state.loadingState;

      var wrapCls = (0, _classnames2['default'])(preCls + '-refresh-control-indicator', (_classNames = {}, (0, _defineProperty3['default'])(_classNames, preCls + '-refresh-control-active', active), (0, _defineProperty3['default'])(_classNames, preCls + '-refresh-control-deactive', deactive), (0, _defineProperty3['default'])(_classNames, preCls + '-refresh-control-loading', loadingState || refreshing), _classNames));

      if (refreshControl) {
        return _react2['default'].createElement(
          'div',
          containerProps,
          _react2['default'].createElement(
            'div',
            contentContainerProps,
            _react2['default'].createElement(
              'div',
              { ref: function ref(el) {
                  return _this4.RefreshControlRef = el;
                }, className: wrapCls },
              _react2['default'].createElement(
                'div',
                { className: preCls + '-refresh-control-indicator-icon-wrapper' },
                icon
              ),
              _react2['default'].createElement(
                'div',
                { className: preCls + '-refresh-control-indicator-loading-wrapper' },
                loading
              )
            ),
            children
          )
        );
      }

      return _react2['default'].createElement(
        'div',
        containerProps,
        _react2['default'].createElement(
          'div',
          contentContainerProps,
          children
        )
      );
    }
  }]);
  return ScrollView;
}(_react2['default'].Component);

ScrollView.propTypes = {
  children: _propTypes2['default'].any,
  className: _propTypes2['default'].string,
  prefixCls: _propTypes2['default'].string,
  listPrefixCls: _propTypes2['default'].string,
  listViewPrefixCls: _propTypes2['default'].string,
  style: _propTypes2['default'].object,
  contentContainerStyle: _propTypes2['default'].object,
  onScroll: _propTypes2['default'].func,
  refreshControl: _propTypes2['default'].bool,
  icon: _propTypes2['default'].any,
  loading: _propTypes2['default'].any,
  distanceToRefresh: _propTypes2['default'].number,
  refreshing: _propTypes2['default'].bool,
  onRefresh: _propTypes2['default'].func
};
ScrollView.defaultProps = {
  prefixCls: 'zscroller',
  distanceToRefresh: 25,
  refreshing: false,
  icon: [_react2['default'].createElement(
    'div',
    { key: '0', className: 'zscroller-refresh-control-pull' },
    '\u2193 \u4E0B\u62C9'
  ), _react2['default'].createElement(
    'div',
    { key: '1', className: 'zscroller-refresh-control-release' },
    '\u2191 \u91CA\u653E'
  )],
  loading: _react2['default'].createElement(
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

exports['default'] = ScrollView;
module.exports = exports['default'];