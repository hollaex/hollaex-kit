import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import RmcDrawer from 'rmc-drawer';
import React from 'react';

var Drawer = function (_React$Component) {
    _inherits(Drawer, _React$Component);

    function Drawer() {
        _classCallCheck(this, Drawer);

        return _possibleConstructorReturn(this, (Drawer.__proto__ || Object.getPrototypeOf(Drawer)).apply(this, arguments));
    }

    _createClass(Drawer, [{
        key: 'render',
        value: function render() {
            return React.createElement(RmcDrawer, this.props);
        }
    }]);

    return Drawer;
}(React.Component);

export default Drawer;

Drawer.defaultProps = {
    prefixCls: 'am-drawer',
    enableDragHandle: false
};