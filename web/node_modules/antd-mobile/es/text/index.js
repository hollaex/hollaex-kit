import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import View from '../view';

var Text = function (_React$Component) {
    _inherits(Text, _React$Component);

    function Text() {
        _classCallCheck(this, Text);

        return _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).apply(this, arguments));
    }

    _createClass(Text, [{
        key: 'render',
        value: function render() {
            return React.createElement(View, this.props);
        }
    }]);

    return Text;
}(React.Component);

export default Text;

Text.defaultProps = {
    Component: 'span'
};