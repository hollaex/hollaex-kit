import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import RcSlider from 'rc-slider/es/Slider';
import React from 'react';

var Slider = function (_React$Component) {
    _inherits(Slider, _React$Component);

    function Slider() {
        _classCallCheck(this, Slider);

        return _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).apply(this, arguments));
    }

    _createClass(Slider, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: this.props.prefixCls + '-wrapper' },
                React.createElement(RcSlider, this.props)
            );
        }
    }]);

    return Slider;
}(React.Component);

export default Slider;

Slider.defaultProps = {
    prefixCls: 'am-slider'
};