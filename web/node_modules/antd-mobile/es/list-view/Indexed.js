import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import MListView from 'rmc-list-view';
import handleProps from './handleProps';
var IndexedList = MListView.IndexedList;

var MIndexedList = function (_React$Component) {
    _inherits(MIndexedList, _React$Component);

    function MIndexedList() {
        _classCallCheck(this, MIndexedList);

        return _possibleConstructorReturn(this, (MIndexedList.__proto__ || Object.getPrototypeOf(MIndexedList)).apply(this, arguments));
    }

    _createClass(MIndexedList, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                listPrefixCls = _props.listPrefixCls;

            var _handleProps = handleProps(this.props, true),
                restProps = _handleProps.restProps,
                extraProps = _handleProps.extraProps;

            return React.createElement(
                IndexedList,
                _extends({ ref: function ref(el) {
                        return _this2.indexedListRef = el;
                    }, sectionHeaderClassName: prefixCls + '-section-header ' + listPrefixCls + '-body', sectionBodyClassName: prefixCls + '-section-body ' + listPrefixCls + '-body' }, restProps, extraProps),
                this.props.children
            );
        }
    }]);

    return MIndexedList;
}(React.Component);

export default MIndexedList;

MIndexedList.defaultProps = {
    prefixCls: 'am-indexed-list',
    listPrefixCls: 'am-list',
    listViewPrefixCls: 'am-list-view'
};