import React, { Component } from 'react';
import classnames from 'classnames';
import { EditFilled } from '@ant-design/icons';

class OperatorControls extends Component {

  state = {
    isEditModeOn: false,
    editType: null,
    editableElementIds: [],
  }

  componentDidMount() {
    this.setupAdminListeners();
  }

  componentWillUnmount() {
    this.removeAdminListeners()
  }


  setupAdminListeners = () => {
    const hasEditPermission = this.getEditPermission();
    if (hasEditPermission) {
      window.addEventListener('click', this.handleEditButton);
    }
  }

  removeAdminListeners = () => {
    const hasEditPermission = this.getEditPermission();
    if (hasEditPermission) {
      window.removeEventListener('click', this.handleEditButton);
    }
  }

  getEditPermission = () => {
    return true
  }

  handleEditButton = ({ target: { dataset = {} } }) => {
    const { isEditModeOn } = this.state;
    const { stringId } = dataset;

    if(isEditModeOn) {
      console.log('dataset', dataset);
      const string_ids_array = stringId ? stringId.split(',') : []
      this.setState({
        editableElementIds: string_ids_array,
      })
    }
  }

  toggleEditMode = () => {
    this.setState(prevState => ({
      ...prevState,
      isEditModeOn: !prevState.isEditModeOn,
    }))
  }

  render() {
    const { isEditModeOn } = this.state;

    return (
      <div
        className={classnames("operator-controls__wrapper", { open: isEditModeOn })}
      >
        <div
          className="operator-controls__button"
          onClick={this.toggleEditMode}
        >
          <EditFilled />
          <span className="pl-1">
            {`${ isEditModeOn ? 'Exit' : 'Enter' } edit mode`}
          </span>
        </div>
        <div className="operator-controls__panel" />
      </div>
    );
  }
}

export default OperatorControls;