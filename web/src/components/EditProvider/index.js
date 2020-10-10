import React, { Component } from 'react';

export const EditContext = React.createContext()

class EditProvider extends Component {
  state = {
    isEditMode: false,
  };

  handleEditMode = () => {
    this.setState(prevState => ({
      ...prevState,
      isEditMode: !prevState.isEditMode,
    }))
  }

  render() {
    const { isEditMode } = this.state;
    const { children } = this.props;
    const { handleEditMode } = this;

    return (
      <EditContext.Provider
        value={{
          isEditMode,
          handleEditMode,
        }}
      >
        {children}
      </EditContext.Provider>
    );
  }
}

export default EditProvider;