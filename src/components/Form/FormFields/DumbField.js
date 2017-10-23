import React from 'react';
import FieldWrapper, { FieldContent } from './FieldWrapper';

const DumbField = ({ label, value, ...rest }) => {
  const props = {
    label,
    hideUnderline: true
  };

  return (
    <FieldWrapper className="dumb-field-wrapper" {...rest}>
      <FieldContent {...props}>
        {value}
      </FieldContent>
    </FieldWrapper>
  )
}

export default DumbField;
