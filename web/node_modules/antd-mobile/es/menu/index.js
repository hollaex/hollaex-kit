import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import Flex from '../flex';
import List from '../list';
import { getComponentLocale } from '../_util/getLocale';
import SubMenu from './SubMenu';

var Menu = function (_React$Component) {
    _inherits(Menu, _React$Component);

    function Menu(props) {
        _classCallCheck(this, Menu);

        var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

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

    _createClass(Menu, [{
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
            var subValue = value && value.length > 0 && [].concat(_toConsumableArray(value)) || [];
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
            var _locale = getComponentLocale(this.props, this.context, 'Menu', function () {
                return require('./locale/zh_CN');
            });
            var heightStyle = height !== undefined ? {
                height: height + 'px'
            } : {};
            return React.createElement(
                Flex,
                { className: classnames(prefixCls, _defineProperty({}, className, !!className)), style: _extends({}, style, heightStyle), direction: 'column', align: 'stretch' },
                React.createElement(
                    Flex,
                    { align: 'start', className: classnames(_defineProperty({}, MenuSelectContanerPrefixCls, true)) },
                    level === 2 && React.createElement(
                        Flex.Item,
                        null,
                        React.createElement(
                            List,
                            { role: 'tablist' },
                            data.map(function (dataItem, index) {
                                return React.createElement(
                                    List.Item,
                                    { className: dataItem.value === firstLevelSelectValue ? prefixCls + '-selected' : '', onClick: function onClick() {
                                            return _this2.onClickFirstLevelItem(dataItem);
                                        }, key: 'listitem-1-' + index, role: 'tab', 'aria-selected': dataItem.value === firstLevelSelectValue },
                                    dataItem.label
                                );
                            })
                        )
                    ),
                    React.createElement(
                        Flex.Item,
                        { role: 'tabpanel', 'aria-hidden': 'false', className: MenuSelectContanerPrefixCls + '-submenu' },
                        React.createElement(SubMenu, { subMenuPrefixCls: this.props.subMenuPrefixCls, radioPrefixCls: this.props.radioPrefixCls, subMenuData: subMenuData, selItem: subSelInitItem, onSel: this.onClickSubMenuItem, showSelect: showSelect, multiSelect: multiSelect })
                    )
                ),
                multiSelect && React.createElement(
                    'div',
                    { className: multiSelectMenuBtnsCls },
                    React.createElement(
                        Button,
                        { inline: true, className: multiSelectMenuBtnsCls + '-btn', onClick: this.onMenuCancel },
                        _locale.cancelText
                    ),
                    React.createElement(
                        Button,
                        { inline: true, type: 'primary', className: multiSelectMenuBtnsCls + '-btn', onClick: this.onMenuOk },
                        _locale.okText
                    )
                )
            );
        }
    }]);

    return Menu;
}(React.Component);

export default Menu;

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
    antLocale: PropTypes.object
};