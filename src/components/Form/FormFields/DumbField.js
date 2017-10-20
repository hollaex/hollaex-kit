import React from 'react';
import FieldWrapper, { FieldContent } from './FieldWrapper';

const DumbField = ({ label, value }) => {
  const props = {
    label,
    hideUnderline: true
  };

  return (
    <FieldWrapper>
      <FieldContent {...props}>
        {value}
      </FieldContent>
    </FieldWrapper>
  )
}

export default DumbField;
