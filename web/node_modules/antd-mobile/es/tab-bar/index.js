import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import getDataAttr from '../_util/getDataAttr';
import Tabs from '../tabs';
import Tab from './Tab';
export var Item = function (_React$Component) {
    _inherits(Item, _React$Component);

    function Item() {
        _classCallCheck(this, Item);

        return _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
    }

    _createClass(Item, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                prefixCls = _props.prefixCls,
                style = _props.style;

            return React.createElement(
                'div',
                { className: prefixCls, style: style },
                this.props.children
            );
        }
    }]);

    return Item;
}(React.Component);
Item.defaultProps = {
    prefixCls: 'am-tab-bar-item',
    title: ''
};

var AntTabBar = function (_React$Component2) {
    _inherits(AntTabBar, _React$Component2);

    function AntTabBar() {
        _classCallCheck(this, AntTabBar);

        var _this2 = _possibleConstructorReturn(this, (AntTabBar.__proto__ || Object.getPrototypeOf(AntTabBar)).apply(this, arguments));

        _this2.getTabs = function () {
            return React.Children.map(_this2.props.children, function (c) {
                return _extends({}, c.props);
            });
        };
        _this2.renderTabBar = function () {
            var _this2$props = _this2.props,
                barTintColor = _this2$props.barTintColor,
                prefixCls = _this2$props.prefixCls,
                tintColor = _this2$props.tintColor,
                unselectedTintColor = _this2$props.unselectedTintColor,
                hidden = _this2$props.hidden,
                tabBarPosition = _this2$props.tabBarPosition;

            var tabsData = _this2.getTabs();
            var content = tabsData.map(function (cProps, index) {
                return React.createElement(Tab, { key: index, prefixCls: _this2.props.prefixCls + '-tab', badge: cProps.badge, dot: cProps.dot, selected: cProps.selected, icon: cProps.icon, selectedIcon: cProps.selectedIcon, title: cProps.title, tintColor: tintColor, unselectedTintColor: unselectedTintColor, dataAttrs: getDataAttr(cProps), onClick: function onClick() {
                        return cProps.onPress && cProps.onPress();
                    } });
            });
            var cls = prefixCls + '-bar';
            if (hidden) {
                cls += ' ' + prefixCls + '-bar-hidden-' + tabBarPosition;
            }
            return React.createElement(
                'div',
                { className: cls, style: { backgroundColor: barTintColor } },
                content
            );
        };
        return _this2;
    }

    _createClass(AntTabBar, [{
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                prefixCls = _props2.prefixCls,
                children = _props2.children,
                animated = _props2.animated,
                swipeable = _props2.swipeable,
                noRenderContent = _props2.noRenderContent,
                prerenderingSiblingsNumber = _props2.prerenderingSiblingsNumber,
                tabBarPosition = _props2.tabBarPosition;

            var tabs = this.getTabs();
            var activeIndex = 0;
            tabs.forEach(function (tab, index) {
                if (tab.selected) {
                    activeIndex = index;
                }
            });
            return React.createElement(
                'div',
                { className: prefixCls },
                React.createElement(
                    Tabs,
                    { tabs: tabs, renderTabBar: this.renderTabBar, tabBarPosition: tabBarPosition, page: activeIndex < 0 ? undefined : activeIndex, animated: animated, swipeable: swipeable, noRenderContent: noRenderContent, prerenderingSiblingsNumber: prerenderingSiblingsNumber },
                    children
                )
            );
        }
    }]);

    return AntTabBar;
}(React.Component);

AntTabBar.defaultProps = {
    prefixCls: 'am-tab-bar',
    barTintColor: 'white',
    tintColor: '#108ee9',
    hidden: false,
    unselectedTintColor: '#888',
    placeholder: '正在加载',
    animated: false,
    swipeable: false,
    prerenderingSiblingsNumber: 1,
    tabBarPosition: 'bottom'
};
AntTabBar.Item = Item;
export default AntTabBar;