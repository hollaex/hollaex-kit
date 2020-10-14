import React from 'react';
import { EditContext } from './index';

const withEdit = (Component) => {
  return (props) => (
    <EditContext.Consumer>
      {({ isEditMode, handleEditMode }) => (
        <Component
          {...props}
          isEditMode={isEditMode}
          handleEditMode={handleEditMode}
        />
      )}
    </EditContext.Consumer>
  );
}

export default withEdit;