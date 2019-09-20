import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PopupPicker from 'rmc-picker/es/Popup';

var PopupDatePicker = function (_React$Component) {
    _inherits(PopupDatePicker, _React$Component);

    function PopupDatePicker() {
        _classCallCheck(this, PopupDatePicker);

        var _this = _possibleConstructorReturn(this, (PopupDatePicker.__proto__ || Object.getPrototypeOf(PopupDatePicker)).apply(this, arguments));

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

    _createClass(PopupDatePicker, [{
        key: 'render',
        value: function render() {
            return React.createElement(PopupPicker, _extends({ picker: this.props.datePicker, value: this.props.date }, this.props, { onOk: this.onOk }));
        }
    }]);

    return PopupDatePicker;
}(React.Component);

PopupDatePicker.defaultProps = {
    pickerValueProp: 'date',
    pickerValueChangeProp: 'onDateChange'
};
export default PopupDatePicker;