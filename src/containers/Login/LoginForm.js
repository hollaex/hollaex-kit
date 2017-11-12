import React from 'react';
import { reduxForm } from 'redux-form';
import { required, password, email } from '../../components/Form/validations';
import { TEXTS } from './constants';
import { AuthForm } from '../../components';

const { FIELDS, BUTTON } = TEXTS.FORM;

const FormFields = {
  email: {
    type: 'email',
    validate: [required, email],
    fullWidth: true,
    ...FIELDS.email,
  },
  password: {
    type: 'password',
    validate: [required, password],
    fullWidth: true,
    ...FIELDS.password,
  }
};

const Form = (props) => (
  <AuthForm
    {...props}
    formFields={FormFields}
    buttonLabel={BUTTON}
  />
);

export default reduxForm({
  form: 'LoginForm',
})(Form);
