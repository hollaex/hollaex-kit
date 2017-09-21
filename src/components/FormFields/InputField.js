import React from 'react';

const InputField = ({ input, label, type, placeholder, meta: {touched, invalid, error }}) => {
  return (
    <div className="input_field">
      <div>{label}</div>
      <div className="input_field-wrapper">
        <input placeholder={placeholder} className="input_field-input" {...input} />
        <span className={`input_field-outline ${touched && error ? 'error' : ''}`}></span>
      </div>
      {touched && error && <div className="error">{error}</div>}
    </div>
  );
}

InputField.defaultProps = {
  label: 'Label',
  error: 'Error',
  placeholder: 'Placeholder',
  type: 'text'
}

export default InputField;
