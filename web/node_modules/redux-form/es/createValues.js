import _extends from "@babel/runtime/helpers/extends";
import { connect } from 'react-redux';

var createValues = function createValues(_ref) {
  var getIn = _ref.getIn;
  return function (config) {
    var _prop$getFormState$co = _extends({
      prop: 'values',
      getFormState: function getFormState(state) {
        return getIn(state, 'form');
      }
    }, config),
        form = _prop$getFormState$co.form,
        prop = _prop$getFormState$co.prop,
        getFormState = _prop$getFormState$co.getFormState;

    return connect(function (state) {
      var _ref2;

      return _ref2 = {}, _ref2[prop] = getIn(getFormState(state), form + ".values"), _ref2;
    } // ignore dispatch
    );
  };
};

export default createValues;