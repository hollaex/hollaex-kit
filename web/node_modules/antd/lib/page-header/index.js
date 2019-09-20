"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _classnames2 = _interopRequireDefault(require("classnames"));

var _configProvider = require("../config-provider");

var _icon = _interopRequireDefault(require("../icon"));

var _divider = _interopRequireDefault(require("../divider"));

var _breadcrumb = _interopRequireDefault(require("../breadcrumb"));

var _transButton = _interopRequireDefault(require("../_util/transButton"));

var _LocaleReceiver = _interopRequireDefault(require("../locale-provider/LocaleReceiver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var renderBack = function renderBack(prefixCls, backIcon, onBack) {
  if (!backIcon || !onBack) {
    return null;
  }

  return React.createElement(_LocaleReceiver["default"], {
    componentName: "PageHeader"
  }, function (_ref) {
    var back = _ref.back;
    return React.createElement("div", {
      className: "".concat(prefixCls, "-back")
    }, React.createElement(_transButton["default"], {
      onClick: function onClick(e) {
        if (onBack) {
          onBack(e);
        }
      },
      className: "".concat(prefixCls, "-back-button"),
      "aria-label": back
    }, backIcon), React.createElement(_divider["default"], {
      type: "vertical"
    }));
  });
};

var renderBreadcrumb = function renderBreadcrumb(breadcrumb) {
  return React.createElement(_breadcrumb["default"], breadcrumb);
};

var renderHeader = function renderHeader(prefixCls, props) {
  var breadcrumb = props.breadcrumb,
      backIcon = props.backIcon,
      onBack = props.onBack;

  if (breadcrumb && breadcrumb.routes) {
    return renderBreadcrumb(breadcrumb);
  }

  return renderBack(prefixCls, backIcon, onBack);
};

var renderTitle = function renderTitle(prefixCls, props) {
  var title = props.title,
      subTitle = props.subTitle,
      tags = props.tags,
      extra = props.extra;
  var headingPrefixCls = "".concat(prefixCls, "-heading");

  if (title || subTitle || tags || extra) {
    return React.createElement("div", {
      className: headingPrefixCls
    }, title && React.createElement("span", {
      className: "".concat(headingPrefixCls, "-title")
    }, title), subTitle && React.createElement("span", {
      className: "".concat(headingPrefixCls, "-sub-title")
    }, subTitle), tags && React.createElement("span", {
      className: "".concat(headingPrefixCls, "-tags")
    }, tags), extra && React.createElement("span", {
      className: "".concat(headingPrefixCls, "-extra")
    }, extra));
  }

  return null;
};

var renderFooter = function renderFooter(prefixCls, footer) {
  if (footer) {
    return React.createElement("div", {
      className: "".concat(prefixCls, "-footer")
    }, footer);
  }

  return null;
};

var PageHeader = function PageHeader(props) {
  return React.createElement(_configProvider.ConfigConsumer, null, function (_ref2) {
    var getPrefixCls = _ref2.getPrefixCls;
    var customizePrefixCls = props.prefixCls,
        style = props.style,
        footer = props.footer,
        children = props.children,
        customizeClassName = props.className;
    var prefixCls = getPrefixCls('page-header', customizePrefixCls);
    var className = (0, _classnames2["default"])(prefixCls, _defineProperty({}, "".concat(prefixCls, "-has-footer"), footer), customizeClassName);
    return React.createElement("div", {
      className: className,
      style: style
    }, renderHeader(prefixCls, props), renderTitle(prefixCls, props), children && React.createElement("div", {
      className: "".concat(prefixCls, "-content")
    }, children), renderFooter(prefixCls, footer));
  });
};

PageHeader.defaultProps = {
  backIcon: React.createElement(_icon["default"], {
    type: "arrow-left"
  })
};
var _default = PageHeader;
exports["default"] = _default;
//# sourceMappingURL=index.js.map
