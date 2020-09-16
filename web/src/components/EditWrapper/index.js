import React from 'react';

const EditWrapper = ({ children, stringId, position = [] }) => {

  const [x = 5, y = 0] = position;
  const styles = {
    transform: `translate(${x}px, ${y}px)`
  };

  return (
    <div className="edit-wrapper__container">
      {children}
      {
        stringId && (
          <div
            className="edit-wrapper__icon-wrapper"
            data-string-id={stringId}
            style={styles}
          >
            E
          </div>
        )
      }
    </div>
  )
}

export default EditWrapper;