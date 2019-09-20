import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PopupPicker from 'rmc-picker/es/Popup';

var PopupCascader = function (_React$Component) {
    _inherits(PopupCascader, _React$Component);

    function PopupCascader() {
        _classCallCheck(this, PopupCascader);

        var _this = _possibleConstructorReturn(this, (PopupCascader.__proto__ || Object.getPrototypeOf(PopupCascader)).apply(this, arguments));

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

    _createClass(PopupCascader, [{
        key: 'render',
        value: function render() {
            return React.createElement(PopupPicker, _extends({ picker: this.props.cascader }, this.props, { onOk: this.onOk }));
        }
    }]);

    return PopupCascader;
}(React.Component);

PopupCascader.defaultProps = {
    pickerValueProp: 'value',
    pickerValueChangeProp: 'onChange'
};
export default PopupCascader;