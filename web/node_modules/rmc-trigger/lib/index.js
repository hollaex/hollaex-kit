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

var _Trigger = require('./Trigger');

var _Trigger2 = _interopRequireDefault(_Trigger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
function returnEmptyString() {
    return '';
}
function returnDocument() {
    return window.document;
}

var TriggerWrap = function (_React$Component) {
    (0, _inherits3['default'])(TriggerWrap, _React$Component);

    function TriggerWrap(props) {
        (0, _classCallCheck3['default'])(this, TriggerWrap);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (TriggerWrap.__proto__ || Object.getPrototypeOf(TriggerWrap)).call(this, props));

        _this.onTargetClick = function () {
            _this.setPopupVisible(!_this.state.popupVisible);
        };
        _this.onClose = function () {
            _this.setPopupVisible(false);
        };
        var popupVisible = void 0;
        if ('popupVisible' in props) {
            popupVisible = !!props.popupVisible;
        } else {
            popupVisible = !!props.defaultPopupVisible;
        }
        _this.state = {
            popupVisible: popupVisible
        };
        return _this;
    }

    (0, _createClass3['default'])(TriggerWrap, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.visible !== undefined) {
                this.setPopupVisible(nextProps.visible);
            }
        }
    }, {
        key: 'setPopupVisible',
        value: function setPopupVisible(visible) {
            if (this.state.popupVisible !== visible) {
                this.setState({
                    popupVisible: visible
                });
                this.props.onPopupVisibleChange(visible);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2['default'].createElement(_Trigger2['default'], (0, _extends3['default'])({ ref: function ref(el) {
                    return _this2.triggerRef = el;
                } }, this.props, { visible: this.state.popupVisible, onTargetClick: this.onTargetClick, onClose: this.onClose }));
        }
    }]);
    return TriggerWrap;
}(_react2['default'].Component);

TriggerWrap.displayName = 'TriggerWrap';
TriggerWrap.defaultProps = {
    prefixCls: 'rc-trigger-popup',
    getPopupClassNameFromAlign: returnEmptyString,
    getDocument: returnDocument,
    onPopupVisibleChange: noop,
    afterPopupVisibleChange: noop,
    onPopupAlign: noop,
    popupClassName: '',
    popupStyle: {},
    destroyPopupOnHide: false,
    popupAlign: {},
    defaultPopupVisible: false,
    mask: false,
    maskClosable: true
};
exports['default'] = TriggerWrap;
module.exports = exports['default'];