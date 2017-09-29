import React from 'react';
import classnames from 'classnames';

import { ICONS } from '../../../config/constants';


const InformationMessage = ({ iconPath, text, absolute, className, position }) => (
  <div className={classnames('information_message', 'd-flex', 'justify-content-start', 'align-items-center', { absolute }, className, position)}>
    <img src={iconPath} alt={text} className={classnames('information_message-image')} />
    {text && <span className={classnames('information_message-text')}>{text}</span>}
  </div>
);

const InputField = (props) => {
  const {
    input,
    label,
    type,
    placeholder,
    meta: {touched, invalid, error, active },
    onClick,
    fullWidth = false
  } = props;
  const displayError = touched && error && !active;
  const displayCheck = !fullWidth && input.value && !displayError && !active;
  return (
    <div className={classnames('input_field', { 'with_error': displayError && fullWidth })} onClick={onClick}>
      <div className="input_field-label">{label}</div>
      <div className={classnames('input_field-wrapper', { 'full_width': fullWidth })}>
        <input
          placeholder={placeholder}
          className={classnames('input_field-input', { error: displayError })}
          type={type}
          {...input}
        />
        <span className={classnames('input_field-outline', { error: displayError })}></span>
        {displayCheck &&
          <InformationMessage iconPath={ICONS.BLACK_CHECK} absolute={true} position="right" />
        }
        {displayError && !fullWidth &&
          <InformationMessage className="error" text={error} iconPath={ICONS.RED_WARNING} absolute={true} position={'right'} />
        }
      </div>
      {displayError && fullWidth &&
        <InformationMessage className="error padding" text={error} iconPath={ICONS.RED_WARNING} />
      }
    </div>
  );
}


export default InputField;
