import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

function getOffset(ele) {
  var el = ele;
  var _x = 0;
  var _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}

var CANCEL_DISTANCE_ON_SCROLL = 20;

var Drawer = function (_React$Component) {
  _inherits(Drawer, _React$Component);

  function Drawer(props) {
    _classCallCheck(this, Drawer);

    var _this = _possibleConstructorReturn(this, (Drawer.__proto__ || Object.getPrototypeOf(Drawer)).call(this, props));

    _this.onOverlayClicked = function () {
      if (_this.props.open) {
        // see https://github.com/react-component/drawer/issues/9
        setTimeout(function () {
          _this.props.onOpenChange(false, { overlayClicked: true });
        }, 0);
      }
    };

    _this.onTouchStart = function (ev) {
      // filter out if a user starts swiping with a second finger
      if (!_this.isTouching()) {
        var touch = ev.targetTouches[0];
        _this.setState({
          touchIdentifier: !_this.notTouch ? touch.identifier : null,
          touchStartX: touch.clientX,
          touchStartY: touch.clientY,
          touchCurrentX: touch.clientX,
          touchCurrentY: touch.clientY
        });
      }
    };

    _this.onTouchMove = function (ev) {
      // ev.preventDefault(); // cannot touchmove with FastClick
      if (_this.isTouching()) {
        for (var ind = 0; ind < ev.targetTouches.length; ind++) {
          // we only care about the finger that we are tracking
          if (ev.targetTouches[ind].identifier === _this.state.touchIdentifier) {
            _this.setState({
              touchCurrentX: ev.targetTouches[ind].clientX,
              touchCurrentY: ev.targetTouches[ind].clientY
            });
            break;
          }
        }
      }
    };

    _this.onTouchEnd = function () {
      _this.notTouch = false;
      if (_this.isTouching()) {
        // trigger a change to open if sidebar has been dragged beyond dragToggleDistance
        var touchWidth = _this.touchSidebarWidth();

        if (_this.props.open && touchWidth < _this.state.sidebarWidth - _this.props.dragToggleDistance || !_this.props.open && touchWidth > _this.props.dragToggleDistance) {
          _this.props.onOpenChange(!_this.props.open);
        }

        var touchHeight = _this.touchSidebarHeight();

        if (_this.props.open && touchHeight < _this.state.sidebarHeight - _this.props.dragToggleDistance || !_this.props.open && touchHeight > _this.props.dragToggleDistance) {
          _this.props.onOpenChange(!_this.props.open);
        }

        _this.setState({
          touchIdentifier: null,
          touchStartX: null,
          touchStartY: null,
          touchCurrentX: null,
          touchCurrentY: null
        });
      }
    };

    _this.onScroll = function () {
      if (_this.isTouching() && _this.inCancelDistanceOnScroll()) {
        _this.setState({
          touchIdentifier: null,
          touchStartX: null,
          touchStartY: null,
          touchCurrentX: null,
          touchCurrentY: null
        });
      }
    };

    _this.inCancelDistanceOnScroll = function () {
      var cancelDistanceOnScroll = void 0;
      switch (_this.props.position) {
        case 'right':
          cancelDistanceOnScroll = Math.abs(_this.state.touchCurrentX - _this.state.touchStartX) < CANCEL_DISTANCE_ON_SCROLL;
          break;
        case 'bottom':
          cancelDistanceOnScroll = Math.abs(_this.state.touchCurrentY - _this.state.touchStartY) < CANCEL_DISTANCE_ON_SCROLL;
          break;
        case 'top':
          cancelDistanceOnScroll = Math.abs(_this.state.touchStartY - _this.state.touchCurrentY) < CANCEL_DISTANCE_ON_SCROLL;
          break;
        case 'left':
        default:
          cancelDistanceOnScroll = Math.abs(_this.state.touchStartX - _this.state.touchCurrentX) < CANCEL_DISTANCE_ON_SCROLL;
      }
      return cancelDistanceOnScroll;
    };

    _this.isTouching = function () {
      return _this.state.touchIdentifier !== null;
    };

    _this.saveSidebarSize = function () {
      var sidebar = ReactDOM.findDOMNode(_this.refs.sidebar);
      var width = sidebar.offsetWidth;
      var height = sidebar.offsetHeight;
      var sidebarTop = getOffset(ReactDOM.findDOMNode(_this.refs.sidebar)).top;
      var dragHandleTop = getOffset(ReactDOM.findDOMNode(_this.refs.dragHandle)).top;

      if (width !== _this.state.sidebarWidth) {
        _this.setState({ sidebarWidth: width });
      }
      if (height !== _this.state.sidebarHeight) {
        _this.setState({ sidebarHeight: height });
      }
      if (sidebarTop !== _this.state.sidebarTop) {
        _this.setState({ sidebarTop: sidebarTop });
      }
      if (dragHandleTop !== _this.state.dragHandleTop) {
        _this.setState({ dragHandleTop: dragHandleTop });
      }
    };

    _this.touchSidebarWidth = function () {
      // if the sidebar is open and start point of drag is inside the sidebar
      // we will only drag the distance they moved their finger
      // otherwise we will move the sidebar to be below the finger.
      if (_this.props.position === 'right') {
        if (_this.props.open && window.innerWidth - _this.state.touchStartX < _this.state.sidebarWidth) {
          if (_this.state.touchCurrentX > _this.state.touchStartX) {
            return _this.state.sidebarWidth + _this.state.touchStartX - _this.state.touchCurrentX;
          }
          return _this.state.sidebarWidth;
        }
        return Math.min(window.innerWidth - _this.state.touchCurrentX, _this.state.sidebarWidth);
      }

      if (_this.props.position === 'left') {
        if (_this.props.open && _this.state.touchStartX < _this.state.sidebarWidth) {
          if (_this.state.touchCurrentX > _this.state.touchStartX) {
            return _this.state.sidebarWidth;
          }
          return _this.state.sidebarWidth - _this.state.touchStartX + _this.state.touchCurrentX;
        }
        return Math.min(_this.state.touchCurrentX, _this.state.sidebarWidth);
      }
    };

    _this.touchSidebarHeight = function () {
      // if the sidebar is open and start point of drag is inside the sidebar
      // we will only drag the distance they moved their finger
      // otherwise we will move the sidebar to be below the finger.
      if (_this.props.position === 'bottom') {
        if (_this.props.open && window.innerHeight - _this.state.touchStartY < _this.state.sidebarHeight) {
          if (_this.state.touchCurrentY > _this.state.touchStartY) {
            return _this.state.sidebarHeight + _this.state.touchStartY - _this.state.touchCurrentY;
          }
          return _this.state.sidebarHeight;
        }
        return Math.min(window.innerHeight - _this.state.touchCurrentY, _this.state.sidebarHeight);
      }

      if (_this.props.position === 'top') {
        var touchStartOffsetY = _this.state.touchStartY - _this.state.sidebarTop;
        if (_this.props.open && touchStartOffsetY < _this.state.sidebarHeight) {
          if (_this.state.touchCurrentY > _this.state.touchStartY) {
            return _this.state.sidebarHeight;
          }
          return _this.state.sidebarHeight - _this.state.touchStartY + _this.state.touchCurrentY;
        }
        return Math.min(_this.state.touchCurrentY - _this.state.dragHandleTop, _this.state.sidebarHeight);
      }
    };

    _this.renderStyle = function (_ref) {
      var sidebarStyle = _ref.sidebarStyle,
          isTouching = _ref.isTouching,
          overlayStyle = _ref.overlayStyle,
          contentStyle = _ref.contentStyle;

      if (_this.props.position === 'right' || _this.props.position === 'left') {
        sidebarStyle.transform = 'translateX(0%)';
        sidebarStyle.WebkitTransform = 'translateX(0%)';
        if (isTouching) {
          var percentage = _this.touchSidebarWidth() / _this.state.sidebarWidth;
          // slide open to what we dragged
          if (_this.props.position === 'right') {
            sidebarStyle.transform = 'translateX(' + (1 - percentage) * 100 + '%)';
            sidebarStyle.WebkitTransform = 'translateX(' + (1 - percentage) * 100 + '%)';
          }
          if (_this.props.position === 'left') {
            sidebarStyle.transform = 'translateX(-' + (1 - percentage) * 100 + '%)';
            sidebarStyle.WebkitTransform = 'translateX(-' + (1 - percentage) * 100 + '%)';
          }
          // fade overlay to match distance of drag
          overlayStyle.opacity = percentage;
          overlayStyle.visibility = 'visible';
        }
        if (contentStyle) {
          contentStyle[_this.props.position] = _this.state.sidebarWidth + 'px';
        }
      }
      if (_this.props.position === 'top' || _this.props.position === 'bottom') {
        sidebarStyle.transform = 'translateY(0%)';
        sidebarStyle.WebkitTransform = 'translateY(0%)';
        if (isTouching) {
          var _percentage = _this.touchSidebarHeight() / _this.state.sidebarHeight;
          // slide open to what we dragged
          if (_this.props.position === 'bottom') {
            sidebarStyle.transform = 'translateY(' + (1 - _percentage) * 100 + '%)';
            sidebarStyle.WebkitTransform = 'translateY(' + (1 - _percentage) * 100 + '%)';
          }
          if (_this.props.position === 'top') {
            sidebarStyle.transform = 'translateY(-' + (1 - _percentage) * 100 + '%)';
            sidebarStyle.WebkitTransform = 'translateY(-' + (1 - _percentage) * 100 + '%)';
          }
          // fade overlay to match distance of drag
          overlayStyle.opacity = _percentage;
          overlayStyle.visibility = 'visible';
        }
        if (contentStyle) {
          contentStyle[_this.props.position] = _this.state.sidebarHeight + 'px';
        }
      }
    };

    _this.state = {
      // the detected width of the sidebar in pixels
      sidebarWidth: 0,
      sidebarHeight: 0,
      sidebarTop: 0,
      dragHandleTop: 0,

      // keep track of touching params
      touchIdentifier: null,
      touchStartX: null,
      touchStartY: null,
      touchCurrentX: null,
      touchCurrentY: null,

      // if touch is supported by the browser
      touchSupported: (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && 'ontouchstart' in window
    };
    return _this;
  }

  _createClass(Drawer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.saveSidebarSize();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      // filter out the updates when we're touching
      if (!this.isTouching()) {
        this.saveSidebarSize();
      }
    }

    // This logic helps us prevents the user from sliding the sidebar horizontally
    // while scrolling the sidebar vertically. When a scroll event comes in, we're
    // cancelling the ongoing gesture if it did not move horizontally much.


    // True if the on going gesture X distance is less than the cancel distance


    // calculate the sidebarWidth based on current touch info

    // calculate the sidebarHeight based on current touch info

  }, {
    key: 'render',
    value: function render() {
      var _rootCls,
          _this2 = this;

      var _props = this.props,
          className = _props.className,
          style = _props.style,
          prefixCls = _props.prefixCls,
          position = _props.position,
          transitions = _props.transitions,
          touch = _props.touch,
          enableDragHandle = _props.enableDragHandle,
          sidebar = _props.sidebar,
          children = _props.children,
          docked = _props.docked,
          open = _props.open;


      var sidebarStyle = _extends({}, this.props.sidebarStyle);
      var contentStyle = _extends({}, this.props.contentStyle);
      var overlayStyle = _extends({}, this.props.overlayStyle);

      var rootCls = (_rootCls = {}, _defineProperty(_rootCls, className, !!className), _defineProperty(_rootCls, prefixCls, true), _defineProperty(_rootCls, prefixCls + '-' + position, true), _rootCls);

      var rootProps = { style: style };
      var isTouching = this.isTouching();

      if (isTouching) {
        this.renderStyle({ sidebarStyle: sidebarStyle, isTouching: true, overlayStyle: overlayStyle });
      } else if (docked) {
        if (this.state.sidebarWidth !== 0) {
          rootCls[prefixCls + '-docked'] = true;
          this.renderStyle({ sidebarStyle: sidebarStyle, contentStyle: contentStyle });
        }
      } else if (open) {
        rootCls[prefixCls + '-open'] = true;
        this.renderStyle({ sidebarStyle: sidebarStyle });
        overlayStyle.opacity = 1;
        overlayStyle.visibility = 'visible';
      }

      if (isTouching || !transitions) {
        sidebarStyle.transition = 'none';
        sidebarStyle.WebkitTransition = 'none';
        contentStyle.transition = 'none';
        overlayStyle.transition = 'none';
      }

      var dragHandle = null;

      if (this.state.touchSupported && touch) {
        if (open) {
          rootProps.onTouchStart = function (ev) {
            _this2.notTouch = true;
            _this2.onTouchStart(ev);
          };
          rootProps.onTouchMove = this.onTouchMove;
          rootProps.onTouchEnd = this.onTouchEnd;
          rootProps.onTouchCancel = this.onTouchEnd;
          rootProps.onScroll = this.onScroll;
        } else if (enableDragHandle) {
          dragHandle = React.createElement('div', { className: prefixCls + '-draghandle', style: this.props.dragHandleStyle,
            onTouchStart: this.onTouchStart, onTouchMove: this.onTouchMove,
            onTouchEnd: this.onTouchEnd, onTouchCancel: this.onTouchEnd,
            ref: 'dragHandle'
          });
        }
      }

      // const evt = {};
      // // FastClick use touchstart instead of click
      // if (this.state.touchSupported) {
      //   evt.onTouchStart = () => {
      //     this.notTouch = true;
      //     this.onOverlayClicked();
      //   };
      //   evt.onTouchEnd = () => {
      //     this.notTouch = false;
      //     this.setState({
      //       touchIdentifier: null,
      //     });
      //   };
      // } else {
      //   evt.onClick = this.onOverlayClicked;
      // }

      return React.createElement(
        'div',
        _extends({ className: classNames(rootCls) }, rootProps),
        React.createElement(
          'div',
          { className: prefixCls + '-sidebar', style: sidebarStyle,
            ref: 'sidebar'
          },
          sidebar
        ),
        React.createElement('div', { className: prefixCls + '-overlay',
          style: overlayStyle,
          role: 'presentation',
          ref: 'overlay',
          onClick: this.onOverlayClicked
        }),
        React.createElement(
          'div',
          { className: prefixCls + '-content', style: contentStyle,
            ref: 'content'
          },
          dragHandle,
          children
        )
      );
    }
  }]);

  return Drawer;
}(React.Component);

