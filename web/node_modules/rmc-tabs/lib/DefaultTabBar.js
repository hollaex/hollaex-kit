'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultTabBar = exports.StateType = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcGesture = require('rc-gesture');

var _rcGesture2 = _interopRequireDefault(_rcGesture);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var StateType = exports.StateType = function StateType() {
    (0, _classCallCheck3['default'])(this, StateType);

    this.transform = '';
    this.isMoving = false;
    this.showPrev = false;
    this.showNext = false;
};

var DefaultTabBar = exports.DefaultTabBar = function (_React$PureComponent) {
    (0, _inherits3['default'])(DefaultTabBar, _React$PureComponent);

    function DefaultTabBar(props) {
        (0, _classCallCheck3['default'])(this, DefaultTabBar);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (DefaultTabBar.__proto__ || Object.getPrototypeOf(DefaultTabBar)).call(this, props));

        _this.onPan = function () {
            var lastOffset = 0;
            var finalOffset = 0;
            var getLastOffset = function getLastOffset() {
                var isVertical = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.isTabBarVertical();

                var offset = +('' + lastOffset).replace('%', '');
                if (('' + lastOffset).indexOf('%') >= 0) {
                    offset /= 100;
                    offset *= isVertical ? _this.layout.clientHeight : _this.layout.clientWidth;
                }
                return offset;
            };
            return {
                onPanStart: function onPanStart() {
                    _this.setState({ isMoving: true });
                },
                onPanMove: function onPanMove(status) {
                    if (!status.moveStatus || !_this.layout) return;
                    var isVertical = _this.isTabBarVertical();
                    var offset = getLastOffset() + (isVertical ? status.moveStatus.y : status.moveStatus.x);
                    var canScrollOffset = isVertical ? -_this.layout.scrollHeight + _this.layout.clientHeight : -_this.layout.scrollWidth + _this.layout.clientWidth;
                    offset = Math.min(offset, 0);
                    offset = Math.max(offset, canScrollOffset);
                    (0, _util.setPxStyle)(_this.layout, offset, 'px', isVertical);
                    finalOffset = offset;
                    _this.setState({
                        showPrev: -offset > 0,
                        showNext: offset > canScrollOffset
                    });
                },
                onPanEnd: function onPanEnd() {
                    var isVertical = _this.isTabBarVertical();
                    lastOffset = finalOffset;
                    _this.setState({
                        isMoving: false,
                        transform: (0, _util.getPxStyle)(finalOffset, 'px', isVertical)
                    });
                },
                setCurrentOffset: function setCurrentOffset(offset) {
                    return lastOffset = offset;
                }
            };
        }();
        _this.getTransformByIndex = function (props) {
            var activeTab = props.activeTab,
                tabs = props.tabs,
                _props$page = props.page,
                page = _props$page === undefined ? 0 : _props$page;

            var isVertical = _this.isTabBarVertical();
            var size = _this.getTabSize(page, tabs.length);
            var center = page / 2;
            var pos = Math.min(activeTab, tabs.length - center - .5);
            var skipSize = Math.min(-(pos - center + .5) * size, 0);
            _this.onPan.setCurrentOffset(skipSize + '%');
            return {
                transform: (0, _util.getPxStyle)(skipSize, '%', isVertical),
                showPrev: activeTab > center - .5 && tabs.length > page,
                showNext: activeTab < tabs.length - center - .5 && tabs.length > page
            };
        };
        _this.onPress = function (index) {
            var _this$props = _this.props,
                goToTab = _this$props.goToTab,
                onTabClick = _this$props.onTabClick,
                tabs = _this$props.tabs;

            onTabClick && onTabClick(tabs[index], index);
            goToTab && goToTab(index);
        };
        _this.isTabBarVertical = function () {
            var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props.tabBarPosition;
            return position === 'left' || position === 'right';
        };
        _this.renderTab = function (t, i, size, isTabBarVertical) {
            var _this$props2 = _this.props,
                prefixCls = _this$props2.prefixCls,
                renderTab = _this$props2.renderTab,
                activeTab = _this$props2.activeTab,
                tabBarTextStyle = _this$props2.tabBarTextStyle,
                tabBarActiveTextColor = _this$props2.tabBarActiveTextColor,
                tabBarInactiveTextColor = _this$props2.tabBarInactiveTextColor,
                instanceId = _this$props2.instanceId;

            var textStyle = (0, _extends3['default'])({}, tabBarTextStyle);
            var cls = prefixCls + '-tab';
            var ariaSelected = false;
            if (activeTab === i) {
                cls += ' ' + cls + '-active';
                ariaSelected = true;
                if (tabBarActiveTextColor) {
                    textStyle.color = tabBarActiveTextColor;
                }
            } else if (tabBarInactiveTextColor) {
                textStyle.color = tabBarInactiveTextColor;
            }
            return _react2['default'].createElement(
                'div',
                { key: 't_' + i, style: (0, _extends3['default'])({}, textStyle, isTabBarVertical ? { height: size + '%' } : { width: size + '%' }), id: 'm-tabs-' + instanceId + '-' + i, role: 'tab', 'aria-selected': ariaSelected, className: cls, onClick: function onClick() {
                        return _this.onPress(i);
                    } },
                renderTab ? renderTab(t) : t.title
            );
        };
        _this.setContentLayout = function (div) {
            _this.layout = div;
        };
        _this.getTabSize = function (page, tabLength) {
            return 100 / Math.min(page, tabLength);
        };
        _this.state = (0, _extends3['default'])({}, new StateType(), _this.getTransformByIndex(props));
        return _this;
    }

    (0, _createClass3['default'])(DefaultTabBar, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.activeTab !== nextProps.activeTab || this.props.tabs !== nextProps.tabs || this.props.tabs.length !== nextProps.tabs.length) {
                this.setState((0, _extends3['default'])({}, this.getTransformByIndex(nextProps)));
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                animated = _props.animated,
                _props$tabs = _props.tabs,
                tabs = _props$tabs === undefined ? [] : _props$tabs,
                _props$page2 = _props.page,
                page = _props$page2 === undefined ? 0 : _props$page2,
                _props$activeTab = _props.activeTab,
                activeTab = _props$activeTab === undefined ? 0 : _props$activeTab,
                tabBarBackgroundColor = _props.tabBarBackgroundColor,
                tabBarUnderlineStyle = _props.tabBarUnderlineStyle,
                tabBarPosition = _props.tabBarPosition,
                renderUnderline = _props.renderUnderline;
            var _state = this.state,
                isMoving = _state.isMoving,
                transform = _state.transform,
                showNext = _state.showNext,
                showPrev = _state.showPrev;

            var isTabBarVertical = this.isTabBarVertical();
            var needScroll = tabs.length > page;
            var size = this.getTabSize(page, tabs.length);
            var Tabs = tabs.map(function (t, i) {
                return _this2.renderTab(t, i, size, isTabBarVertical);
            });
            var cls = prefixCls;
            if (animated && !isMoving) {
                cls += ' ' + prefixCls + '-animated';
            }
            var style = {
                backgroundColor: tabBarBackgroundColor || ''
            };
            var transformStyle = needScroll ? (0, _extends3['default'])({}, (0, _util.getTransformPropValue)(transform)) : {};
            var _a = this.onPan,
                setCurrentOffset = _a.setCurrentOffset,
                onPan = __rest(_a, ["setCurrentOffset"]);
            var underlineProps = {
                style: (0, _extends3['default'])({}, isTabBarVertical ? { height: size + '%' } : { width: size + '%' }, isTabBarVertical ? { top: size * activeTab + '%' } : { left: size * activeTab + '%' }, tabBarUnderlineStyle),
                className: prefixCls + '-underline'
            };
            return _react2['default'].createElement(
                'div',
                { className: cls + ' ' + prefixCls + '-' + tabBarPosition, style: style },
                showPrev && _react2['default'].createElement('div', { className: prefixCls + '-prevpage' }),
                _react2['default'].createElement(
                    _rcGesture2['default'],
                    (0, _extends3['default'])({}, onPan, { direction: isTabBarVertical ? 'vertical' : 'horizontal' }),
                    _react2['default'].createElement(
                        'div',
                        { role: 'tablist', className: prefixCls + '-content', style: transformStyle, ref: this.setContentLayout },
                        Tabs,
                        renderUnderline ? renderUnderline(underlineProps) : _react2['default'].createElement('div', underlineProps)
                    )
                ),
                showNext && _react2['default'].createElement('div', { className: prefixCls + '-nextpage' })
            );
        }
    }]);
    return DefaultTabBar;
}(_react2['default'].PureComponent);

DefaultTabBar.defaultProps = {
    prefixCls: 'rmc-tabs-tab-bar',
    animated: true,
    tabs: [],
    goToTab: function goToTab() {},
    activeTab: 0,
    page: 5,
    tabBarUnderlineStyle: {},
    tabBarBackgroundColor: '#fff',
    tabBarActiveTextColor: '',
    tabBarInactiveTextColor: '',
    tabBarTextStyle: {}
};