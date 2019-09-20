'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _Popup = require('rmc-picker/lib/Popup');

var _Popup2 = _interopRequireDefault(_Popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var PopupCascader = function (_React$Component) {
    (0, _inherits3['default'])(PopupCascader, _React$Component);

    function PopupCascader() {
        (0, _classCallCheck3['default'])(this, PopupCascader);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (PopupCascader.__proto__ || Object.getPrototypeOf(PopupCascader)).apply(this, arguments));

        _this.onOk = function (v) {
            var _this$props = _this.props,
                onChange = _this$props.onChange,
                onOk = _this$props.onOk;

            if (onChange) {
                onChange(v);
            }
            if (onOk) {
                onOk(v);
            }
        };
        return _this;
    }

    (0, _createClass3['default'])(PopupCascader, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(_Popup2['default'], (0, _extends3['default'])({ picker: this.props.cascader }, this.props, { onOk: this.onOk }));
        }
    }]);
    return PopupCascader;
}(_react2['default'].Component);

PopupCascader.defaultProps = {
    pickerValueProp: 'value',
    pickerValueChangeProp: 'onChange'
};
exports['default'] = PopupCascader;
module.exports = exports['default'];