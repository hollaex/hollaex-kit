import React from 'react';
import { reduxForm } from 'redux-form';
import { email, requiredWithCustomMessage } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import { TEXTS } from './constants';

const { FIELDS, BUTTON, VALIDATIONS } = TEXTS.FORM;

export const FormFields = ({
  email: {
    type: 'email',
    validate: [requiredWithCustomMessage(VALIDATIONS.TYPE_EMAIL), email],
    fullWidth: true,
    ...FIELDS.email,
  },
})

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid, formFields } = props;
  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="w-100">
        {renderFields(formFields)}
        {error && <div className="warning_text error_text">{error}</div>}
      </div>
      <Button
        label={BUTTON}
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'EmailRequestForm',
})(Form);
