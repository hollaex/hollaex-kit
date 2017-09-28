import React from 'react';
import { FieldArray, Field, reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import { required, password } from '../../components/Form/validations';

const validate = (values) => {
  const errors = {};
  if (values.new_password !== values.new_password_confirm) {
    errors.new_password_confirm = 'Passwords must match';
  }

  return errors;
}
const FormValues = {
  old_password: {
    type: 'password',
    label: 'Current Password',
    placeholder: 'Type your current password',
    validate: [required, password]
  },
  new_password: {
    type: 'password',
    label: 'New Password',
    placeholder: 'Type a new password',
    validate: [required, password],
  },
  new_password_confirm: {
    type: 'password',
    label: 'Confirm New Password',
    placeholder: 'Retype your new password',
    validate: [required],
  },
};

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid, initialValues } = props;
  return (
    <form onSubmit={handleSubmit}>
      {renderFields(FormValues)}
      {error && <div className="warning_text">{error}</div>}
      <Button
        label="Change Password"
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'BankAccountForm',
  validate,
})(Form);
