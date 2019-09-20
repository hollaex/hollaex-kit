'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ListViewDataSource = require('./ListViewDataSource');

var _ListViewDataSource2 = _interopRequireDefault(_ListViewDataSource);

var _ScrollView = require('./ScrollView');

var _ScrollView2 = _interopRequireDefault(_ScrollView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DEFAULT_PAGE_SIZE = 1; /* eslint no-unused-vars: 0, react/no-multi-comp: 0
                           react/prop-types: 0, react/sort-comp: 0, no-unused-expressions: 0 */

var DEFAULT_INITIAL_ROWS = 10;
var DEFAULT_SCROLL_RENDER_AHEAD = 1000;
var DEFAULT_END_REACHED_THRESHOLD = 1000;
var DEFAULT_SCROLL_CALLBACK_THROTTLE = 50;
// const SCROLLVIEW_REF = 'ListViewRef';

var StaticRenderer = function (_React$Component) {
  (0, _inherits3['default'])(StaticRenderer, _React$Component);

  function StaticRenderer() {
    (0, _classCallCheck3['default'])(this, StaticRenderer);
    return (0, _possibleConstructorReturn3['default'])(this, (StaticRenderer.__proto__ || Object.getPrototypeOf(StaticRenderer)).apply(this, arguments));
  }

  (0, _createClass3['default'])(StaticRenderer, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.shouldUpdate;
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.render();
    }
  }]);
  return StaticRenderer;
}(_react2['default'].Component);
// https://github.com/facebook/react-native/blob/0.26-stable/Libraries/CustomComponents/ListView/ListView.js


var ListView = function (_React$Component2) {
  (0, _inherits3['default'])(ListView, _React$Component2);

  function ListView() {
    var _ref;

    var _temp, _this2, _ret;

    (0, _classCallCheck3['default'])(this, ListView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = (0, _possibleConstructorReturn3['default'])(this, (_ref = ListView.__proto__ || Object.getPrototypeOf(ListView)).call.apply(_ref, [this].concat(args))), _this2), _initialiseProps.call(_this2), _temp), (0, _possibleConstructorReturn3['default'])(_this2, _ret);
  }

  /**
   * Exports some data, e.g. for perf investigations or analytics.
   */


  (0, _createClass3['default'])(ListView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // this data should never trigger a render pass, so don't put in state
      this.scrollProperties = {
        visibleLength: null,
        contentLength: null,
        offset: 0
      };
      this._childFrames = [];
      this._visibleRows = {};
      this._prevRenderedRowsCount = 0;
      this._sentEndForContentLength = null;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      if (this.props.dataSource !== nextProps.dataSource || this.props.initialListSize !== nextProps.initialListSize) {
        this.setState(function (state, props) {
          _this3._prevRenderedRowsCount = 0;
          return {
            curRenderedRowsCount: Math.min(Math.max(state.curRenderedRowsCount, nextProps.initialListSize // for preact
            ), nextProps.dataSource.getRowCount() // for preact
            )
          };
        }, function () {
          return _this3._renderMoreRowsIfNeeded();
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var dataSource = this.props.dataSource;
      var allRowIDs = dataSource.rowIdentities;
      var bodyComponents = [];
      var rowCount = 0;

      for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
        var sectionID = dataSource.sectionIdentities[sectionIdx];
        var rowIDs = allRowIDs[sectionIdx];
        if (rowIDs.length === 0) {
          continue;
        }

        var renderSectionHeader = void 0;
        if (this.props.renderSectionHeader) {
          var shouldUpdateHeader = rowCount >= this._prevRenderedRowsCount && dataSource.sectionHeaderShouldUpdate(sectionIdx);

          renderSectionHeader = _react2['default'].createElement(StaticRenderer, {
            key: 's_' + sectionID,
            shouldUpdate: !!shouldUpdateHeader,
            render: this.props.renderSectionHeader.bind(null, dataSource.getSectionHeaderData(sectionIdx), sectionID)
          });
        }

        var sectionBody = [];
        for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
          var rowID = rowIDs[rowIdx];
          var comboID = sectionID + '_' + rowID;
          var shouldUpdateRow = rowCount >= this._prevRenderedRowsCount && dataSource.rowShouldUpdate(sectionIdx, rowIdx);
          var row = _react2['default'].createElement(StaticRenderer, {
            key: 'r_' + comboID,
            shouldUpdate: !!shouldUpdateRow,
            render: this.props.renderRow.bind(null, dataSource.getRowData(sectionIdx, rowIdx), sectionID, rowID, this.onRowHighlighted)
          });
          sectionBody.push(row);

          if (this.props.renderSeparator && (rowIdx !== rowIDs.length - 1 || sectionIdx === allRowIDs.length - 1)) {
            var adjacentRowHighlighted = this.state.highlightedRow.sectionID === sectionID && (this.state.highlightedRow.rowID === rowID || this.state.highlightedRow.rowID === rowIDs[rowIdx + 1]);
            var separator = this.props.renderSeparator(sectionID, rowID, adjacentRowHighlighted);
            if (separator) {
              sectionBody.push(separator);
            }
          }
          if (++rowCount === this.state.curRenderedRowsCount) {
            break;
          }
        }

        var rowsAndSeparators = _react2['default'].cloneElement(this.props.renderSectionBodyWrapper(sectionID), {
          className: this.props.sectionBodyClassName
        }, sectionBody);

        if (this.props.renderSectionWrapper) {
          bodyComponents.push(_react2['default'].cloneElement(this.props.renderSectionWrapper(sectionID), {}, renderSectionHeader, rowsAndSeparators));
        } else {
          bodyComponents.push(renderSectionHeader);
          bodyComponents.push(rowsAndSeparators);
        }
        if (rowCount >= this.state.curRenderedRowsCount) {
          break;
        }
      }

      var _props = this.props,
          renderScrollComponent = _props.renderScrollComponent,
          props = (0, _objectWithoutProperties3['default'])(_props, ['renderScrollComponent']);


      return _react2['default'].cloneElement(renderScrollComponent((0, _extends3['default'])({}, props, { onScroll: this._onScroll })), {
        ref: function ref(el) {
          return _this4.ListViewRef = el;
        },
        onContentSizeChange: this._onContentSizeChange,
        onLayout: this._onLayout
      }, this.props.renderHeader ? this.props.renderHeader() : null, _react2['default'].cloneElement(props.renderBodyComponent(), {}, bodyComponents), this.props.renderFooter ? this.props.renderFooter() : null, props.children);
    }
  }]);
  return ListView;
}(_react2['default'].Component);

