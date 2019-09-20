import _createClass from 'babel-runtime/helpers/createClass';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import { DefaultTabBar as RMCDefaultTabBar, Tabs as RMCTabs } from 'rmc-tabs';
export var DefaultTabBar = function (_RMCDefaultTabBar) {
    _inherits(DefaultTabBar, _RMCDefaultTabBar);

    function DefaultTabBar() {
        _classCallCheck(this, DefaultTabBar);

        return _possibleConstructorReturn(this, (DefaultTabBar.__proto__ || Object.getPrototypeOf(DefaultTabBar)).apply(this, arguments));
    }

    return DefaultTabBar;
}(RMCDefaultTabBar);
DefaultTabBar.defaultProps = _extends({}, RMCDefaultTabBar.defaultProps, { prefixCls: 'am-tabs-default-bar' });

var Tabs = function (_React$PureComponent) {
    _inherits(Tabs, _React$PureComponent);

    function Tabs() {
        _classCallCheck(this, Tabs);

        var _this2 = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).apply(this, arguments));

        _this2.renderTabBar = function (props) {
            var renderTab = _this2.props.renderTab;

            return React.createElement(DefaultTabBar, _extends({}, props, { renderTab: renderTab }));
        };
        return _this2;
    }

    _createClass(Tabs, [{
        key: 'render',
        value: function render() {
            return React.createElement(RMCTabs, _extends({ renderTabBar: this.renderTabBar }, this.props));
        }
    }]);

    return Tabs;
}(React.PureComponent);

export default Tabs;

Tabs.DefaultTabBar = DefaultTabBar;
Tabs.defaultProps = {
    prefixCls: 'am-tabs'
};