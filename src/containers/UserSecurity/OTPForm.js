import React from 'react';
import { reduxForm } from 'redux-form';
import { required } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle } from '../../components';
import { ICONS } from '../../config/constants';

const FormValues = {
  code: {
    type: 'number',
    placeholder: 'Enter your OTP provided by Google Authenticator. Leave blank to keep your current setup.',
    validate: [required],
    fullWidth: true,
  }
};

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid, children } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="otp_form-fields-wrapper">
        {renderFields(FormValues)}
        {error && <div className="warning_text">{error}</div>}
      </div>
      <Button
        label="Enable 2FA"
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'BankAccountForm',
})(Form);
