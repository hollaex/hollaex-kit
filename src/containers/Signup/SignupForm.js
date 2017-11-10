import React from 'react';
import { reduxForm } from 'redux-form';
import { required, password, email, requiredWithCustomMessage } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import { TEXTS } from './constants';

const { FIELDS, BUTTON, VALIDATIONS } = TEXTS.FORM;

const FormValues = {
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
    validate: [required, password],
    fullWidth: true,
    ...FIELDS.password_repeat,
  },
  terms: {
    type: 'checkbox',
    fullWidth: true,
    validate: [requiredWithCustomMessage(VALIDATIONS.ACCEPT_TERMS)],
    ...FIELDS.terms,
  }
};

const validate = (values) => {
  const { password, password_repeat } = values;
  const errors = {};

  if (password && password_repeat && password !== password) {
    errors.password_reset = VALIDATIONS.PASSWORDS_DONT_MATCH;
  }

  return errors;
}
const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid } = props;
  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="w-100">
        {renderFields(FormValues)}
        {error && <div className="warning_text">{error}</div>}
      </div>
      <Button
        label={BUTTON}
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'SignForm',
  validate,
})(Form);
