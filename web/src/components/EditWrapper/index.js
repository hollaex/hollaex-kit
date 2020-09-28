import React from 'react';
import { string, array, object } from 'prop-types';

const EditWrapper = ({ children, stringId, position, style }) => {

  const [x = 5, y = 0] = position;
  const triggerStyles = {
    transform: `translate(${x}px, ${y}px)`
  };

  return (
    <div className="edit-wrapper__container" style={style}>
      {children}
      {
        stringId && (
          <div
            className="edit-wrapper__icon-wrapper"
            data-string-id={stringId}
            style={triggerStyles}
          >
            E
          </div>
        )
      }
    </div>
  )
}

EditWrapper.propTypes = {
  stringId: string.isRequired,
  position: array,
  style: object,
}

EditWrapper.defaultProps = {
  position: [],
  style: {},
}

export default EditWrapper;