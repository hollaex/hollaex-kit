import React from 'react';
import { reduxForm } from 'redux-form';
import { required, password, email } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';

const FormValues = {
  email: {
    type: 'email',
    label: 'Email',
    placeholder: 'Type your email',
    validate: [required, email],
    fullWidth: true,
  },
  password: {
    type: 'password',
    label: 'Password',
    placeholder: 'Type your password',
    validate: [required, password],
    fullWidth: true,
  }
};

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid } = props;
  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="w-100">
        {renderFields(FormValues)}
        {error && <div className="warning_text">{error}</div>}
      </div>
      <Button
        label="Login"
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'LoginForm',
})(Form);
