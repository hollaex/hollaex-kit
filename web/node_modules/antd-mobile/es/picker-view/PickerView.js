import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* tslint:disable:jsx-no-multiline-js */
import React from 'react';
import RMCCascader from 'rmc-cascader/es/Cascader';
import RMCMultiPicker from 'rmc-picker/es/MultiPicker';
import RMCPicker from 'rmc-picker/es/Picker';
function getDefaultProps() {
    return {
        prefixCls: 'am-picker',
        pickerPrefixCls: 'am-picker-col',
        cols: 3,
        cascade: true,
        value: [],
        onChange: function onChange() {}
    };
}

var PickerView = function (_React$Component) {
    _inherits(PickerView, _React$Component);

    function PickerView() {
        _classCallCheck(this, PickerView);

        var _this = _possibleConstructorReturn(this, (PickerView.__proto__ || Object.getPrototypeOf(PickerView)).apply(this, arguments));

        _this.getCol = function () {
            var _this$props = _this.props,
                data = _this$props.data,
                pickerPrefixCls = _this$props.pickerPrefixCls,
                indicatorStyle = _this$props.indicatorStyle,
                itemStyle = _this$props.itemStyle;

            return data.map(function (col, index) {
                return React.createElement(
                    RMCPicker,
                    { key: index, prefixCls: pickerPrefixCls, style: { flex: 1 }, indicatorStyle: indicatorStyle, itemStyle: itemStyle },
                    col.map(function (item) {
                        return React.createElement(
                            RMCPicker.Item,
                            { key: item.value, value: item.value },
                            item.label
                        );
                    })
                );
            });
        };
        return _this;
    }

    _createClass(PickerView, [{
        key: 'render',
        value: function render() {
            // tslint:disable-next-line:no-this-assignment
            var props = this.props;

            var picker = void 0;
            if (props.cascade) {
                picker = React.createElement(RMCCascader, { prefixCls: props.prefixCls, pickerPrefixCls: props.pickerPrefixCls, data: props.data, value: props.value, onChange: props.onChange, onScrollChange: props.onScrollChange, cols: props.cols, indicatorStyle: props.indicatorStyle, pickerItemStyle: props.itemStyle });
            } else {
                picker = React.createElement(
                    RMCMultiPicker,
                    { prefixCls: props.prefixCls, selectedValue: props.value, onValueChange: props.onChange, onScrollChange: props.onScrollChange, style: { flexDirection: 'row' } },
                    this.getCol()
                );
            }
            return picker;
        }
    }]);

    return PickerView;
}(React.Component);

export default PickerView;

PickerView.defaultProps = getDefaultProps();