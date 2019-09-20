'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultTabBar = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _reactNative = require('react-native');

var _Styles = require('./Styles.native');

var _Styles2 = _interopRequireDefault(_Styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var WINDOW_WIDTH = _reactNative.Dimensions.get('window').width;

var DefaultTabBar = exports.DefaultTabBar = function (_React$PureComponent) {
    (0, _inherits3['default'])(DefaultTabBar, _React$PureComponent);

    function DefaultTabBar(props) {
        (0, _classCallCheck3['default'])(this, DefaultTabBar);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (DefaultTabBar.__proto__ || Object.getPrototypeOf(DefaultTabBar)).call(this, props));

        _this._tabsMeasurements = [];
        _this.updateView = function (offset) {
            var position = Math.floor(offset.value);
            var pageOffset = offset.value % 1;
            var tabCount = _this.props.tabs.length;
            var lastTabPosition = tabCount - 1;
            if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
                return;
            }
            if (_this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
                _this.updateTabPanel(position, pageOffset);
                _this.updateTabUnderline(position, pageOffset, tabCount);
            }
        };
        _this.onPress = function (index) {
            var _this$props = _this.props,
                goToTab = _this$props.goToTab,
                onTabClick = _this$props.onTabClick,
                tabs = _this$props.tabs;

            onTabClick && onTabClick(tabs[index], index);
            goToTab && goToTab(index);
        };
        _this.measureTab = function (page, event) {
            var _event$nativeEvent$la = event.nativeEvent.layout,
                x = _event$nativeEvent$la.x,
                width = _event$nativeEvent$la.width,
                height = _event$nativeEvent$la.height;

            _this._tabsMeasurements[page] = { left: x, right: x + width, width: width, height: height };
            _this.updateView({ value: _this.props.scrollValue._value });
        };
        _this.onTabContainerLayout = function (e) {
            _this._tabContainerMeasurements = e.nativeEvent.layout;
            var width = _this._tabContainerMeasurements.width;
            if (width < WINDOW_WIDTH) {
                width = WINDOW_WIDTH;
            }
            _this.setState({ _tabContainerWidth: width });
            if (!_this.props.dynamicTabUnderlineWidth) {
                _this.state._widthTabUnderline.setValue(width / _this.props.tabs.length);
            }
            _this.updateView({ value: _this.props.scrollValue._value });
        };
        _this.onContainerLayout = function (e) {
            _this._containerMeasurements = e.nativeEvent.layout;
            _this.setState({ _containerWidth: _this._containerMeasurements.width });
            _this.updateView({ value: _this.props.scrollValue._value });
        };
        _this.state = {
            _leftTabUnderline: new _reactNative.Animated.Value(0),
            _widthTabUnderline: new _reactNative.Animated.Value(0),
            _containerWidth: WINDOW_WIDTH,
            _tabContainerWidth: WINDOW_WIDTH
        };
        return _this;
    }

    (0, _createClass3['default'])(DefaultTabBar, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.scrollValue.addListener(this.updateView);
        }
    }, {
        key: 'necessarilyMeasurementsCompleted',
        value: function necessarilyMeasurementsCompleted(position, isLastTab) {
            return this._tabsMeasurements[position] && (isLastTab || this._tabsMeasurements[position + 1]) && this._tabContainerMeasurements && this._containerMeasurements;
        }
    }, {
        key: 'updateTabPanel',
        value: function updateTabPanel(position, pageOffset) {
            var containerWidth = this._containerMeasurements.width;
            var tabWidth = this._tabsMeasurements[position].width;
            var nextTabMeasurements = this._tabsMeasurements[position + 1];
            var nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
            var tabOffset = this._tabsMeasurements[position].left;
            var absolutePageOffset = pageOffset * tabWidth;
            var newScrollX = tabOffset + absolutePageOffset;
            newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
            newScrollX = newScrollX >= 0 ? newScrollX : 0;
            if (_reactNative.Platform.OS === 'android') {
                this._scrollView.scrollTo({ x: newScrollX, y: 0, animated: false });
            } else {
                var rightBoundScroll = this._tabContainerMeasurements.width - this._containerMeasurements.width;
                newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
                this._scrollView.scrollTo({ x: newScrollX, y: 0, animated: false });
            }
        }
    }, {
        key: 'updateTabUnderline',
        value: function updateTabUnderline(position, pageOffset, tabCount) {
            var dynamicTabUnderlineWidth = this.props.dynamicTabUnderlineWidth;

            if (0 <= position && position <= tabCount - 1) {
                if (dynamicTabUnderlineWidth) {
                    var nowLeft = this._tabsMeasurements[position].left;
                    var nowRight = this._tabsMeasurements[position].right;
                    var nextTabLeft = this._tabsMeasurements[position + 1].left;
                    var nextTabRight = this._tabsMeasurements[position + 1].right;
                    var newLineLeft = pageOffset * nextTabLeft + (1 - pageOffset) * nowLeft;
                    var newLineRight = pageOffset * nextTabRight + (1 - pageOffset) * nowRight;
                    this.state._leftTabUnderline.setValue(newLineLeft);
                    this.state._widthTabUnderline.setValue(newLineRight - newLineLeft);
                } else {
                    var _nowLeft = position * this.state._tabContainerWidth / tabCount;
                    var _nextTabLeft = (position + 1) * this.state._tabContainerWidth / tabCount;
                    var _newLineLeft = pageOffset * _nextTabLeft + (1 - pageOffset) * _nowLeft;
                    this.state._leftTabUnderline.setValue(_newLineLeft);
                }
            }
        }
    }, {
        key: 'renderTab',
        value: function renderTab(tab, index, width, onLayoutHandler) {
            var _this2 = this;

            var _props = this.props,
                activeTextColor = _props.tabBarActiveTextColor,
                inactiveTextColor = _props.tabBarInactiveTextColor,
                textStyle = _props.tabBarTextStyle,
                activeTab = _props.activeTab,
                renderTab = _props.renderTab,
                _props$styles = _props.styles,
                styles = _props$styles === undefined ? _Styles2['default'] : _props$styles;

            var isTabActive = activeTab === index;
            var textColor = isTabActive ? activeTextColor || styles.TabBar.activeTextColor : inactiveTextColor || styles.TabBar.inactiveTextColor;
            return _react2['default'].createElement(
                _reactNative.TouchableOpacity,
                { activeOpacity: 1, key: tab.title + '_' + index, accessible: true, accessibilityTraits: 'button', onPress: function onPress() {
                        return _this2.onPress(index);
                    }, onLayout: onLayoutHandler },
                _react2['default'].createElement(
                    _reactNative.View,
                    { style: (0, _extends3['default'])({}, styles.TabBar.tab, this.props.tabStyle, { width: width }) },
                    renderTab ? renderTab(tab) : _react2['default'].createElement(
                        _reactNative.Text,
                        { style: (0, _extends3['default'])({ color: textColor }, styles.TabBar.textStyle, textStyle) },
                        tab.title
                    )
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props2 = this.props,
                tabs = _props2.tabs,
                _props2$page = _props2.page,
                page = _props2$page === undefined ? 1 : _props2$page,
                tabBarUnderlineStyle = _props2.tabBarUnderlineStyle,
                tabBarBackgroundColor = _props2.tabBarBackgroundColor,
                _props2$styles = _props2.styles,
                styles = _props2$styles === undefined ? _Styles2['default'] : _props2$styles,
                tabsContainerStyle = _props2.tabsContainerStyle,
                renderUnderline = _props2.renderUnderline,
                keyboardShouldPersistTaps = _props2.keyboardShouldPersistTaps;

            var tabUnderlineStyle = (0, _extends3['default'])({ position: 'absolute', bottom: 0 }, styles.TabBar.underline, tabBarUnderlineStyle);
            var dynamicTabUnderline = {
                left: this.state._leftTabUnderline,
                width: this.state._widthTabUnderline
            };
            var tabWidth = this.state._containerWidth / Math.min(page, tabs.length);
            var underlineProps = {
                style: (0, _extends3['default'])({}, tabUnderlineStyle, dynamicTabUnderline)
            };
            return _react2['default'].createElement(
                _reactNative.View,
                { style: (0, _extends3['default'])({}, styles.TabBar.container, { backgroundColor: tabBarBackgroundColor }), onLayout: this.onContainerLayout },
                _react2['default'].createElement(
                    _reactNative.ScrollView,
                    { ref: function ref(scrollView) {
                            _this3._scrollView = scrollView;
                        }, horizontal: true, showsHorizontalScrollIndicator: false, showsVerticalScrollIndicator: false, directionalLockEnabled: true, bounces: false, scrollsToTop: false, scrollEnabled: tabs.length > page, keyboardShouldPersistTaps: keyboardShouldPersistTaps },
                    _react2['default'].createElement(
                        _reactNative.View,
                        { style: (0, _extends3['default'])({}, styles.TabBar.tabs, tabsContainerStyle, { backgroundColor: tabBarBackgroundColor }), onLayout: this.onTabContainerLayout },
                        tabs.map(function (name, index) {
                            var tab = { title: name };
                            if (tabs.length - 1 >= index) {
                                tab = tabs[index];
                            }
                            return _this3.renderTab(tab, index, tabWidth, _this3.measureTab.bind(_this3, index));
                        }),
                        renderUnderline ? renderUnderline(underlineProps) : _react2['default'].createElement(_reactNative.Animated.View, underlineProps)
                    )
                )
            );
        }
    }]);
    return DefaultTabBar;
}(_react2['default'].PureComponent);

DefaultTabBar.defaultProps = {
    animated: true,
    tabs: [],
    goToTab: function goToTab() {},
    activeTab: 0,
    page: 5,
    tabBarUnderlineStyle: {},
    tabBarBackgroundColor: '#fff',
    tabBarActiveTextColor: '',
    tabBarInactiveTextColor: '',
    tabBarTextStyle: {},
    dynamicTabUnderlineWidth: false,
    styles: _Styles2['default']
};