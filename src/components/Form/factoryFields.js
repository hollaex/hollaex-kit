import React from 'react';
import { Field } from 'redux-form';
import InputField from './FormFields/InputField';
import SelectField from './FormFields/SelectField';
import FileField from './FormFields/FileField';

const renderFields = (fields) => {
  return (
    <div>
      {Object.keys(fields).map((key, index) => {
        const field = fields[key];
        switch (field.type) {
          case 'file':
            return (
              <Field
                key={key}
                name={key}
                component={ FileField }
                type={field.type}
                label={field.label}
                validate={field.validate || []}
              />
            );
          case 'select':
            return (
              <Field
                key={key}
                name={key}
                component={ SelectField }
                type={field.type}
                label={field.label}
                validate={field.validate || []}
                options={field.options || []}
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