Drawer.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  // main content to render
  children: PropTypes.node.isRequired,

  // styles
  // styles: PropTypes.shape({
  //   dragHandle: PropTypes.object,
  // }),
  style: PropTypes.object,
  sidebarStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  overlayStyle: PropTypes.object,
  dragHandleStyle: PropTypes.object,

  // sidebar content to render
  sidebar: PropTypes.node.isRequired,

  // boolean if sidebar should be docked
  docked: PropTypes.bool,

  // boolean if sidebar should slide open
  open: PropTypes.bool,

  // boolean if transitions should be disabled
  transitions: PropTypes.bool,

  // boolean if touch gestures are enabled
  touch: PropTypes.bool,
  enableDragHandle: PropTypes.bool,

  // where to place the sidebar
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),

  // distance we have to drag the sidebar to toggle open state
  dragToggleDistance: PropTypes.number,

  // callback called when the overlay is clicked
  onOpenChange: PropTypes.func
};
Drawer.defaultProps = {
  prefixCls: 'rmc-drawer',
  sidebarStyle: {},
  contentStyle: {},
  overlayStyle: {},
  dragHandleStyle: {},
  docked: false,
  open: false,
  transitions: true,
  touch: true,
  enableDragHandle: true,
  position: 'left',
  dragToggleDistance: 30,
  onOpenChange: function onOpenChange() {}
};
export default Drawer;