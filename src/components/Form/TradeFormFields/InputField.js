import React from 'react';

const InputField = (props) => {
  const {
    input,
    label,
    meta: { touched, error, active },
    currency,
    ...rest,
  } = props;

  return (
    <div className="trade_input-wrapper">
      <div className="trade_input-label">{label}</div>
      <div className="trade_input-input-wrapper">
        <input
          {...input}
          {...rest}
        />
        {currency &&
          <div className="trade_input-input-currency d-flex justify-content-center align-items-center">
            {currency}
          </div>
        }
        {touched && !active && error &&
          <div className="warning_text">{error}</div>
        }
      </div>
    </div>
  );
}


export default InputField;
