"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _ReduxFormContext = require("./ReduxFormContext");

var FormName = function FormName(_ref) {
  var children = _ref.children,
      _reduxForm = _ref._reduxForm;
  return children({
    form: _reduxForm && _reduxForm.form,
    sectionPrefix: _reduxForm && _reduxForm.sectionPrefix
  });
};

var _default = (0, _ReduxFormContext.withReduxForm)(FormName);

exports["default"] = _default;