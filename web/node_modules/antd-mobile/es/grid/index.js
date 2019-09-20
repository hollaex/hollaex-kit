import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import React from 'react';
import TouchFeedback from 'rmc-feedback';
import Carousel from '../carousel';
import Flex from '../flex';

var Grid = function (_React$Component) {
    _inherits(Grid, _React$Component);

    function Grid() {
        _classCallCheck(this, Grid);

        var _this = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).apply(this, arguments));

        _this.state = {
            initialSlideWidth: 0
        };
        _this.renderCarousel = function (rowsArr, pageCount, rowCount) {
            var prefixCls = _this.props.prefixCls;

            var carouselMaxRow = _this.props.carouselMaxRow;
            var pagesArr = [];
            for (var pageIndex = 0; pageIndex < pageCount; pageIndex++) {
                var pageRows = [];
                for (var ii = 0; ii < carouselMaxRow; ii++) {
                    var rowIndex = pageIndex * carouselMaxRow + ii;
                    if (rowIndex < rowCount) {
                        pageRows.push(rowsArr[rowIndex]);
                    } else {
                        // 空节点为了确保末尾页的最后未到底的行有底线(样式中last-child会没线)
                        pageRows.push(React.createElement('div', { key: 'gridline-' + rowIndex }));
                    }
                }
                pagesArr.push(React.createElement(
                    'div',
                    { key: 'pageitem-' + pageIndex, className: prefixCls + '-carousel-page' },
                    pageRows
                ));
            }
            return pagesArr;
        };
        _this.renderItem = function (dataItem, index, columnNum, renderItem) {
            var prefixCls = _this.props.prefixCls;

            var itemEl = null;
            if (renderItem) {
                itemEl = renderItem(dataItem, index);
            } else {
                if (dataItem) {
                    var icon = dataItem.icon,
                        text = dataItem.text;

                    itemEl = React.createElement(
                        'div',
                        { className: prefixCls + '-item-inner-content column-num-' + columnNum },
                        React.isValidElement(icon) ? icon : React.createElement('img', { className: prefixCls + '-icon', src: icon }),
                        React.createElement(
                            'div',
                            { className: prefixCls + '-text' },
                            text
                        )
                    );
                }
            }
            return React.createElement(
                'div',
                { className: prefixCls + '-item-content' },
                itemEl
            );
        };
        _this.getRows = function (rowCount, dataLength) {
            // tslint:disable:prefer-const
            var _this$props = _this.props,
                columnNum = _this$props.columnNum,
                data = _this$props.data,
                renderItem = _this$props.renderItem,
                prefixCls = _this$props.prefixCls,
                _onClick = _this$props.onClick,
                activeStyle = _this$props.activeStyle,
                activeClassName = _this$props.activeClassName,
                itemStyle = _this$props.itemStyle;

            var rowsArr = [];
            columnNum = columnNum;
            var rowWidth = 100 / columnNum + '%';
            var colStyle = _extends({ width: rowWidth }, itemStyle);
            for (var i = 0; i < rowCount; i++) {
                var rowArr = [];

                var _loop = function _loop(j) {
                    var dataIndex = i * columnNum + j;
                    var itemEl = void 0;
                    if (dataIndex < dataLength) {
                        var el = data && data[dataIndex];
                        itemEl = React.createElement(
                            TouchFeedback,
                            { key: 'griditem-' + dataIndex, activeClassName: activeClassName ? activeClassName : prefixCls + '-item-active', activeStyle: activeStyle },
                            React.createElement(
                                Flex.Item,
                                { className: prefixCls + '-item', onClick: function onClick() {
                                        return _onClick && _onClick(el, dataIndex);
                                    }, style: colStyle },
                                _this.renderItem(el, dataIndex, columnNum, renderItem)
                            )
                        );
                    } else {
                        itemEl = React.createElement(Flex.Item, { key: 'griditem-' + dataIndex, className: prefixCls + '-item ' + prefixCls + '-null-item', style: colStyle });
                    }
                    rowArr.push(itemEl);
                };

                for (var j = 0; j < columnNum; j++) {
                    _loop(j);
                }
                rowsArr.push(React.createElement(
                    Flex,
                    { justify: 'center', align: 'stretch', key: 'gridline-' + i },
                    rowArr
                ));
            }
            return rowsArr;
        };
        return _this;
    }

    _createClass(Grid, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setState({
                initialSlideWidth: document.documentElement.clientWidth
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _classnames;

            var _a = this.props,
                prefixCls = _a.prefixCls,
                className = _a.className,
                data = _a.data,
                hasLine = _a.hasLine,
                isCarousel = _a.isCarousel,
                square = _a.square,
                activeStyle = _a.activeStyle,
                activeClassName = _a.activeClassName,
                restProps = __rest(_a, ["prefixCls", "className", "data", "hasLine", "isCarousel", "square", "activeStyle", "activeClassName"]);
            var columnNum = restProps.columnNum,
                carouselMaxRow = restProps.carouselMaxRow,
                onClick = restProps.onClick,
                renderItem = restProps.renderItem,
                restPropsForCarousel = __rest(restProps, ["columnNum", "carouselMaxRow", "onClick", "renderItem"]);

            var initialSlideWidth = this.state.initialSlideWidth;

            columnNum = columnNum;
            carouselMaxRow = carouselMaxRow;
            var dataLength = data && data.length || 0;
            var rowCount = Math.ceil(dataLength / columnNum);
            var rowsArr = void 0;
            var renderEl = void 0;
            if (isCarousel) {
                if (initialSlideWidth < 0) {
                    // carousel  server render. because carousel dependes on document
                    return null;
                }
                if (rowCount % carouselMaxRow !== 0) {
                    rowCount = rowCount + carouselMaxRow - rowCount % carouselMaxRow;
                }
                var pageCount = Math.ceil(rowCount / carouselMaxRow);
                rowsArr = this.getRows(rowCount, dataLength);
                var carouselProps = {};
                if (pageCount <= 1) {
                    carouselProps = {
                        dots: false,
                        dragging: false,
                        swiping: false
                    };
                }
                renderEl = React.createElement(
                    Carousel,
                    _extends({ initialSlideWidth: initialSlideWidth }, restPropsForCarousel, carouselProps),
                    this.renderCarousel(rowsArr, pageCount, rowCount)
                );
            } else {
                rowsArr = this.getRows(rowCount, dataLength);
                renderEl = rowsArr;
            }
            var cls = classnames(prefixCls, className, (_classnames = {}, _defineProperty(_classnames, prefixCls + '-square', square), _defineProperty(_classnames, prefixCls + '-line', hasLine), _defineProperty(_classnames, prefixCls + '-carousel', isCarousel), _classnames));
            return React.createElement(
                'div',
                { className: cls },
                renderEl
            );
        }
    }]);

    return Grid;
}(React.Component);

export default Grid;

Grid.defaultProps = {
    data: [],
    hasLine: true,
    isCarousel: false,
    columnNum: 4,
    carouselMaxRow: 2,
    prefixCls: 'am-grid',
    square: true,
    itemStyle: {}
};