'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports['default'] = handleProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _list = require('../list');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
/* tslint:disable:no-unused-variable */

/* tslint:enable:no-unused-variable */
var Item = _list2['default'].Item;
function handleProps(props, isIndexed) {
    var renderHeader = props.renderHeader,
        renderFooter = props.renderFooter,
        renderSectionHeader = props.renderSectionHeader,
        renderBodyComponent = props.renderBodyComponent,
        restProps = __rest(props, ["renderHeader", "renderFooter", "renderSectionHeader", "renderBodyComponent"]);

    var listPrefixCls = props.listPrefixCls;
    var extraProps = {
        renderHeader: null,
        renderFooter: null,
        renderSectionHeader: null,
        renderBodyComponent: renderBodyComponent || function () {
            return _react2['default'].createElement('div', { className: listPrefixCls + '-body' });
        }
    };
    if (renderHeader) {
        extraProps.renderHeader = function () {
            return _react2['default'].createElement(
                'div',
                { className: listPrefixCls + '-header' },
                renderHeader()
            );
        };
    }
    if (renderFooter) {
        extraProps.renderFooter = function () {
            return _react2['default'].createElement(
                'div',
                { className: listPrefixCls + '-footer' },
                renderFooter()
            );
        };
    }
    if (renderSectionHeader) {
        extraProps.renderSectionHeader = isIndexed ? function (sectionData, sectionID) {
            return _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(
                    Item,
                    { prefixCls: listPrefixCls },
                    renderSectionHeader(sectionData, sectionID)
                )
            );
        } : function (sectionData, sectionID) {
            return _react2['default'].createElement(
                Item,
                { prefixCls: listPrefixCls },
                renderSectionHeader(sectionData, sectionID)
            );
        };
    }
    return { restProps: restProps, extraProps: extraProps };
}
module.exports = exports['default'];