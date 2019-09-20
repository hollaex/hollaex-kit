import silenceEvent from './silenceEvent';

var silenceEvents = function silenceEvents(fn) {
  return function (event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return silenceEvent(event) ? fn.apply(void 0, args) : fn.apply(void 0, [event].concat(args));
  };
};

export default silenceEvents;