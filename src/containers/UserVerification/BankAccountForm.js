import React from 'react';
import { FieldArray, Field, reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import UpgradeWarning from './UpgradeWarning';
import STRINGS from '../../config/localizedStrings';

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid, initialValues, formValues } = props;
  return (
    <form onSubmit={handleSubmit} className="user_verification-form">
      <UpgradeWarning />
      {renderFields(formValues)}
      {error && <div className="warning_text">{error}</div>}
      <Button
        label={STRINGS.USER_VERIFICATION.BUTTON}
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'BankAccountForm',
})(Form);
