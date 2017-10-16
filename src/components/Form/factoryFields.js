import React from 'react';
import { Field } from 'redux-form';
import InputField from './FormFields/InputField';
import FileField from './FormFields/FileField';
import DropdownField from './FormFields/DropdownField';

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
          case 'autocomplete':
            return (
              <Field
                key={key}
                name={key}
                component={ DropdownField }
                {...rest}
                type={type}
                label={label}
                validate={validate || []}
                autocomplete={type === 'autocomplete'}
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
