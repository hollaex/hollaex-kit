import React from 'react';
import { FieldArray, Field, reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';

const DumbForm = (formName) => {
  const Form = (props) => {
    const { handleSubmit, formValues = {} } = props;
    return (
      <form onSubmit={handleSubmit} className="user_verification-form">
        {renderFields(formValues)}
      </form>
    );
  }

  return reduxForm({
    form: formName,
  })(Form);
}

export default DumbForm;
