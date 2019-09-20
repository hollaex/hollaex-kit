import * as React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import PopupMixin from './PopupMixin';
import Modal from "rmc-dialog/es/Modal";

var getModal = function getModal(props, visible, _ref) {
  var getContent = _ref.getContent,
      hide = _ref.hide,
      onDismiss = _ref.onDismiss,
      onOk = _ref.onOk;
  var styles = props.styles,
      title = props.title,
      okText = props.okText,
      dismissText = props.dismissText;
  var titleEl = typeof title === 'string' ? React.createElement(Text, {
    style: [styles.title]
  }, title) : title;
  var okEl = typeof okText === 'string' ? React.createElement(Text, {
    style: [styles.actionText, styles.okText]
  }, okText) : okText;
  var dismissEl = typeof dismissText === 'string' ? React.createElement(Text, {
    style: [styles.actionText, styles.dismissText]
  }, dismissText) : dismissText;
  return React.createElement(Modal, {
    animationType: "slide-up",
    wrapStyle: styles.modal,
    visible: visible,
    onClose: hide
  }, React.createElement(View, {
    style: [styles.header]
  }, React.createElement(TouchableHighlight, {
    onPress: onDismiss,
    style: [styles.headerItem],
    activeOpacity: props.actionTextActiveOpacity,
    underlayColor: props.actionTextUnderlayColor
  }, dismissEl), React.createElement(View, {
    style: [styles.headerItem]
  }, titleEl), React.createElement(TouchableHighlight, {
    onPress: onOk,
    style: [styles.headerItem],
    activeOpacity: props.actionTextActiveOpacity,
    underlayColor: props.actionTextUnderlayColor
  }, okEl)), getContent());
};

export default PopupMixin(getModal, {
  actionTextUnderlayColor: '#ddd',
  actionTextActiveOpacity: 1,
  triggerType: 'onPress',
  styles: {},
  WrapComponent: View
});