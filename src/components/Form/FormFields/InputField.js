import React from 'react';
import classnames from 'classnames';
import FieldWrapper from './FieldWrapper';

const InputField = (props) => {
  const {
    input,
    type,
    placeholder,
    meta: { touched, error, active },
    onClick,
    fullWidth = false,
    information,
    ...rest,
  } = props;
  const displayError = touched && error && !active;
  // const displayCheck = !fullWidth && input.value && !displayError && !active;
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
