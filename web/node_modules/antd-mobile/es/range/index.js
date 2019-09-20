import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import RcRange from 'rc-slider/es/Range';
import React from 'react';

var Range = function (_React$Component) {
    _inherits(Range, _React$Component);

    function Range() {
        _classCallCheck(this, Range);

        return _possibleConstructorReturn(this, (Range.__proto__ || Object.getPrototypeOf(Range)).apply(this, arguments));
    }

    _createClass(Range, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: this.props.prefixCls + '-wrapper' },
                React.createElement(RcRange, this.props)
            );
        }
    }]);

    return Range;
}(React.Component);

export default Range;

Range.defaultProps = {
    prefixCls: 'am-slider'
};