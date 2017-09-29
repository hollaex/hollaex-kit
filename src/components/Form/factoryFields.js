import React from 'react';
import { Field } from 'redux-form';
import InputField from './FormFields/InputField';
import SelectField from './FormFields/SelectField';
import FileField from './FormFields/FileField';

const renderFields = (fields) => {
  return (
    <div>
      {Object.keys(fields).map((key, index) => {
        const { type, label, validate = [], ...rest } = fields[key];
        switch (type) {
          case 'file':
            return (
              <Field
                key={key}
                name={key}
                component={ FileField }
                {...rest}
                type={type}
                label={label}
                validate={validate}
              />
            );
          case 'select':
            return (
              <Field
                key={key}
                name={key}
                component={ SelectField }
                {...rest}
                type={type}
                label={label}
                validate={validate || []}
              />
            );
          case 'text':
          case 'password':
          case 'email':
          default:
            return (
              <Field
                key={key}
                name={key}
                component={ InputField }
                {...rest}
                type={type}
                label={label}
                validate={validate}
              />
            );
        }
      })}
    </div>
  )
}

export default renderFields;
