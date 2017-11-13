import React from 'react';
import { reduxForm } from 'redux-form';
import { email, requiredWithCustomMessage } from '../../components/Form/validations';
import { TEXTS } from './constants';
import { AuthForm } from '../../components';

const { FIELDS, BUTTON, VALIDATIONS } = TEXTS.FORM;

export const FormFields = ({
  email: {
    type: 'email',
    validate: [requiredWithCustomMessage(VALIDATIONS.TYPE_EMAIL), email],
    fullWidth: true,
    ...FIELDS.email,
  },
})

const Form = (props) => (
  <AuthForm
    {...props}
    formFields={FormFields}
    buttonLabel={BUTTON}
  />
);

export default reduxForm({
  form: 'EmailRequestForm',
})(Form);
