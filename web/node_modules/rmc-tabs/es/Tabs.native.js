import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import { Dimensions, View, Animated, ScrollView } from 'react-native';
import { Tabs as Component } from './Tabs.base';
import { DefaultTabBar } from './DefaultTabBar';
import Styles from './Styles.native';
import { TabPane } from './TabPane.native';
export var Tabs = function (_Component) {
    _inherits(Tabs, _Component);

    function Tabs(props) {
        _classCallCheck(this, Tabs);

        var _this = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, props));

        _this.AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
        _this.onScroll = function (evt) {
            if (evt) {
                Animated.event([{
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
            return React.createElement(
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
                    return React.createElement(
                        TabPane,
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
        var width = Dimensions.get('window').width;
        var pageIndex = _this.getTabIndex(props);
        _this.state = _extends({}, _this.state, { scrollX: new Animated.Value(pageIndex * width), scrollValue: new Animated.Value(pageIndex), containerWidth: width });
        return _this;
    }

    _createClass(Tabs, [{
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

            var result = _get(Tabs.prototype.__proto__ || Object.getPrototypeOf(Tabs.prototype), 'goToTab', this).call(this, index, force);
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
                styles = _props$styles === undefined ? Styles : _props$styles,
                noRenderContent = _props.noRenderContent,
                keyboardShouldPersistTaps = _props.keyboardShouldPersistTaps;
            var _state = this.state,
                scrollX = _state.scrollX,
                scrollValue = _state.scrollValue,
                containerWidth = _state.containerWidth;
            // let overlayTabs = (this.props.tabBarPosition === 'overlayTop' || this.props.tabBarPosition === 'overlayBottom');

            var overlayTabs = false;
            var tabBarProps = _extends({}, this.getTabBarBaseProps(), { keyboardShouldPersistTaps: keyboardShouldPersistTaps, scrollX: scrollX, scrollValue: scrollValue, containerWidth: containerWidth });
            if (overlayTabs) {
                // tabBarProps.style = {
                //     position: 'absolute',
                //     left: 0,
                //     right: 0,
                //     [this.props.tabBarPosition === 'overlayTop' ? 'top' : 'bottom']: 0,
                // };
            }
            var content = [React.createElement(
                View,
                { key: '$tabbar', style: tabBarPosition === 'top' ? styles.Tabs.topTabBarSplitLine : styles.Tabs.bottomTabBarSplitLine },
                this.renderTabBar(tabBarProps, DefaultTabBar)
            ), !noRenderContent && this.renderContent()];
            return React.createElement(
                View,
                { style: _extends({}, styles.Tabs.container, this.props.style), onLayout: this.handleLayout },
                tabBarPosition === 'top' ? content : content.reverse()
            );
        }
    }]);

    return Tabs;
}(Component);
Tabs.DefaultTabBar = DefaultTabBar;
Tabs.defaultProps = _extends({}, Component.defaultProps, { style: {} });