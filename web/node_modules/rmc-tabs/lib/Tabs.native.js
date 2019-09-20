'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tabs = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _Tabs = require('./Tabs.base');

var _DefaultTabBar = require('./DefaultTabBar');

var _Styles = require('./Styles.native');

var _Styles2 = _interopRequireDefault(_Styles);

var _TabPane = require('./TabPane.native');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Tabs = exports.Tabs = function (_Component) {
    (0, _inherits3['default'])(Tabs, _Component);

    function Tabs(props) {
        (0, _classCallCheck3['default'])(this, Tabs);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, props));

        _this.AnimatedScrollView = _reactNative.Animated.createAnimatedComponent(_reactNative.ScrollView);
        _this.onScroll = function (evt) {
            if (evt) {
                _reactNative.Animated.event([{
                    nativeEvent: { contentOffset: { x: _this.state.scrollX } }
                }])(evt);
            }
        };
        _this.setScrollView = function (sv) {
            _this.scrollView = sv;
            _this.scrollTo(_this.state.currentTab);
        };
        _this.renderContent = function () {
            var getSubElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.getSubElements();
            var _this$props = _this.props,
                tabs = _this$props.tabs,
                usePaged = _this$props.usePaged,
                destroyInactiveTab = _this$props.destroyInactiveTab,
                keyboardShouldPersistTaps = _this$props.keyboardShouldPersistTaps;
            var _this$state = _this.state,
                _this$state$currentTa = _this$state.currentTab,
                currentTab = _this$state$currentTa === undefined ? 0 : _this$state$currentTa,
                _this$state$container = _this$state.containerWidth,
                containerWidth = _this$state$container === undefined ? 0 : _this$state$container;

            var AnimatedScrollView = _this.AnimatedScrollView;
            return _react2['default'].createElement(
                AnimatedScrollView,
                { key: '$content', horizontal: true, pagingEnabled: usePaged, automaticallyAdjustContentInsets: false, ref: _this.setScrollView, onScroll: _this.onScroll, onMomentumScrollEnd: _this.onMomentumScrollEnd, scrollEventThrottle: 16, scrollsToTop: false, showsHorizontalScrollIndicator: false, scrollEnabled: _this.props.swipeable, directionalLockEnabled: true, alwaysBounceVertical: false, keyboardDismissMode: 'on-drag', keyboardShouldPersistTaps: keyboardShouldPersistTaps },
                tabs.map(function (tab, index) {
                    var key = tab.key || 'tab_' + index;
                    // update tab cache
                    if (_this.shouldRenderTab(index)) {
                        _this.tabCache[index] = _this.getSubElement(tab, index, getSubElements);
                    } else if (destroyInactiveTab) {
                        _this.tabCache[index] = undefined;
                    }
                    return _react2['default'].createElement(
                        _TabPane.TabPane,
                        { key: key, active: currentTab === index, style: { width: containerWidth } },
                        _this.tabCache[index]
                    );
                })
            );
        };
        _this.onMomentumScrollEnd = function (e) {
            var offsetX = e.nativeEvent.contentOffset.x;
            var page = _this.getOffsetIndex(offsetX, _this.state.containerWidth);
            if (_this.state.currentTab !== page) {
                _this.goToTab(page);
            }
        };
        _this.handleLayout = function (e) {
            var width = e.nativeEvent.layout.width;

            requestAnimationFrame(function () {
                _this.scrollTo(_this.state.currentTab, false);
            });
            if (Math.round(width) !== Math.round(_this.state.containerWidth)) {
                _this.setState({ containerWidth: width });
            }
        };
        _this.scrollTo = function (index) {
            var animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var containerWidth = _this.state.containerWidth;

            if (containerWidth) {
                var offset = index * containerWidth;
                if (_this.scrollView && _this.scrollView._component) {
                    var scrollTo = _this.scrollView._component.scrollTo;

                    scrollTo && scrollTo({ x: offset, animated: animated });
                }
            }
        };
        var width = _reactNative.Dimensions.get('window').width;
        var pageIndex = _this.getTabIndex(props);
        _this.state = (0, _extends3['default'])({}, _this.state, { scrollX: new _reactNative.Animated.Value(pageIndex * width), scrollValue: new _reactNative.Animated.Value(pageIndex), containerWidth: width });
        return _this;
    }

    (0, _createClass3['default'])(Tabs, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.state.scrollX.addListener(function (_ref) {
                var value = _ref.value;

                var scrollValue = value / _this2.state.containerWidth;
                _this2.state.scrollValue.setValue(scrollValue);
            });
        }
    }, {
        key: 'goToTab',
        value: function goToTab(index) {
            var _this3 = this;

            var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var animated = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props.animated;

            var result = (0, _get3['default'])(Tabs.prototype.__proto__ || Object.getPrototypeOf(Tabs.prototype), 'goToTab', this).call(this, index, force);
            if (result) {
                requestAnimationFrame(function () {
                    _this3.scrollTo(_this3.state.currentTab, animated);
                });
            }
            return result;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                tabBarPosition = _props.tabBarPosition,
                _props$styles = _props.styles,
                styles = _props$styles === undefined ? _Styles2['default'] : _props$styles,
                noRenderContent = _props.noRenderContent,
                keyboardShouldPersistTaps = _props.keyboardShouldPersistTaps;
            var _state = this.state,
                scrollX = _state.scrollX,
                scrollValue = _state.scrollValue,
                containerWidth = _state.containerWidth;
            // let overlayTabs = (this.props.tabBarPosition === 'overlayTop' || this.props.tabBarPosition === 'overlayBottom');

            var overlayTabs = false;
            var tabBarProps = (0, _extends3['default'])({}, this.getTabBarBaseProps(), { keyboardShouldPersistTaps: keyboardShouldPersistTaps, scrollX: scrollX, scrollValue: scrollValue, containerWidth: containerWidth });
            if (overlayTabs) {
                // tabBarProps.style = {
                //     position: 'absolute',
                //     left: 0,
                //     right: 0,
                //     [this.props.tabBarPosition === 'overlayTop' ? 'top' : 'bottom']: 0,
                // };
            }
            var content = [_react2['default'].createElement(
                _reactNative.View,
                { key: '$tabbar', style: tabBarPosition === 'top' ? styles.Tabs.topTabBarSplitLine : styles.Tabs.bottomTabBarSplitLine },
                this.renderTabBar(tabBarProps, _DefaultTabBar.DefaultTabBar)
            ), !noRenderContent && this.renderContent()];
            return _react2['default'].createElement(
                _reactNative.View,
                { style: (0, _extends3['default'])({}, styles.Tabs.container, this.props.style), onLayout: this.handleLayout },
                tabBarPosition === 'top' ? content : content.reverse()
            );
        }
    }]);
    return Tabs;
}(_Tabs.Tabs);

Tabs.DefaultTabBar = _DefaultTabBar.DefaultTabBar;
Tabs.defaultProps = (0, _extends3['default'])({}, _Tabs.Tabs.defaultProps, { style: {} });