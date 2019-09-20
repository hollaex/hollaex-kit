'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var createPortal = _reactDom2['default'].createPortal;

var Portal = function (_React$Component) {
    (0, _inherits3['default'])(Portal, _React$Component);

    function Portal(props) {
        (0, _classCallCheck3['default'])(this, Portal);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Portal.__proto__ || Object.getPrototypeOf(Portal)).call(this, props));

        _this.container = _this.props.getContainer();
        return _this;
    }

    (0, _createClass3['default'])(Portal, [{
        key: 'render',
        value: function render() {
            if (this.props.children) {
                return createPortal(this.props.children, this.container);
            }
            return null;
        }
    }]);
    return Portal;
}(_react2['default'].Component);

exports['default'] = Portal;
module.exports = exports['default'];