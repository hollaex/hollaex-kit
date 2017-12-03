import React from 'react';
import { reduxForm } from 'redux-form';
import { required, password } from '../../components/Form/validations';
import { AuthForm } from '../../components';
import { TEXTS } from './constants';
import STRINGS from '../../config/localizedStrings';

const { FIELDS, BUTTON, VALIDATIONS } = TEXTS.FORM;

export const FormFields = {
  password: {
    type: 'password',
    validate: [required, password],
    fullWidth: true,
    ...FIELDS.password,
  },
  password_repeat: {
    type: 'password',
    validate: [required],
    fullWidth: true,
    ...FIELDS.password_repeat,
  },
};

const validate = (values) => {
  const { password, password_repeat } = values;
  const errors = {};

  if (password && password_repeat && password !== password_repeat) {
    errors.password_repeat = VALIDATIONS.PASSWORDS_DONT_MATCH;
  }

  return errors;
}

const Form = (props) => (
  <AuthForm
    {...props}
    formFields={FormFields}
    buttonLabel={STRINGS.RESET_PASSWORD.BUTTON}
  />
);

export default reduxForm({
  form: 'RequestPasswordForm',
  validate,
})(Form);
