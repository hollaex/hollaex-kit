import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import ListView from './ListView';
import { getOffsetTop, _event } from './util';

function setDocumentScrollTop(val) {
  window.document.body.scrollTop = val; // chrome61 is invalid
  window.document.documentElement.scrollTop = val;
}

/* eslint react/prop-types: 0 */

var IndexedList = function (_React$Component) {
  _inherits(IndexedList, _React$Component);

  function IndexedList(props) {
    _classCallCheck(this, IndexedList);

    var _this = _possibleConstructorReturn(this, (IndexedList.__proto__ || Object.getPrototypeOf(IndexedList)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      pageSize: props.pageSize,
      _delay: false
    };
    return _this;
  }

  _createClass(IndexedList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.dataChange(this.props);
      // handle quickSearchBar
      this.getQsInfo();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.dataSource !== nextProps.dataSource) {
        this.dataChange(nextProps);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.getQsInfo();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._timer) {
        clearTimeout(this._timer);
      }
      this._hCache = null;
    }
  }, {
    key: 'renderQuickSearchBar',
    value: function renderQuickSearchBar(quickSearchBarTop, quickSearchBarStyle) {
      var _this2 = this;

      var _props = this.props,
          dataSource = _props.dataSource,
          prefixCls = _props.prefixCls;

      var sectionKvs = dataSource.sectionIdentities.map(function (i) {
        return {
          value: i,
          label: dataSource._getSectionHeaderData(dataSource._dataBlob, i)
        };
      });
      return React.createElement(
        'ul',
        {
          ref: function ref(el) {
            return _this2.quickSearchBarRef = el;
          },
          className: prefixCls + '-quick-search-bar', style: quickSearchBarStyle,
          onTouchStart: this.onTouchStart,
          onTouchMove: this.onTouchMove,
          onTouchEnd: this.onTouchEnd,
          onTouchCancel: this.onTouchEnd
        },
        React.createElement(
          'li',
          { 'data-qf-target': quickSearchBarTop.value,
            onClick: function onClick() {
              return _this2.onQuickSearchTop(undefined, quickSearchBarTop.value);
            }
          },
          quickSearchBarTop.label
        ),
        sectionKvs.map(function (i) {
          return React.createElement(
            'li',
            { key: i.value, 'data-qf-target': i.value,
              onClick: function onClick() {
                return _this2.onQuickSearch(i.value);
              }
            },
            i.label
          );
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this,
          _classNames;

      var _state = this.state,
          _delay = _state._delay,
          pageSize = _state.pageSize;

      var _props2 = this.props,
          className = _props2.className,
          prefixCls = _props2.prefixCls,
          children = _props2.children,
          quickSearchBarTop = _props2.quickSearchBarTop,
          quickSearchBarStyle = _props2.quickSearchBarStyle,
          _props2$initialListSi = _props2.initialListSize,
          initialListSize = _props2$initialListSi === undefined ? Math.min(20, this.props.dataSource.getRowCount()) : _props2$initialListSi,
          showQuickSearchIndicator = _props2.showQuickSearchIndicator,
          _renderSectionHeader = _props2.renderSectionHeader,
          sectionHeaderClassName = _props2.sectionHeaderClassName,
          other = _objectWithoutProperties(_props2, ['className', 'prefixCls', 'children', 'quickSearchBarTop', 'quickSearchBarStyle', 'initialListSize', 'showQuickSearchIndicator', 'renderSectionHeader', 'sectionHeaderClassName']);

      // initialListSize={this.props.dataSource.getRowCount()}


      return React.createElement(
        'div',
        { className: prefixCls + '-container' },
        _delay && this.props.delayActivityIndicator,
        React.createElement(
          ListView,
          _extends({}, other, {
            ref: function ref(el) {
              return _this3.indexedListViewRef = el;
            },
            className: classNames(prefixCls, className),
            initialListSize: initialListSize,
            pageSize: pageSize,
            renderSectionHeader: function renderSectionHeader(sectionData, sectionID) {
              return React.cloneElement(_renderSectionHeader(sectionData, sectionID), {
                ref: function ref(c) {
                  return _this3.sectionComponents[sectionID] = c;
                },
                className: sectionHeaderClassName || prefixCls + '-section-header'
              });
            }
          }),
          children
        ),
        this.renderQuickSearchBar(quickSearchBarTop, quickSearchBarStyle),
        showQuickSearchIndicator ? React.createElement('div', { className: classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-qsindicator', true), _defineProperty(_classNames, prefixCls + '-qsindicator-hide', !showQuickSearchIndicator || !this.state.showQuickSearchIndicator), _classNames)), ref: function ref(el) {
            return _this3.qsIndicatorRef = el;
          }
        }) : null
      );
    }
  }]);

  return IndexedList;
}(React.Component);

