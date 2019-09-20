import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import Trigger from './Trigger';
function noop() {}
function returnEmptyString() {
    return '';
}
function returnDocument() {
    return window.document;
}

var TriggerWrap = function (_React$Component) {
    _inherits(TriggerWrap, _React$Component);

    function TriggerWrap(props) {
        _classCallCheck(this, TriggerWrap);

        var _this = _possibleConstructorReturn(this, (TriggerWrap.__proto__ || Object.getPrototypeOf(TriggerWrap)).call(this, props));

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

    _createClass(TriggerWrap, [{
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

            return React.createElement(Trigger, _extends({ ref: function ref(el) {
                    return _this2.triggerRef = el;
                } }, this.props, { visible: this.state.popupVisible, onTargetClick: this.onTargetClick, onClose: this.onClose }));
        }
    }]);

    return TriggerWrap;
}(React.Component);

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
export default TriggerWrap;