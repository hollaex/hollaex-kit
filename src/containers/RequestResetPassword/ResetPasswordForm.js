import React from 'react';
import { reduxForm } from 'redux-form';
import { requiredWithCustomMessage, email } from '../../components/Form/validations';
import { TEXTS } from './constants';
import { AuthForm } from '../../components';

const { FIELDS, BUTTON, VALIDATIONS } = TEXTS.FORM;

const FormFields = {
  email: {
    type: 'email',
    validate: [requiredWithCustomMessage(VALIDATIONS.TYPE_EMAIL), email],
    fullWidth: true,
    ...FIELDS.email,
  },
};

const Form = (props) => (
  <AuthForm
    {...props}
    formFields={FormFields}
    buttonLabel={TEXTS.BUTTON}
  />
);

export default reduxForm({
  form: 'ResetPasswordForm',
})(Form);
