import React from 'react';
import { reduxForm, reset } from 'redux-form';
import { Button } from '../';
import renderFields from './factoryFields';

const createForm = (formName, otherProps = {}) => {
  const formProperties = {
    form: formName,
    ...otherProps,
  };

  const Form = ({ handleSubmit, submitting, pristine, error, valid, formFields, buttonLabel }) => (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="w-100">
        {renderFields(formFields)}
        {error && <div className="warning_text error_text">{error}</div>}
      </div>
      <Button
        label={buttonLabel}
        disabled={pristine || submitting || !valid}
      />
    </form>
  );

  return reduxForm(formProperties)(Form);
}

export default createForm;
