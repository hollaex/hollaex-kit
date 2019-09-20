function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import * as React from 'react';
import { ScrollView, View, StyleSheet, PixelRatio, Text } from 'react-native';
import PickerMixin from './PickerMixin';
var ratio = PixelRatio.get();
var styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    left: 0,
    top: -99,
    borderColor: '#aaa',
    borderTopWidth: 1 / ratio,
    borderBottomWidth: 1 / ratio
  },
  scrollView: {
    height: 0
  },
  selectedItemText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  itemText: {
    fontSize: 20,
    color: '#aaa',
    textAlign: 'center'
  }
});

var Picker =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Picker, _React$Component);

  function Picker() {
    var _this;

    _classCallCheck(this, Picker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Picker).apply(this, arguments));

    _this.onItemLayout = function (e) {
      var _e$nativeEvent$layout = e.nativeEvent.layout,
          height = _e$nativeEvent$layout.height,
          width = _e$nativeEvent$layout.width; // console.log('onItemLayout', height);

      if (_this.itemHeight !== height || _this.itemWidth !== width) {
        _this.itemWidth = width;

        if (_this.indicatorRef) {
          _this.indicatorRef.setNativeProps({
            style: [styles.indicator, {
              top: height * 3,
              height: height,
              width: width
            }]
          });
        }
      }

      if (_this.itemHeight !== height) {
        _this.itemHeight = height;

        if (_this.scrollerRef) {
          _this.scrollerRef.setNativeProps({
            style: {
              height: height * 7
            }
          });
        }

        if (_this.contentRef) {
          _this.contentRef.setNativeProps({
            style: {
              paddingTop: height * 3,
              paddingBottom: height * 3
            }
          });
        } // i do no know why!...


        setTimeout(function () {
          _this.props.select(_this.props.selectedValue, _this.itemHeight, _this.scrollTo);
        }, 0);
      }
    };

    _this.scrollTo = function (y) {
      if (_this.scrollerRef) {
        _this.scrollerRef.scrollTo({
          y: y,
          animated: false
        });
      }
    };

    _this.fireValueChange = function (selectedValue) {
      if (_this.props.selectedValue !== selectedValue && _this.props.onValueChange) {
        _this.props.onValueChange(selectedValue);
      }
    };

    _this.onScroll = function (e) {
      var y = e.nativeEvent.contentOffset.y;

      _this.clearScrollBuffer();

      _this.scrollBuffer = setTimeout(function () {
        _this.clearScrollBuffer();

        _this.props.doScrollingComplete(y, _this.itemHeight, _this.fireValueChange);
      }, 100);
    };

    return _this;
  }

  _createClass(Picker, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.props.select(this.props.selectedValue, this.itemHeight, this.scrollTo);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearScrollBuffer();
    }
  }, {
    key: "clearScrollBuffer",
    value: function clearScrollBuffer() {
      if (this.scrollBuffer) {
        clearTimeout(this.scrollBuffer);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          children = _this$props.children,
          itemStyle = _this$props.itemStyle,
          selectedValue = _this$props.selectedValue,
          style = _this$props.style;
      var items = React.Children.map(children, function (item, index) {
        var totalStyle = [styles.itemText];

        if (selectedValue === item.props.value) {
          totalStyle.push(styles.selectedItemText);
        }

        totalStyle.push(itemStyle);
        return React.createElement(View, {
          ref: function ref(el) {
            return _this2["item".concat(index)] = el;
          },
          onLayout: index === 0 ? _this2.onItemLayout : undefined,
          key: item.key
        }, React.createElement(Text, {
          style: totalStyle,
          numberOfLines: 1
        }, item.props.label));
      });
      return React.createElement(View, {
        style: style
      }, React.createElement(View, {
        ref: function ref(el) {
          return _this2.indicatorRef = el;
        },
        style: styles.indicator
      }), React.createElement(ScrollView, {
        style: styles.scrollView,
        ref: function ref(el) {
          return _this2.scrollerRef = el;
        },
        onScroll: this.onScroll,
        showsVerticalScrollIndicator: false,
        overScrollMode: "never"
      }, React.createElement(View, {
        ref: function ref(el) {
          return _this2.contentRef = el;
        }
      }, items)));
    }
  }]);

  return Picker;
}(React.Component);

export default PickerMixin(Picker);