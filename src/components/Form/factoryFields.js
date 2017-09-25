import React from 'react';
import { Field } from 'redux-form';
import InputField from './FormFields/InputField';

const renderFields = (fields) => {
  return (
    <div>
      {Object.keys(fields).map((key, index) => {
        const field = fields[key];
        switch (field.type) {
          case 'text':
          case 'password':
          case 'email':
          default:
            return (
              <Field
                key={key}
                name={key}
                component={ InputField }
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
                validate={field.validate || []}
              />
            );
        }
      })}
    </div>
  )
}

export default renderFields;
