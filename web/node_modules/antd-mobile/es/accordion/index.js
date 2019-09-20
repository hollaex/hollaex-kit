import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import RcCollapse, { Panel } from 'rc-collapse';
import React from 'react';

var Accordion = function (_React$Component) {
    _inherits(Accordion, _React$Component);

    function Accordion() {
        _classCallCheck(this, Accordion);

        return _possibleConstructorReturn(this, (Accordion.__proto__ || Object.getPrototypeOf(Accordion)).apply(this, arguments));
    }

    _createClass(Accordion, [{
        key: 'render',
        value: function render() {
            return React.createElement(RcCollapse, this.props);
        }
    }]);

    return Accordion;
}(React.Component);

export default Accordion;

Accordion.Panel = Panel;
Accordion.defaultProps = {
    prefixCls: 'am-accordion'
};