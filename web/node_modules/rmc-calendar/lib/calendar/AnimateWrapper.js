'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var AnimateWrapper = function (_React$PureComponent) {
    (0, _inherits3['default'])(AnimateWrapper, _React$PureComponent);

    function AnimateWrapper() {
        (0, _classCallCheck3['default'])(this, AnimateWrapper);
        return (0, _possibleConstructorReturn3['default'])(this, _React$PureComponent.apply(this, arguments));
    }

    AnimateWrapper.prototype.render = function render() {
        var _props = this.props,
            className = _props.className,
            displayType = _props.displayType,
            visible = _props.visible;

        return _react2['default'].createElement(
            'div',
            { className: className + ' animate', style: { display: visible ? displayType : 'none' } },
            visible && this.props.children
        );
    };

    return AnimateWrapper;
}(_react2['default'].PureComponent);

exports['default'] = AnimateWrapper;

AnimateWrapper.defaultProps = {
    className: '',
    displayType: 'flex'
};
module.exports = exports['default'];