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

exports.getDefaultProps = getDefaultProps;

var _arrayTreeFilter = require('array-tree-filter');

var _arrayTreeFilter2 = _interopRequireDefault(_arrayTreeFilter);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Cascader = require('rmc-cascader/lib/Cascader');

var _Cascader2 = _interopRequireDefault(_Cascader);

var _Popup = require('rmc-cascader/lib/Popup');

var _Popup2 = _interopRequireDefault(_Popup);

var _MultiPicker = require('rmc-picker/lib/MultiPicker');

var _MultiPicker2 = _interopRequireDefault(_MultiPicker);

var _Picker = require('rmc-picker/lib/Picker');

var _Picker2 = _interopRequireDefault(_Picker);

var _getLocale = require('../_util/getLocale');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
/* tslint:disable:jsx-no-multiline-js */
function getDefaultProps() {
    var defaultFormat = function defaultFormat(values) {
        // label is JSX.Element or other
        if (values.length > 0 && typeof values[0] !== 'string') {
            return values;
        }
        return values.join(',');
    };
    return {
        triggerType: 'onClick',
        prefixCls: 'am-picker',
        pickerPrefixCls: 'am-picker-col',
        popupPrefixCls: 'am-picker-popup',
        format: defaultFormat,
        cols: 3,
        cascade: true,
        title: ''
    };
}

var AbstractPicker = function (_React$Component) {
    (0, _inherits3['default'])(AbstractPicker, _React$Component);

    function AbstractPicker() {
        (0, _classCallCheck3['default'])(this, AbstractPicker);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (AbstractPicker.__proto__ || Object.getPrototypeOf(AbstractPicker)).apply(this, arguments));

        _this.getSel = function () {
            var value = _this.props.value || [];
            var treeChildren = void 0;
            var data = _this.props.data;

            if (_this.props.cascade) {
                treeChildren = (0, _arrayTreeFilter2['default'])(data, function (c, level) {
                    return c.value === value[level];
                });
            } else {
                treeChildren = value.map(function (v, i) {
                    return data[i].filter(function (d) {
                        return d.value === v;
                    })[0];
                });
            }
            return _this.props.format && _this.props.format(treeChildren.map(function (v) {
                return v.label;
            }));
        };
        _this.getPickerCol = function () {
            var _this$props = _this.props,
                data = _this$props.data,
                pickerPrefixCls = _this$props.pickerPrefixCls,
                itemStyle = _this$props.itemStyle,
                indicatorStyle = _this$props.indicatorStyle;

            return data.map(function (col, index) {
                return _react2['default'].createElement(
                    _Picker2['default'],
                    { key: index, prefixCls: pickerPrefixCls, style: { flex: 1 }, itemStyle: itemStyle, indicatorStyle: indicatorStyle },
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
        _this.onOk = function (v) {
            if (_this.scrollValue !== undefined) {
                v = _this.scrollValue;
            }
            if (_this.props.onChange) {
                _this.props.onChange(v);
            }
            if (_this.props.onOk) {
                _this.props.onOk(v);
            }
        };
        _this.setScrollValue = function (v) {
            _this.scrollValue = v;
        };
        _this.setCasecadeScrollValue = function (v) {
            // 级联情况下保证数据正确性，滚动过程中只有当最后一级变化时才变更数据
            if (v && _this.scrollValue) {
                var length = _this.scrollValue.length;
                if (length === v.length && _this.scrollValue[length - 1] === v[length - 1]) {
                    return;
                }
            }
            _this.setScrollValue(v);
        };
        _this.fixOnOk = function (cascader) {
            if (cascader && cascader.onOk !== _this.onOk) {
                cascader.onOk = _this.onOk;
                cascader.forceUpdate();
            }
        };
        _this.onPickerChange = function (v) {
            _this.setScrollValue(v);
            if (_this.props.onPickerChange) {
                _this.props.onPickerChange(v);
            }
        };
        _this.onVisibleChange = function (visible) {
            _this.setScrollValue(undefined);
            if (_this.props.onVisibleChange) {
                _this.props.onVisibleChange(visible);
            }
        };
        return _this;
    }

    (0, _createClass3['default'])(AbstractPicker, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                children = _a.children,
                _a$value = _a.value,
                value = _a$value === undefined ? [] : _a$value,
                popupPrefixCls = _a.popupPrefixCls,
                itemStyle = _a.itemStyle,
                indicatorStyle = _a.indicatorStyle,
                okText = _a.okText,
                dismissText = _a.dismissText,
                extra = _a.extra,
                cascade = _a.cascade,
                prefixCls = _a.prefixCls,
                pickerPrefixCls = _a.pickerPrefixCls,
                data = _a.data,
                cols = _a.cols,
                onOk = _a.onOk,
                restProps = __rest(_a, ["children", "value", "popupPrefixCls", "itemStyle", "indicatorStyle", "okText", "dismissText", "extra", "cascade", "prefixCls", "pickerPrefixCls", "data", "cols", "onOk"]);
            // tslint:disable-next-line:variable-name
            var _locale = (0, _getLocale.getComponentLocale)(this.props, this.context, 'Picker', function () {
                return require('./locale/zh_CN');
            });
            var cascader = void 0;
            var popupMoreProps = {};
            if (cascade) {
                cascader = _react2['default'].createElement(_Cascader2['default'], { prefixCls: prefixCls, pickerPrefixCls: pickerPrefixCls, data: data, cols: cols, onChange: this.onPickerChange, onScrollChange: this.setCasecadeScrollValue, pickerItemStyle: itemStyle, indicatorStyle: indicatorStyle });
            } else {
                cascader = _react2['default'].createElement(
                    _MultiPicker2['default'],
                    { style: { flexDirection: 'row', alignItems: 'center' }, prefixCls: prefixCls, onScrollChange: this.setScrollValue },
                    this.getPickerCol()
                );
                popupMoreProps = {
                    pickerValueProp: 'selectedValue',
                    pickerValueChangeProp: 'onValueChange'
                };
            }
            return _react2['default'].createElement(
                _Popup2['default'],
                (0, _extends3['default'])({ cascader: cascader }, this.popupProps, restProps, { prefixCls: popupPrefixCls, value: value, dismissText: dismissText || _locale.dismissText, okText: okText || _locale.okText }, popupMoreProps, { ref: this.fixOnOk, onVisibleChange: this.onVisibleChange }),
                children && typeof children !== 'string' && _react2['default'].isValidElement(children) && _react2['default'].cloneElement(children, {
                    extra: this.getSel() || extra || _locale.extra
                })
            );
        }
    }]);
    return AbstractPicker;
}(_react2['default'].Component);

exports['default'] = AbstractPicker;