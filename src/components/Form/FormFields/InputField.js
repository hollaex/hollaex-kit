import React from 'react';

const InputField = ({ input, label, type, placeholder, meta: {touched, invalid, error }, onClick}) => {
  return (
    <div className="input_field" onClick={onClick}>
      <div>{label}</div>
      <div className="input_field-wrapper">
        <input placeholder={placeholder} className="input_field-input" type={type} {...input} />
        <span className={`input_field-outline ${touched && error ? 'error' : ''}`}></span>
      </div>
      {touched && error && <div className="error">{error}</div>}
    </div>
  );
}


export default InputField;
