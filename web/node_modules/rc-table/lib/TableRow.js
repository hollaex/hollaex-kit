'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _miniStore = require('mini-store');

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _TableCell = require('./TableCell');

var _TableCell2 = _interopRequireDefault(_TableCell);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TableRow = function (_React$Component) {
  (0, _inherits3['default'])(TableRow, _React$Component);

  function TableRow(props) {
    (0, _classCallCheck3['default'])(this, TableRow);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (TableRow.__proto__ || Object.getPrototypeOf(TableRow)).call(this, props));

    _this.onTriggerEvent = function (rowPropFunc, legacyFunc, additionalFunc) {
      var _this$props = _this.props,
          record = _this$props.record,
          index = _this$props.index;


      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        // Additional function like trigger `this.onHover` to handle self logic
        if (additionalFunc) {
          additionalFunc();
        }

        // [Legacy] Some legacy function like `onRowClick`.
        var event = args[0];

        if (legacyFunc) {
          legacyFunc(record, index, event);
        }

        // Pass to the function from `onRow`
        if (rowPropFunc) {
          rowPropFunc.apply(undefined, args);
        }
      };
    };

    _this.onMouseEnter = function () {
      var _this$props2 = _this.props,
          onHover = _this$props2.onHover,
          rowKey = _this$props2.rowKey;

      onHover(true, rowKey);
    };

    _this.onMouseLeave = function () {
      var _this$props3 = _this.props,
          onHover = _this$props3.onHover,
          rowKey = _this$props3.rowKey;

      onHover(false, rowKey);
    };

    _this.shouldRender = props.visible;

    _this.state = {};
    return _this;
  }

  (0, _createClass3['default'])(TableRow, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.state.shouldRender) {
        this.saveRowRef();
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !!(this.props.visible || nextProps.visible);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state.shouldRender && !this.rowRef) {
        this.saveRowRef();
      }
    }
  }, {
    key: 'setExpandedRowHeight',
    value: function setExpandedRowHeight() {
      var _props = this.props,
          store = _props.store,
          rowKey = _props.rowKey;

      var _store$getState = store.getState(),
          expandedRowsHeight = _store$getState.expandedRowsHeight;

      var height = this.rowRef.getBoundingClientRect().height;
      expandedRowsHeight = (0, _extends5['default'])({}, expandedRowsHeight, (0, _defineProperty3['default'])({}, rowKey, height));
      store.setState({ expandedRowsHeight: expandedRowsHeight });
    }
  }, {
    key: 'setRowHeight',
    value: function setRowHeight() {
      var _props2 = this.props,
          store = _props2.store,
          rowKey = _props2.rowKey;

      var _store$getState2 = store.getState(),
          fixedColumnsBodyRowsHeight = _store$getState2.fixedColumnsBodyRowsHeight;

      var height = this.rowRef.getBoundingClientRect().height;
      store.setState({
        fixedColumnsBodyRowsHeight: (0, _extends5['default'])({}, fixedColumnsBodyRowsHeight, (0, _defineProperty3['default'])({}, rowKey, height))
      });
    }
  }, {
    key: 'getStyle',
    value: function getStyle() {
      var _props3 = this.props,
          height = _props3.height,
          visible = _props3.visible;


      if (height && height !== this.style.height) {
        this.style = (0, _extends5['default'])({}, this.style, { height: height });
      }

      if (!visible && !this.style.display) {
        this.style = (0, _extends5['default'])({}, this.style, { display: 'none' });
      }

      return this.style;
    }
  }, {
    key: 'saveRowRef',
    value: function saveRowRef() {
      this.rowRef = _reactDom2['default'].findDOMNode(this);

      var _props4 = this.props,
          isAnyColumnsFixed = _props4.isAnyColumnsFixed,
          fixed = _props4.fixed,
          expandedRow = _props4.expandedRow,
          ancestorKeys = _props4.ancestorKeys;


      if (!isAnyColumnsFixed) {
        return;
      }

      if (!fixed && expandedRow) {
        this.setExpandedRowHeight();
      }

      if (!fixed && ancestorKeys.length >= 0) {
        this.setRowHeight();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.shouldRender) {
        return null;
      }

      var _props5 = this.props,
          prefixCls = _props5.prefixCls,
          columns = _props5.columns,
          record = _props5.record,
          rowKey = _props5.rowKey,
          index = _props5.index,
          onRow = _props5.onRow,
          indent = _props5.indent,
          indentSize = _props5.indentSize,
          hovered = _props5.hovered,
          height = _props5.height,
          visible = _props5.visible,
          components = _props5.components,
          hasExpandIcon = _props5.hasExpandIcon,
          renderExpandIcon = _props5.renderExpandIcon,
          renderExpandIconCell = _props5.renderExpandIconCell,
          onRowClick = _props5.onRowClick,
          onRowDoubleClick = _props5.onRowDoubleClick,
          onRowMouseEnter = _props5.onRowMouseEnter,
          onRowMouseLeave = _props5.onRowMouseLeave,
          onRowContextMenu = _props5.onRowContextMenu;


      var BodyRow = components.body.row;
      var BodyCell = components.body.cell;

      var className = this.props.className;


      if (hovered) {
        className += ' ' + prefixCls + '-hover';
      }

      var cells = [];

      renderExpandIconCell(cells);

      for (var i = 0; i < columns.length; i++) {
        var column = columns[i];

        (0, _utils.warningOnce)(column.onCellClick === undefined, 'column[onCellClick] is deprecated, please use column[onCell] instead.');

        cells.push(_react2['default'].createElement(_TableCell2['default'], {
          prefixCls: prefixCls,
          record: record,
          indentSize: indentSize,
          indent: indent,
          index: index,
          column: column,
          key: column.key || column.dataIndex,
          expandIcon: hasExpandIcon(i) && renderExpandIcon(),
          component: BodyCell
        }));
      }

      var _ref = onRow(record, index) || {},
          customClassName = _ref.className,
          customStyle = _ref.style,
          rowProps = (0, _objectWithoutProperties3['default'])(_ref, ['className', 'style']);

      var style = { height: height };

      if (!visible) {
        style.display = 'none';
      }

      style = (0, _extends5['default'])({}, style, customStyle);

      var rowClassName = (0, _classnames2['default'])(prefixCls, className, prefixCls + '-level-' + indent, customClassName);

      return _react2['default'].createElement(
        BodyRow,
        (0, _extends5['default'])({}, rowProps, {
          onClick: this.onTriggerEvent(rowProps.onClick, onRowClick),
          onDoubleClick: this.onTriggerEvent(rowProps.onDoubleClick, onRowDoubleClick),
          onMouseEnter: this.onTriggerEvent(rowProps.onMouseEnter, onRowMouseEnter, this.onMouseEnter),
          onMouseLeave: this.onTriggerEvent(rowProps.onMouseLeave, onRowMouseLeave, this.onMouseLeave),
          onContextMenu: this.onTriggerEvent(rowProps.onContextMenu, onRowContextMenu),
          className: rowClassName,
          style: style,
          'data-row-key': rowKey
        }),
        cells
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.visible || !prevState.visible && nextProps.visible) {
        return {
          shouldRender: true,
          visible: nextProps.visible
        };
      }
      return {
        visible: nextProps.visible
      };
    }
  }]);
  return TableRow;
}(_react2['default'].Component);

