import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import MListView from 'rmc-list-view';
import handleProps from './handleProps';
import IndexedList from './Indexed';

var ListView = function (_React$Component) {
    _inherits(ListView, _React$Component);

    function ListView() {
        _classCallCheck(this, ListView);

        var _this = _possibleConstructorReturn(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).apply(this, arguments));

        _this.scrollTo = function () {
            var _this$listviewRef;

            return (_this$listviewRef = _this.listviewRef).scrollTo.apply(_this$listviewRef, arguments);
        };
        _this.getInnerViewNode = function () {
            return _this.listviewRef.getInnerViewNode();
        };
        return _this;
    }

    _createClass(ListView, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _handleProps = handleProps(this.props, false),
                restProps = _handleProps.restProps,
                extraProps = _handleProps.extraProps;

            return React.createElement(MListView, _extends({ ref: function ref(el) {
                    return _this2.listviewRef = el;
                } }, restProps, extraProps));
        }
    }]);

    return ListView;
}(React.Component);

export default ListView;

ListView.defaultProps = {
    prefixCls: 'am-list-view',
    listPrefixCls: 'am-list'
};
ListView.DataSource = MListView.DataSource;
ListView.IndexedList = IndexedList;