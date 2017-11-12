import React from 'react';
import { reduxForm } from 'redux-form';
import { required, password, email } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import { TEXTS } from './constants';

const { FIELDS, BUTTON } = TEXTS.FORM;

const FormValues = {
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

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid } = props;
  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="w-100">
        {renderFields(FormValues)}
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
  form: 'LoginForm',
})(Form);
