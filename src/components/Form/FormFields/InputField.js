import React from 'react';
import classnames from 'classnames';
import InformationMessage from './InformationMessage';
import FieldWrapper from './FieldWrapper';

import { ICONS } from '../../../config/constants';

const InputField = (props) => {
  const {
    input,
    type,
    placeholder,
    meta: { touched, invalid, error, active },
    onClick,
    fullWidth = false,
    information,
    ...rest,
  } = props;
  const displayError = touched && error && !active;
  const displayCheck = !fullWidth && input.value && !displayError && !active;
  return (
    <FieldWrapper {...props}>
      <input
        placeholder={placeholder}
        className={classnames('input_field-input', {
          error: displayError
        })}
        type={type}
        {...input}
        {...rest}
      />
    </FieldWrapper>
  );
}


export default InputField;
