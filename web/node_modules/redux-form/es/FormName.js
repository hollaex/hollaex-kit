import * as React from 'react';
import { withReduxForm } from './ReduxFormContext';

var FormName = function FormName(_ref) {
  var children = _ref.children,
      _reduxForm = _ref._reduxForm;
  return children({
    form: _reduxForm && _reduxForm.form,
    sectionPrefix: _reduxForm && _reduxForm.sectionPrefix
  });
};

export default withReduxForm(FormName);