ListView.DataSource = _ListViewDataSource2['default'];
ListView.propTypes = (0, _extends3['default'])({}, _ScrollView2['default'].propTypes, {
  dataSource: _propTypes2['default'].instanceOf(_ListViewDataSource2['default']).isRequired,
  renderSeparator: _propTypes2['default'].func,
  renderRow: _propTypes2['default'].func.isRequired,
  initialListSize: _propTypes2['default'].number,
  onEndReached: _propTypes2['default'].func,
  onEndReachedThreshold: _propTypes2['default'].number,
  pageSize: _propTypes2['default'].number,
  renderFooter: _propTypes2['default'].func,
  renderHeader: _propTypes2['default'].func,
  renderSectionHeader: _propTypes2['default'].func,
  renderScrollComponent: _propTypes2['default'].func,
  scrollRenderAheadDistance: _propTypes2['default'].number,
  onChangeVisibleRows: _propTypes2['default'].func,
  scrollEventThrottle: _propTypes2['default'].number,
  // another added
  renderBodyComponent: _propTypes2['default'].func,
  renderSectionWrapper: _propTypes2['default'].func,
  renderSectionBodyWrapper: _propTypes2['default'].func,
  sectionBodyClassName: _propTypes2['default'].string,
  listViewPrefixCls: _propTypes2['default'].string,
  useBodyScroll: _propTypes2['default'].bool
});
ListView.defaultProps = {
  initialListSize: DEFAULT_INITIAL_ROWS,
  pageSize: DEFAULT_PAGE_SIZE,
  renderScrollComponent: function renderScrollComponent(props) {
    return _react2['default'].createElement(_ScrollView2['default'], props);
  },
  renderBodyComponent: function renderBodyComponent() {
    return _react2['default'].createElement('div', null);
  },
  renderSectionBodyWrapper: function renderSectionBodyWrapper(sectionID) {
    return _react2['default'].createElement('div', { key: sectionID });
  },
  sectionBodyClassName: 'list-view-section-body',
  listViewPrefixCls: 'rmc-list-view',
  scrollRenderAheadDistance: DEFAULT_SCROLL_RENDER_AHEAD,
  onEndReachedThreshold: DEFAULT_END_REACHED_THRESHOLD,
  scrollEventThrottle: DEFAULT_SCROLL_CALLBACK_THROTTLE,
  scrollerOptions: {}
};

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.state = {
    curRenderedRowsCount: this.props.initialListSize,
    highlightedRow: {} };

  this.getMetrics = function () {
    return {
      contentLength: _this5.scrollProperties.contentLength,
      totalRows: _this5.props.dataSource.getRowCount(),
      renderedRows: _this5.state.curRenderedRowsCount,
      visibleRows: Object.keys(_this5._visibleRows).length
    };
  };

  this.getInnerViewNode = function () {
    return _this5.ListViewRef.getInnerViewNode();
  };

  this.scrollTo = function () {
    var _ListViewRef;

    _this5.ListViewRef && _this5.ListViewRef.scrollTo && (_ListViewRef = _this5.ListViewRef).scrollTo.apply(_ListViewRef, arguments);
  };

  this.onRowHighlighted = function (sectionID, rowID) {
    _this5.setState({ highlightedRow: { sectionID: sectionID, rowID: rowID } });
  };

  this._onContentSizeChange = function (width, height) {
    var contentLength = !_this5.props.horizontal ? height : width;
    if (contentLength !== _this5.scrollProperties.contentLength) {
      _this5.scrollProperties.contentLength = contentLength;
      _this5._renderMoreRowsIfNeeded();
    }
    _this5.props.onContentSizeChange && _this5.props.onContentSizeChange(width, height);
  };

  this._onLayout = function (event) {
    var _event$nativeEvent$la = event.nativeEvent.layout,
        width = _event$nativeEvent$la.width,
        height = _event$nativeEvent$la.height;

    var visibleLength = !_this5.props.horizontal ? height : width;
    if (visibleLength !== _this5.scrollProperties.visibleLength) {
      _this5.scrollProperties.visibleLength = visibleLength;
      _this5._renderMoreRowsIfNeeded();
    }
    _this5.props.onLayout && _this5.props.onLayout(event);
  };

  this._maybeCallOnEndReached = function (event) {
    // console.log(this.scrollProperties, this._getDistanceFromEnd(this.scrollProperties));
    if (_this5.props.onEndReached && _this5.scrollProperties.contentLength !== _this5._sentEndForContentLength && _this5._getDistanceFromEnd(_this5.scrollProperties) < _this5.props.onEndReachedThreshold && _this5.state.curRenderedRowsCount === _this5.props.dataSource.getRowCount()) {
      _this5._sentEndForContentLength = _this5.scrollProperties.contentLength;
      _this5.props.onEndReached(event);
      return true;
    }
    return false;
  };

  this._renderMoreRowsIfNeeded = function () {
    if (_this5.scrollProperties.contentLength === null || _this5.scrollProperties.visibleLength === null || _this5.state.curRenderedRowsCount === _this5.props.dataSource.getRowCount()) {
      _this5._maybeCallOnEndReached();
      return;
    }

    var distanceFromEnd = _this5._getDistanceFromEnd(_this5.scrollProperties);
    // console.log(distanceFromEnd, this.props.scrollRenderAheadDistance);
    if (distanceFromEnd < _this5.props.scrollRenderAheadDistance) {
      _this5._pageInNewRows();
    }
  };

  this._pageInNewRows = function () {
    _this5.setState(function (state, props) {
      var rowsToRender = Math.min(state.curRenderedRowsCount + props.pageSize, props.dataSource.getRowCount());
      _this5._prevRenderedRowsCount = state.curRenderedRowsCount;
      return {
        curRenderedRowsCount: rowsToRender
      };
    }, function () {
      _this5._prevRenderedRowsCount = _this5.state.curRenderedRowsCount;
    });
  };

  this._getDistanceFromEnd = function (scrollProperties) {
    return scrollProperties.contentLength - scrollProperties.visibleLength - scrollProperties.offset;
  };

  this._onScroll = function (e, metrics) {
    // when the ListView is destroyed,
    // but also will trigger scroll event after `scrollEventThrottle`
    if (!_this5.ListViewRef) {
      return;
    }

    _this5.scrollProperties = metrics;

    if (!_this5._maybeCallOnEndReached(e)) {
      _this5._renderMoreRowsIfNeeded();
    }

    if (_this5.props.onEndReached && _this5._getDistanceFromEnd(_this5.scrollProperties) > _this5.props.onEndReachedThreshold) {
      // Scrolled out of the end zone, so it should be able to trigger again.
      _this5._sentEndForContentLength = null;
    }

    _this5.props.onScroll && _this5.props.onScroll(e);
  };
};

exports['default'] = ListView;
module.exports = exports['default'];