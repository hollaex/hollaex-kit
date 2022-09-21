import React from 'react';
import { Field } from 'redux-form';
import { getFormFieldComponentByType } from 'hollaex-web-lib';

const renderFields = (fields = {}, callback) => {
  return (
		<div>
      {Object.keys(fields).map((key, index) => {
        const { type, validate = [], ishorizontalfield, ...rest } = fields[key];
        const commonProps = {
          callback,
          key,
          name: key,
          type,
          validate,
          ishorizontalfield,
          ...rest,
        };

        const component = getFormFieldComponentByType(type);
        return (<Field component={component} {...commonProps} />)
      })}
		</div>
  );
};

export default renderFields;
