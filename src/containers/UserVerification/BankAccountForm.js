import React from 'react';
import { FieldArray, Field, reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import FormValues from './BankAccountFormValues';
import UpgradeWarning from './UpgradeWarning';
import { TEXTS } from './constants';

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid, initialValues } = props;
  return (
    <form onSubmit={handleSubmit} className="user_verification-form">
      <UpgradeWarning />
      {renderFields(FormValues)}
      {error && <div className="warning_text">{error}</div>}
      <Button
        label={TEXTS.BANK_ACCOUNT_FORM.BUTTON}
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'BankAccountForm',
})(Form);
