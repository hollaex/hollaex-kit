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

var _Cascader = require('rmc-cascader/lib/Cascader');

var _Cascader2 = _interopRequireDefault(_Cascader);

var _MultiPicker = require('rmc-picker/lib/MultiPicker');

var _MultiPicker2 = _interopRequireDefault(_MultiPicker);

var _Picker = require('rmc-picker/lib/Picker');

var _Picker2 = _interopRequireDefault(_Picker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* tslint:disable:jsx-no-multiline-js */
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
    (0, _inherits3['default'])(PickerView, _React$Component);

    function PickerView() {
        (0, _classCallCheck3['default'])(this, PickerView);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (PickerView.__proto__ || Object.getPrototypeOf(PickerView)).apply(this, arguments));

        _this.getCol = function () {
            var _this$props = _this.props,
                data = _this$props.data,
                pickerPrefixCls = _this$props.pickerPrefixCls,
                indicatorStyle = _this$props.indicatorStyle,
                itemStyle = _this$props.itemStyle;

            return data.map(function (col, index) {
                return _react2['default'].createElement(
                    _Picker2['default'],
                    { key: index, prefixCls: pickerPrefixCls, style: { flex: 1 }, indicatorStyle: indicatorStyle, itemStyle: itemStyle },
                    col.map(function (item) {
                        return _react2['default'].createElement(
                            _Picker2['default'].Item,
                            { key: item.value, value: item.value },
                            item.label
                        );
                    })
                );
            });
        };
        return _this;
    }

    (0, _createClass3['default'])(PickerView, [{
        key: 'render',
        value: function render() {
            // tslint:disable-next-line:no-this-assignment
            var props = this.props;

            var picker = void 0;
            if (props.cascade) {
                picker = _react2['default'].createElement(_Cascader2['default'], { prefixCls: props.prefixCls, pickerPrefixCls: props.pickerPrefixCls, data: props.data, value: props.value, onChange: props.onChange, onScrollChange: props.onScrollChange, cols: props.cols, indicatorStyle: props.indicatorStyle, pickerItemStyle: props.itemStyle });
            } else {
                picker = _react2['default'].createElement(
                    _MultiPicker2['default'],
                    { prefixCls: props.prefixCls, selectedValue: props.value, onValueChange: props.onChange, onScrollChange: props.onScrollChange, style: { flexDirection: 'row' } },
                    this.getCol()
                );
            }
            return picker;
        }
    }]);
    return PickerView;
}(_react2['default'].Component);

exports['default'] = PickerView;

PickerView.defaultProps = getDefaultProps();
module.exports = exports['default'];