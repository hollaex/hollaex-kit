import _extends from 'babel-runtime/helpers/extends';
import _createClass from 'babel-runtime/helpers/createClass';
import _get from 'babel-runtime/helpers/get';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import Gesture from 'rc-gesture';
import { TabPane } from './TabPane';
import { DefaultTabBar } from './DefaultTabBar';
import { getTransformPropValue, setTransform, setPxStyle } from './util';
import { Tabs as Component, StateType as BaseStateType } from './Tabs.base';
var getPanDirection = function getPanDirection(direction) {
    switch (direction) {
        case 2:
        case 4:
            return 'horizontal';
        case 8:
        case 16:
            return 'vertical';
        default:
            return 'none';
    }
};
export var StateType = function (_BaseStateType) {
    _inherits(StateType, _BaseStateType);

    function StateType() {
        _classCallCheck(this, StateType);

        var _this = _possibleConstructorReturn(this, (StateType.__proto__ || Object.getPrototypeOf(StateType)).apply(this, arguments));

        _this.contentPos = '';
        _this.isMoving = false;
        return _this;
    }

    return StateType;
}(BaseStateType);
export var Tabs = function (_Component) {
    _inherits(Tabs, _Component);

    function Tabs(props) {
        _classCallCheck(this, Tabs);

        var _this2 = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, props));

        _this2.onPan = function () {
            var lastOffset = 0;
            var finalOffset = 0;
            var panDirection = void 0;
            var getLastOffset = function getLastOffset() {
                var isVertical = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this2.isTabVertical();

                var offset = +('' + lastOffset).replace('%', '');
                if (('' + lastOffset).indexOf('%') >= 0) {
                    offset /= 100;
                    offset *= isVertical ? _this2.layout.clientHeight : _this2.layout.clientWidth;
                }
                return offset;
            };
            return {
                onPanStart: function onPanStart(status) {
                    if (!_this2.props.swipeable || !_this2.props.animated) return;
                    panDirection = getPanDirection(status.direction);
                    _this2.setState({
                        isMoving: true
                    });
                },
                onPanMove: function onPanMove(status) {
                    var _this2$props = _this2.props,
                        swipeable = _this2$props.swipeable,
                        animated = _this2$props.animated,
                        useLeftInsteadTransform = _this2$props.useLeftInsteadTransform;

                    if (!status.moveStatus || !_this2.layout || !swipeable || !animated) return;
                    var isVertical = _this2.isTabVertical();
                    var offset = getLastOffset();
                    if (isVertical) {
                        offset += panDirection === 'horizontal' ? 0 : status.moveStatus.y;
                    } else {
                        offset += panDirection === 'vertical' ? 0 : status.moveStatus.x;
                    }
                    var canScrollOffset = isVertical ? -_this2.layout.scrollHeight + _this2.layout.clientHeight : -_this2.layout.scrollWidth + _this2.layout.clientWidth;
                    offset = Math.min(offset, 0);
                    offset = Math.max(offset, canScrollOffset);
                    setPxStyle(_this2.layout, offset, 'px', isVertical, useLeftInsteadTransform);
                    finalOffset = offset;
                },
                onPanEnd: function onPanEnd() {
                    if (!_this2.props.swipeable || !_this2.props.animated) return;
                    lastOffset = finalOffset;
                    var isVertical = _this2.isTabVertical();
                    var offsetIndex = _this2.getOffsetIndex(finalOffset, isVertical ? _this2.layout.clientHeight : _this2.layout.clientWidth);
                    _this2.setState({
                        isMoving: false
                    });
                    if (offsetIndex === _this2.state.currentTab) {
                        if (_this2.props.usePaged) {
                            setTransform(_this2.layout.style, _this2.getContentPosByIndex(offsetIndex, _this2.isTabVertical(), _this2.props.useLeftInsteadTransform));
                        }
                    } else {
                        _this2.goToTab(offsetIndex);
                    }
                },
                setCurrentOffset: function setCurrentOffset(offset) {
                    return lastOffset = offset;
                }
            };
        }();
        _this2.onSwipe = function (status) {
            var _this2$props2 = _this2.props,
                tabBarPosition = _this2$props2.tabBarPosition,
                swipeable = _this2$props2.swipeable,
                usePaged = _this2$props2.usePaged;

            if (!swipeable || !usePaged || _this2.isTabVertical()) return;
            // DIRECTION_NONE	1
            // DIRECTION_LEFT	2
            // DIRECTION_RIGHT	4
            // DIRECTION_UP	8
            // DIRECTION_DOWN	16
            // DIRECTION_HORIZONTAL	6
            // DIRECTION_VERTICAL	24
            // DIRECTION_ALL	30
            switch (tabBarPosition) {
                case 'top':
                case 'bottom':
                    switch (status.direction) {
                        case 2:
                            if (!_this2.isTabVertical()) {
                                _this2.goToTab(_this2.prevCurrentTab + 1);
                            }
                        case 8:
                            if (_this2.isTabVertical()) {
                                _this2.goToTab(_this2.prevCurrentTab + 1);
                            }
                            break;
                        case 4:
                            if (!_this2.isTabVertical()) {
                                _this2.goToTab(_this2.prevCurrentTab - 1);
                            }
                        case 16:
                            if (_this2.isTabVertical()) {
                                _this2.goToTab(_this2.prevCurrentTab - 1);
                            }
                            break;
                    }
                    break;
            }
        };
        _this2.setContentLayout = function (div) {
            _this2.layout = div;
        };
        _this2.state = _extends({}, _this2.state, new StateType(), { contentPos: _this2.getContentPosByIndex(_this2.getTabIndex(props), _this2.isTabVertical(props.tabDirection), props.useLeftInsteadTransform) });
        return _this2;
    }

    _createClass(Tabs, [{
        key: 'goToTab',
        value: function goToTab(index) {
            var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var usePaged = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props.usePaged;
            var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.props;
            var tabDirection = props.tabDirection,
                useLeftInsteadTransform = props.useLeftInsteadTransform;

            var newState = {};
            if (usePaged) {
                newState = {
                    contentPos: this.getContentPosByIndex(index, this.isTabVertical(tabDirection), useLeftInsteadTransform)
                };
            }
            return _get(Tabs.prototype.__proto__ || Object.getPrototypeOf(Tabs.prototype), 'goToTab', this).call(this, index, force, newState, props);
        }
    }, {
        key: 'tabClickGoToTab',
        value: function tabClickGoToTab(index) {
            this.goToTab(index, false, true);
        }
    }, {
        key: 'getContentPosByIndex',
        value: function getContentPosByIndex(index, isVertical) {
            var useLeft = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var value = -index * 100 + '%';
            this.onPan.setCurrentOffset(value);
            if (useLeft) {
                return '' + value;
            } else {
                var translate = isVertical ? '0px, ' + value : value + ', 0px';
                // fix: content overlay TabBar on iOS 10. ( 0px -> 1px )
                return 'translate3d(' + translate + ', 1px)';
            }
        }
    }, {
        key: 'renderContent',
        value: function renderContent() {
            var _this3 = this;

            var getSubElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getSubElements();
            var _props = this.props,
                prefixCls = _props.prefixCls,
                tabs = _props.tabs,
                animated = _props.animated,
                destroyInactiveTab = _props.destroyInactiveTab,
                useLeftInsteadTransform = _props.useLeftInsteadTransform;
            var _state = this.state,
                currentTab = _state.currentTab,
                isMoving = _state.isMoving,
                contentPos = _state.contentPos;

            var isTabVertical = this.isTabVertical();
            var contentCls = prefixCls + '-content-wrap';
            if (animated && !isMoving) {
                contentCls += ' ' + contentCls + '-animated';
            }
            var contentStyle = animated ? useLeftInsteadTransform ? _extends({ position: 'relative' }, this.isTabVertical() ? { top: contentPos } : { left: contentPos }) : getTransformPropValue(contentPos) : _extends({ position: 'relative' }, this.isTabVertical() ? { top: -currentTab * 100 + '%' } : { left: -currentTab * 100 + '%' });

            var _getTabBarBaseProps = this.getTabBarBaseProps(),
                instanceId = _getTabBarBaseProps.instanceId;

            return React.createElement(
                'div',
                { className: contentCls, style: contentStyle, ref: this.setContentLayout },
                tabs.map(function (tab, index) {
                    var cls = prefixCls + '-pane-wrap';
                    if (_this3.state.currentTab === index) {
                        cls += ' ' + cls + '-active';
                    } else {
                        cls += ' ' + cls + '-inactive';
                    }
                    var key = tab.key || 'tab_' + index;
                    // update tab cache
                    if (_this3.shouldRenderTab(index)) {
                        _this3.tabCache[index] = _this3.getSubElement(tab, index, getSubElements);
                    } else if (destroyInactiveTab) {
                        _this3.tabCache[index] = undefined;
                    }
                    return React.createElement(
                        TabPane,
                        { key: key, className: cls, active: currentTab === index, role: 'tabpanel', 'aria-hidden': currentTab !== index, 'aria-labelledby': 'm-tabs-' + instanceId + '-' + index, fixX: isTabVertical, fixY: !isTabVertical },
                        _this3.tabCache[index]
                    );
                })
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                prefixCls = _props2.prefixCls,
                tabBarPosition = _props2.tabBarPosition,
                tabDirection = _props2.tabDirection,
                useOnPan = _props2.useOnPan,
                noRenderContent = _props2.noRenderContent;

            var isTabVertical = this.isTabVertical(tabDirection);
            var tabBarProps = _extends({}, this.getTabBarBaseProps());
            var onPan = !isTabVertical && useOnPan ? this.onPan : {};
            var content = [React.createElement(
                'div',
                { key: 'tabBar', className: prefixCls + '-tab-bar-wrap' },
                this.renderTabBar(tabBarProps, DefaultTabBar)
            ), !noRenderContent && React.createElement(
                Gesture,
                _extends({ key: '$content', onSwipe: this.onSwipe }, onPan),
                this.renderContent()
            )];
            return React.createElement(
                'div',
                { className: prefixCls + ' ' + prefixCls + '-' + tabDirection + ' ' + prefixCls + '-' + tabBarPosition },
                tabBarPosition === 'top' || tabBarPosition === 'left' ? content : content.reverse()
            );
        }
    }]);

    return Tabs;
}(Component);
Tabs.DefaultTabBar = DefaultTabBar;
Tabs.defaultProps = _extends({}, Component.defaultProps, { prefixCls: 'rmc-tabs', useOnPan: true });