IndexedList.propTypes = _extends({}, ListView.propTypes, {
  children: PropTypes.any,
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  sectionHeaderClassName: PropTypes.string,
  quickSearchBarTop: PropTypes.object,
  quickSearchBarStyle: PropTypes.object,
  onQuickSearch: PropTypes.func,
  showQuickSearchIndicator: PropTypes.bool
});
IndexedList.defaultProps = {
  prefixCls: 'rmc-indexed-list',
  quickSearchBarTop: { value: '#', label: '#' },
  onQuickSearch: function onQuickSearch() {},
  showQuickSearchIndicator: false,
  delayTime: 100,
  // delayActivityIndicator: <div style={{padding: 5, textAlign: 'center'}}>rendering more</div>,
  delayActivityIndicator: ''
};

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.onQuickSearchTop = function (sectionID, topId) {
    if (_this4.props.useBodyScroll) {
      setDocumentScrollTop(0);
    } else {
      ReactDOM.findDOMNode(_this4.indexedListViewRef.ListViewRef).scrollTop = 0;
    }
    _this4.props.onQuickSearch(sectionID, topId);
  };

  this.onQuickSearch = function (sectionID) {
    var lv = ReactDOM.findDOMNode(_this4.indexedListViewRef.ListViewRef);
    var sec = ReactDOM.findDOMNode(_this4.sectionComponents[sectionID]);
    if (_this4.props.useBodyScroll) {
      setDocumentScrollTop(sec.getBoundingClientRect().top - lv.getBoundingClientRect().top + getOffsetTop(lv));
    } else {
      lv.scrollTop += sec.getBoundingClientRect().top - lv.getBoundingClientRect().top;
    }
    _this4.props.onQuickSearch(sectionID);
  };

  this.onTouchStart = function (e) {
    _this4._target = e.target;
    _this4._basePos = _this4.quickSearchBarRef.getBoundingClientRect();
    document.addEventListener('touchmove', _this4._disableParent, false);
    document.body.className = document.body.className + ' ' + _this4.props.prefixCls + '-qsb-moving';
    _this4.updateIndicator(_this4._target);
  };

  this.onTouchMove = function (e) {
    e.preventDefault();
    if (_this4._target) {
      var ex = _event(e);
      var basePos = _this4._basePos;
      var _pos = void 0;
      if (ex.clientY >= basePos.top && ex.clientY <= basePos.top + _this4._qsHeight) {
        _pos = Math.floor((ex.clientY - basePos.top) / _this4._avgH);
        var target = void 0;
        if (_pos in _this4._hCache) {
          target = _this4._hCache[_pos][0];
        }
        if (target) {
          var overValue = target.getAttribute('data-qf-target');
          if (_this4._target !== target) {
            if (_this4.props.quickSearchBarTop.value === overValue) {
              _this4.onQuickSearchTop(undefined, overValue);
            } else {
              _this4.onQuickSearch(overValue);
            }
            _this4.updateIndicator(target);
          }
          _this4._target = target;
        }
      }
    }
  };

  this.onTouchEnd = function () {
    if (!_this4._target) {
      return;
    }
    document.removeEventListener('touchmove', _this4._disableParent, false);
    document.body.className = document.body.className.replace(new RegExp('\\s*' + _this4.props.prefixCls + '-qsb-moving', 'g'), '');
    _this4.updateIndicator(_this4._target, true);
    _this4._target = null;
  };

  this.getQsInfo = function () {
    var quickSearchBar = _this4.quickSearchBarRef;
    var height = quickSearchBar.offsetHeight;
    var hCache = [];
    [].slice.call(quickSearchBar.querySelectorAll('[data-qf-target]')).forEach(function (d) {
      hCache.push([d]);
    });
    var _avgH = height / hCache.length;
    var _top = 0;
    for (var i = 0, len = hCache.length; i < len; i++) {
      _top = i * _avgH;
      hCache[i][1] = [_top, _top + _avgH];
    }
    _this4._qsHeight = height;
    _this4._avgH = _avgH;
    _this4._hCache = hCache;
  };

  this.sectionComponents = {};

  this.dataChange = function (props) {
    // delay render more
    var rowCount = props.dataSource.getRowCount();
    if (!rowCount) {
      return;
    }
    _this4.setState({
      _delay: true
    });
    if (_this4._timer) {
      clearTimeout(_this4._timer);
    }
    _this4._timer = setTimeout(function () {
      _this4.setState({
        pageSize: rowCount,
        _delay: false
      }, function () {
        return _this4.indexedListViewRef._pageInNewRows();
      });
    }, props.delayTime);
  };

  this.updateIndicator = function (ele, end) {
    var el = ele;
    if (!el.getAttribute('data-qf-target')) {
      el = el.parentNode;
    }
    if (_this4.props.showQuickSearchIndicator) {
      _this4.qsIndicatorRef.innerText = el.innerText.trim();
      _this4.setState({
        showQuickSearchIndicator: true
      });
      if (_this4._indicatorTimer) {
        clearTimeout(_this4._indicatorTimer);
      }
      _this4._indicatorTimer = setTimeout(function () {
        _this4.setState({
          showQuickSearchIndicator: false
        });
      }, 1000);
    }

    var cls = _this4.props.prefixCls + '-quick-search-bar-over';
    // can not use setState to change className, it has a big performance issue!
    _this4._hCache.forEach(function (d) {
      d[0].className = d[0].className.replace(cls, '');
    });
    if (!end) {
      el.className = el.className + ' ' + cls;
    }
  };

  this._disableParent = function (e) {
    e.preventDefault();
    e.stopPropagation();
  };
};

export default IndexedList;