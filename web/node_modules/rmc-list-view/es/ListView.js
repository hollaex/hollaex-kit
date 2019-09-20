import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* eslint no-unused-vars: 0, react/no-multi-comp: 0
react/prop-types: 0, react/sort-comp: 0, no-unused-expressions: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ListViewDataSource from './ListViewDataSource';
import ScrollView from './ScrollView';

var DEFAULT_PAGE_SIZE = 1;
var DEFAULT_INITIAL_ROWS = 10;
var DEFAULT_SCROLL_RENDER_AHEAD = 1000;
var DEFAULT_END_REACHED_THRESHOLD = 1000;
var DEFAULT_SCROLL_CALLBACK_THROTTLE = 50;
// const SCROLLVIEW_REF = 'ListViewRef';

var StaticRenderer = function (_React$Component) {
  _inherits(StaticRenderer, _React$Component);

  function StaticRenderer() {
    _classCallCheck(this, StaticRenderer);

    return _possibleConstructorReturn(this, (StaticRenderer.__proto__ || Object.getPrototypeOf(StaticRenderer)).apply(this, arguments));
  }

  _createClass(StaticRenderer, [{
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
}(React.Component);
// https://github.com/facebook/react-native/blob/0.26-stable/Libraries/CustomComponents/ListView/ListView.js


var ListView = function (_React$Component2) {
  _inherits(ListView, _React$Component2);

  function ListView() {
    var _ref;

    var _temp, _this2, _ret;

    _classCallCheck(this, ListView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = ListView.__proto__ || Object.getPrototypeOf(ListView)).call.apply(_ref, [this].concat(args))), _this2), _initialiseProps.call(_this2), _temp), _possibleConstructorReturn(_this2, _ret);
  }

  /**
   * Exports some data, e.g. for perf investigations or analytics.
   */


  _createClass(ListView, [{
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

          renderSectionHeader = React.createElement(StaticRenderer, {
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
          var row = React.createElement(StaticRenderer, {
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

        var rowsAndSeparators = React.cloneElement(this.props.renderSectionBodyWrapper(sectionID), {
          className: this.props.sectionBodyClassName
        }, sectionBody);

        if (this.props.renderSectionWrapper) {
          bodyComponents.push(React.cloneElement(this.props.renderSectionWrapper(sectionID), {}, renderSectionHeader, rowsAndSeparators));
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
          props = _objectWithoutProperties(_props, ['renderScrollComponent']);

      return React.cloneElement(renderScrollComponent(_extends({}, props, { onScroll: this._onScroll })), {
        ref: function ref(el) {
          return _this4.ListViewRef = el;
        },
        onContentSizeChange: this._onContentSizeChange,
        onLayout: this._onLayout
      }, this.props.renderHeader ? this.props.renderHeader() : null, React.cloneElement(props.renderBodyComponent(), {}, bodyComponents), this.props.renderFooter ? this.props.renderFooter() : null, props.children);
    }
  }]);

  return ListView;
}(React.Component);

ListView.DataSource = ListViewDataSource;
ListView.propTypes = _extends({}, ScrollView.propTypes, {
  dataSource: PropTypes.instanceOf(ListViewDataSource).isRequired,
  renderSeparator: PropTypes.func,
  renderRow: PropTypes.func.isRequired,
  initialListSize: PropTypes.number,
  onEndReached: PropTypes.func,
  onEndReachedThreshold: PropTypes.number,
  pageSize: PropTypes.number,
  renderFooter: PropTypes.func,
  renderHeader: PropTypes.func,
  renderSectionHeader: PropTypes.func,
  renderScrollComponent: PropTypes.func,
  scrollRenderAheadDistance: PropTypes.number,
  onChangeVisibleRows: PropTypes.func,
  scrollEventThrottle: PropTypes.number,
  // another added
  renderBodyComponent: PropTypes.func,
  renderSectionWrapper: PropTypes.func,
  renderSectionBodyWrapper: PropTypes.func,
  sectionBodyClassName: PropTypes.string,
  listViewPrefixCls: PropTypes.string,
  useBodyScroll: PropTypes.bool
});
ListView.defaultProps = {
  initialListSize: DEFAULT_INITIAL_ROWS,
  pageSize: DEFAULT_PAGE_SIZE,
  renderScrollComponent: function renderScrollComponent(props) {
    return React.createElement(ScrollView, props);
  },
  renderBodyComponent: function renderBodyComponent() {
    return React.createElement('div', null);
  },
  renderSectionBodyWrapper: function renderSectionBodyWrapper(sectionID) {
    return React.createElement('div', { key: sectionID });
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

export default ListView;