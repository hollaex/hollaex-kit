'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _flex = require('../flex');

var _flex2 = _interopRequireDefault(_flex);

var _list = require('../list');

var _list2 = _interopRequireDefault(_list);

var _getLocale = require('../_util/getLocale');

var _SubMenu = require('./SubMenu');

var _SubMenu2 = _interopRequireDefault(_SubMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* tslint:disable:jsx-no-multiline-js */
var Menu = function (_React$Component) {
    (0, _inherits3['default'])(Menu, _React$Component);

    function Menu(props) {
        (0, _classCallCheck3['default'])(this, Menu);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

        _this.onMenuOk = function () {
            var onOk = _this.props.onOk;

            if (onOk) {
                onOk(_this.state.value);
            }
        };
        _this.onMenuCancel = function () {
            var onCancel = _this.props.onCancel;

            if (onCancel) {
                onCancel();
            }
        };
        _this.onClickFirstLevelItem = function (dataItem) {
            var onChange = _this.props.onChange;

            _this.setState({
                firstLevelSelectValue: dataItem.value
            });
            if (dataItem.isLeaf && onChange) {
                onChange([dataItem.value]);
            }
        };
        _this.getSelectValue = function (dataItem) {
            var _this$props = _this.props,
                level = _this$props.level,
                multiSelect = _this$props.multiSelect;

            if (multiSelect) {
                var _this$state = _this.state,
                    value = _this$state.value,
                    firstLevelSelectValue = _this$state.firstLevelSelectValue;

                if (value && value.length > 0) {
                    if (level === 2 && value[0] !== firstLevelSelectValue) {
                        /* if level is 2, when first level is reselect, reset submenu array */
                        return [firstLevelSelectValue, [dataItem.value]];
                    } else {
                        /* if level is 1, or first level isn't changed when level is 2, just do add or delete for submenu array  */
                        var chosenValues = level === 2 ? value[1] : value; // FIXME: hack type
                        var existIndex = chosenValues.indexOf(dataItem.value);
                        if (existIndex === -1) {
                            chosenValues.push(dataItem.value);
                        } else {
                            chosenValues.splice(existIndex, 1);
                        }
                        return value;
                    }
                } else {
                    /* if value is not exist before, init value */
                    return level === 2 ? [firstLevelSelectValue, [dataItem.value]] : [dataItem.value];
                }
            }
            return level === 2 ? [_this.state.firstLevelSelectValue, dataItem.value] : [dataItem.value];
        };
        _this.onClickSubMenuItem = function (dataItem) {
            var onChange = _this.props.onChange;

            var value = _this.getSelectValue(dataItem);
            _this.setState({ value: value });
            setTimeout(function () {
                // if onChange will close the menu, set a little time to show its selection state.
                if (onChange) {
                    onChange(value);
                }
            }, 300);
        };
        _this.state = {
            firstLevelSelectValue: _this.getNewFsv(props),
            value: props.value,
            height: props.height
        };
        return _this;
    }

    (0, _createClass3['default'])(Menu, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.value !== this.props.value) {
                this.setState({
                    firstLevelSelectValue: this.getNewFsv(nextProps),
                    value: nextProps.value
                });
            }
            if (this.props.height !== nextProps.height) {
                this.setState({
                    height: nextProps.height
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!('height' in this.props)) {
                this.setState({
                    height: Math.round(document.documentElement.clientHeight / 2)
                });
            }
        }
    }, {
        key: 'getNewFsv',
        value: function getNewFsv(props) {
            var value = props.value,
                data = props.data;

            var firstValue = '';
            if (value && value.length) {
                // if has init path, chose init first value
                firstValue = value[0]; // this is a contract
            } else if (data && data.length && !data[0].isLeaf) {
                // chose the first menu item if it's not leaf.
                firstValue = data[0].value;
            }
            return firstValue;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                className = _props.className,
                style = _props.style,
                _props$data = _props.data,
                data = _props$data === undefined ? [] : _props$data,
                prefixCls = _props.prefixCls,
                level = _props.level,
                multiSelect = _props.multiSelect,
                multiSelectMenuBtnsCls = _props.multiSelectMenuBtnsCls,
                MenuSelectContanerPrefixCls = _props.MenuSelectContanerPrefixCls;
            var _state = this.state,
                firstLevelSelectValue = _state.firstLevelSelectValue,
                value = _state.value,
                height = _state.height;

            var subMenuData = data; // menu only has one level as init
            if (level === 2) {
                var parent = data;
                if (firstLevelSelectValue && firstLevelSelectValue !== '') {
                    parent = data.filter(function (dataItem) {
                        return dataItem.value === firstLevelSelectValue;
                    });
                }
                // tslint:disable-next-line:prefer-conditional-expression
                if (parent[0] && parent[0].children && parent[0].isLeaf !== true) {
                    subMenuData = parent[0].children;
                } else {
                    subMenuData = [];
                }
            }
            var subValue = value && value.length > 0 && [].concat((0, _toConsumableArray3['default'])(value)) || [];
            if (level === 2 && subValue.length > 1) {
                subValue.shift();
                if (multiSelect) {
                    /* example: [[1,2,3]] -> [1,2,3] */
                    subValue = subValue[0]; // FIXME: hack type
                }
            }
            var parentValue = value && value.length > 1 && level === 2 ? value[0] : null;
            var subSelInitItem = subMenuData.filter(function (dataItem) {
                return subValue.indexOf(dataItem.value) !== -1;
            }).map(function (item) {
                return item.value;
            });
            var showSelect = true;
            if (level === 2 && parentValue !== firstLevelSelectValue) {
                showSelect = false;
            }
            // tslint:disable-next-line:variable-name
            var _locale = (0, _getLocale.getComponentLocale)(this.props, this.context, 'Menu', function () {
                return require('./locale/zh_CN');
            });
            var heightStyle = height !== undefined ? {
                height: height + 'px'
            } : {};
            return _react2['default'].createElement(
                _flex2['default'],
                { className: (0, _classnames4['default'])(prefixCls, (0, _defineProperty3['default'])({}, className, !!className)), style: (0, _extends3['default'])({}, style, heightStyle), direction: 'column', align: 'stretch' },
                _react2['default'].createElement(
                    _flex2['default'],
                    { align: 'start', className: (0, _classnames4['default'])((0, _defineProperty3['default'])({}, MenuSelectContanerPrefixCls, true)) },
                    level === 2 && _react2['default'].createElement(
                        _flex2['default'].Item,
                        null,
                        _react2['default'].createElement(
                            _list2['default'],
                            { role: 'tablist' },
                            data.map(function (dataItem, index) {
                                return _react2['default'].createElement(
                                    _list2['default'].Item,
                                    { className: dataItem.value === firstLevelSelectValue ? prefixCls + '-selected' : '', onClick: function onClick() {
                                            return _this2.onClickFirstLevelItem(dataItem);
                                        }, key: 'listitem-1-' + index, role: 'tab', 'aria-selected': dataItem.value === firstLevelSelectValue },
                                    dataItem.label
                                );
                            })
                        )
                    ),
                    _react2['default'].createElement(
                        _flex2['default'].Item,
                        { role: 'tabpanel', 'aria-hidden': 'false', className: MenuSelectContanerPrefixCls + '-submenu' },
                        _react2['default'].createElement(_SubMenu2['default'], { subMenuPrefixCls: this.props.subMenuPrefixCls, radioPrefixCls: this.props.radioPrefixCls, subMenuData: subMenuData, selItem: subSelInitItem, onSel: this.onClickSubMenuItem, showSelect: showSelect, multiSelect: multiSelect })
                    )
                ),
                multiSelect && _react2['default'].createElement(
                    'div',
                    { className: multiSelectMenuBtnsCls },
                    _react2['default'].createElement(
                        _button2['default'],
                        { inline: true, className: multiSelectMenuBtnsCls + '-btn', onClick: this.onMenuCancel },
                        _locale.cancelText
                    ),
                    _react2['default'].createElement(
                        _button2['default'],
                        { inline: true, type: 'primary', className: multiSelectMenuBtnsCls + '-btn', onClick: this.onMenuOk },
                        _locale.okText
                    )
                )
            );
        }
    }]);
    return Menu;
}(_react2['default'].Component);

exports['default'] = Menu;

Menu.defaultProps = {
    prefixCls: 'am-menu',
    subMenuPrefixCls: 'am-sub-menu',
    radioPrefixCls: 'am-radio',
    multiSelectMenuBtnsCls: 'am-multi-select-btns',
    MenuSelectContanerPrefixCls: 'am-menu-select-container',
    data: [],
    level: 2,
    onChange: function onChange() {},
    onOk: function onOk() {},
    onCancel: function onCancel() {},
    multiSelect: false
};
Menu.contextTypes = {
    antLocale: _propTypes2['default'].object
};
module.exports = exports['default'];