TableRow.propTypes = {
  onRow: _propTypes2['default'].func,
  onRowClick: _propTypes2['default'].func,
  onRowDoubleClick: _propTypes2['default'].func,
  onRowContextMenu: _propTypes2['default'].func,
  onRowMouseEnter: _propTypes2['default'].func,
  onRowMouseLeave: _propTypes2['default'].func,
  record: _propTypes2['default'].object,
  prefixCls: _propTypes2['default'].string,
  onHover: _propTypes2['default'].func,
  columns: _propTypes2['default'].array,
  height: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]),
  index: _propTypes2['default'].number,
  rowKey: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]).isRequired,
  className: _propTypes2['default'].string,
  indent: _propTypes2['default'].number,
  indentSize: _propTypes2['default'].number,
  hasExpandIcon: _propTypes2['default'].func,
  hovered: _propTypes2['default'].bool.isRequired,
  visible: _propTypes2['default'].bool.isRequired,
  store: _propTypes2['default'].object.isRequired,
  fixed: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].bool]),
  renderExpandIcon: _propTypes2['default'].func,
  renderExpandIconCell: _propTypes2['default'].func,
  components: _propTypes2['default'].any,
  expandedRow: _propTypes2['default'].bool,
  isAnyColumnsFixed: _propTypes2['default'].bool,
  ancestorKeys: _propTypes2['default'].array.isRequired
};
TableRow.defaultProps = {
  onRow: function onRow() {},
  onHover: function onHover() {},
  hasExpandIcon: function hasExpandIcon() {},
  renderExpandIcon: function renderExpandIcon() {},
  renderExpandIconCell: function renderExpandIconCell() {}
};


function getRowHeight(state, props) {
  var expandedRowsHeight = state.expandedRowsHeight,
      fixedColumnsBodyRowsHeight = state.fixedColumnsBodyRowsHeight;
  var fixed = props.fixed,
      rowKey = props.rowKey;


  if (!fixed) {
    return null;
  }

  if (expandedRowsHeight[rowKey]) {
    return expandedRowsHeight[rowKey];
  }

  if (fixedColumnsBodyRowsHeight[rowKey]) {
    return fixedColumnsBodyRowsHeight[rowKey];
  }

  return null;
}

(0, _reactLifecyclesCompat.polyfill)(TableRow);

exports['default'] = (0, _miniStore.connect)(function (state, props) {
  var currentHoverKey = state.currentHoverKey,
      expandedRowKeys = state.expandedRowKeys;
  var rowKey = props.rowKey,
      ancestorKeys = props.ancestorKeys;

  var visible = ancestorKeys.length === 0 || ancestorKeys.every(function (k) {
    return ~expandedRowKeys.indexOf(k);
  });

  return {
    visible: visible,
    hovered: currentHoverKey === rowKey,
    height: getRowHeight(state, props)
  };
})(TableRow);
module.exports = exports['default'];