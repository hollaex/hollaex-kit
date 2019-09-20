function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import classnames from 'classnames';
import { ConfigConsumer } from '../config-provider';
import Icon from '../icon';
import Divider from '../divider';
import Breadcrumb from '../breadcrumb';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';

var renderBack = function renderBack(prefixCls, backIcon, onBack) {
  if (!backIcon || !onBack) {
    return null;
  }

  return React.createElement(LocaleReceiver, {
    componentName: "PageHeader"
  }, function (_ref) {
    var back = _ref.back;
    return React.createElement("div", {
      className: "".concat(prefixCls, "-back")
    }, React.createElement(TransButton, {
      onClick: function onClick(e) {
        if (onBack) {
          onBack(e);
        }
      },
      className: "".concat(prefixCls, "-back-button"),
      "aria-label": back
    }, backIcon), React.createElement(Divider, {
      type: "vertical"
    }));
  });
};

var renderBreadcrumb = function renderBreadcrumb(breadcrumb) {
  return React.createElement(Breadcrumb, breadcrumb);
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
  return React.createElement(ConfigConsumer, null, function (_ref2) {
    var getPrefixCls = _ref2.getPrefixCls;
    var customizePrefixCls = props.prefixCls,
        style = props.style,
        footer = props.footer,
        children = props.children,
        customizeClassName = props.className;
    var prefixCls = getPrefixCls('page-header', customizePrefixCls);
    var className = classnames(prefixCls, _defineProperty({}, "".concat(prefixCls, "-has-footer"), footer), customizeClassName);
    return React.createElement("div", {
      className: className,
      style: style
    }, renderHeader(prefixCls, props), renderTitle(prefixCls, props), children && React.createElement("div", {
      className: "".concat(prefixCls, "-content")
    }, children), renderFooter(prefixCls, footer));
  });
};

PageHeader.defaultProps = {
  backIcon: React.createElement(Icon, {
    type: "arrow-left"
  })
};
export default PageHeader;
//# sourceMappingURL=index.js.map
