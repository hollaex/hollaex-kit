import _extends from "@babel/runtime/helpers/extends";

var getEvent = function getEvent(rest) {
  return _extends({
    stopPropagation: function stopPropagation(id) {
      return id;
    },
    preventDefault: function preventDefault(id) {
      return id;
    }
  }, rest);
};

export function valueMock(value) {
  return getEvent({
    target: {
      value: value
    }
  });
}
export function dragStartMock(setData) {
  return getEvent({
    dataTransfer: {
      setData: setData
    }
  });
}
export function dropMock(getData) {
  return getEvent({
    dataTransfer: {
      getData: getData
    }
  });
}