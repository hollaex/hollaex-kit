import React from 'react';

const InputField = (props) => {
  console.log(props)
  console.log(props.meta)

  const { input, label, type, placeholder, meta: {touched, invalid, error, active }, onClick} = props
  return (
    <div className="input_field" onClick={onClick}>
      <div>{label}</div>
      <div className="input_field-wrapper">
        <input placeholder={placeholder} className="input_field-input" type={type} {...input} />
        <span className={`input_field-outline ${touched && error ? 'error' : ''}`}></span>
      </div>
      {touched && error && !active && <div className="error">{error}</div>}
    </div>
  );
}


export default InputField;
