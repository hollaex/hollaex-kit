"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.valueMock = valueMock;
exports.dragStartMock = dragStartMock;
exports.dropMock = dropMock;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var getEvent = function getEvent(rest) {
  return (0, _extends2["default"])({
    stopPropagation: function stopPropagation(id) {
      return id;
    },
    preventDefault: function preventDefault(id) {
      return id;
    }
  }, rest);
};

function valueMock(value) {
  return getEvent({
    target: {
      value: value
    }
  });
}

function dragStartMock(setData) {
  return getEvent({
    dataTransfer: {
      setData: setData
    }
  });
}

function dropMock(getData) {
  return getEvent({
    dataTransfer: {
      getData: getData
    }
  });
}