import React from 'react';
import classnames from 'classnames';
import FieldWrapper from './FieldWrapper';
import { FieldError } from './FieldWrapper';

const InputField = (props) => {
  const {
    input,
    label,
    ...rest
  } = props;
  console.log('REST', props)
  return (
    <FieldWrapper
      hideUnderline={true}
      className={classnames(
        'checkfield-wrapper',
        'd-flex',
        'flex-column',
      )}
      {...rest}
    >
      <div
        className={classnames(
          'checkfield-input-wrapper',
          'd-flex',
          'align-items-center',
        )}
      >
        <input
          {...rest}
          {...input}
          className="checkfield-input"
        />
        {typeof label === 'string' ?
          <div className="checkfield-label field-label">{label}</div> :
          label
        }
      </div>
    </FieldWrapper>
  );
}


export default InputField;
