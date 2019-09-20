import createIsPristine from './isPristine';

var createIsDirty = function createIsDirty(structure) {
  return function (form, getFormState) {
    var isPristine = createIsPristine(structure)(form, getFormState);
    return function (state) {
      for (var _len = arguments.length, fields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        fields[_key - 1] = arguments[_key];
      }

      return !isPristine.apply(void 0, [state].concat(fields));
    };
  };
};

export default createIsDirty;