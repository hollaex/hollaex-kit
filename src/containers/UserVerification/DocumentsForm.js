import React from 'react';
import { FieldArray, Field, reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import FormValues, { information } from './DocumentsFormValues';

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
  const { handleSubmit, submitting, pristine, error, valid, initialValues } = props;

  return (
    <form onSubmit={handleSubmit} className="user_verification-form">
      <div className="warning_text">
        <div>By verifing your identity you can obtain the following:</div>
        <ul>
          <li>Increased withdrawal limits</li>
          <li>Increased deposits limits</li>
          <li>Lower fees</li>
        </ul>
      </div>
      {Object.entries(FormValues).map(([key, value], index) => (
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
        label="Submit Verification Request"
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'DocumentsForm',
})(Form);
