import React from 'react';
import { reduxForm } from 'redux-form';
import { email, requiredWithCustomMessage } from '../../components/Form/validations';
import { AuthForm } from '../../components';
import STRINGS from '../../config/localizedStrings';

export const generateFormFields = () => ({
  email: {
    type: 'email',
    validate: [requiredWithCustomMessage(STRINGS.VALIDATIONS.TYPE_EMAIL), email],
    fullWidth: true,
    label: STRINGS.FORM_FIELDS.EMAIL_LABEL,
    placeholder: STRINGS.FORM_FIELDS.EMAIL_PLACEHOLDER,
  },
})

const Form = (props) => (
  <AuthForm
    {...props}
    formFields={generateFormFields()}
    buttonLabel={STRINGS.VERIFICATION_EMAIL_REQUEST.BUTTON}
  />
);

export default reduxForm({
  form: 'EmailRequestForm',
})(Form);
