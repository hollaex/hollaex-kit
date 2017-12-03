import React from 'react';
import { FieldArray, Field, reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import { information } from './DocumentsFormValues';
import UpgradeWarning from './UpgradeWarning';
import { TEXTS } from './constants';

const renderSection = (props) => {
  const { fields, meta: { error, submitFailed }, section } = props
  return (
    <div className="user_verification-form_section">
      {information[section]}
      {renderFields(fields)}
    </div>
  );
}

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid, initialValues, formValues } = props;

  return (
    <form onSubmit={handleSubmit} className="user_verification-form">
      <UpgradeWarning />
      {Object.entries(formValues).map(([key, value], index) => (
        <FieldArray
          key={key}
          name={key}
          component={renderSection}
          fields={value}
          section={key}
        />
      ))}
      {error && <div className="warning_text">{error}</div>}
      <Button
        label={TEXTS.ID_DOCUMENTS_FORM.BUTTON}
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'DocumentsForm',
})(Form);
