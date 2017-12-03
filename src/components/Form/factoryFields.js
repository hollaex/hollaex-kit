import React from 'react';
import { Field } from 'redux-form';
import InputField from './FormFields/InputField';
import FileField from './FormFields/FileField';
import DropdownField from './FormFields/DropdownField';
import DateField from './FormFields/DateField';
import DropdownDateField from './FormFields/DropdownDateField';
import CheckField from './FormFields/CheckField';

const renderFields = (fields) => {
  return (
    <div>
      {Object.keys(fields).map((key, index) => {
        const { type, validate = [], ...rest } = fields[key];
        const commonProps = {
          key,
          name: key,
          type,
          validate,
          ...rest
        };

        switch (type) {
          case 'file':
            return (
              <Field
                component={ FileField }
                {...commonProps}
              />
            );
          case 'select':
          case 'autocomplete':
            return (
              <Field
                component={ DropdownField }
                autocomplete={type === 'autocomplete'}
                {...commonProps}
              />
            );
          case 'date-dropdown':
            return (
              <Field
                component={ DropdownDateField }
                {...commonProps}
              />
            );
          case 'date':
            return (
              <Field
                component={ DateField }
                {...commonProps}
              />
            );
          case 'checkbox':
            return (
              <Field
                component={ CheckField }
                {...commonProps}
              />
            );
          case 'text':
          case 'password':
          case 'email':
          default:
            return (
              <Field
                component={ InputField }
                {...commonProps}
              />
            );
        }
      })}
    </div>
  )
}

export default renderFields;
