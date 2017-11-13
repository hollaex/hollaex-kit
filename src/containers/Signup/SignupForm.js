import React from 'react';
import { reduxForm } from 'redux-form';
import { required, password, email, requiredWithCustomMessage } from '../../components/Form/validations';
import { AuthForm } from '../../components';
import { TEXTS } from './constants';

const { FIELDS, BUTTON, VALIDATIONS } = TEXTS.FORM;

export const generateFormFields = (termsLabel = '') => ({
  email: {
    type: 'email',
    validate: [requiredWithCustomMessage(VALIDATIONS.TYPE_EMAIL), email],
    fullWidth: true,
    ...FIELDS.email,
  },
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
  terms: {
    type: 'checkbox',
    fullWidth: true,
    validate: [requiredWithCustomMessage(VALIDATIONS.ACCEPT_TERMS)],
    label: termsLabel,
  }
});

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
    buttonLabel={BUTTON}
  />
);

export default reduxForm({
  form: 'SignForm',
  validate,
})(Form);
