import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, func, array } from 'prop-types';
import { Button } from 'antd';
import { upload } from 'actions/operatorActions';
import { DeleteOutlined } from '@ant-design/icons';

class UploadIcon extends Component {

  state = {
    selectedFiles: {},
    loading: false,
  }

  onFileChange = ({ target: { name, files } }) => {
    this.setState(prevState => ({
      ...prevState,
      selectedFiles: {
        ...prevState.selectedFiles,
        [name]: files[0],
      }
    }))
  };

  handleSave = async () => {
    const { onSave } = this.props;
    const { selectedFiles } = this.state;
    const icons = {};

    this.setState({
      loading: true,
    });

    for (const key in selectedFiles) {
      if (selectedFiles.hasOwnProperty(key)) {
        const file = selectedFiles[key];
        if (file) {
          const formData = new FormData();

          formData.append('name', key);
          formData.append('file', file);

          const path = await upload(formData)
          icons[key] = path;
        }
      }
    }

    this.setState({
      loading: false
    });

    onSave(icons);
  }

  render() {
    const { isOpen, onCloseDialog, editId, onReset } = this.props;
    const { loading } = this.state;

    return (
      <Modal
        isOpen={isOpen}
        label="operator-controls-modal"
        className="operator-controls__modal"
        disableTheme={true}
        onCloseDialog={onCloseDialog}
        shouldCloseOnOverlayClick={!loading}
        showCloseText={!loading}
        bodyOpenClassName="operator-controls__modal-open"
      >
        <div className="operator-controls__all-strings-header">
          <div className="operator-controls__modal-title">
            Upload Icon
          </div>
        </div>
        <div className="pt-4">
          {editId.map((id) => (
            <div key={id} className="pb-1">
              <input
                name={id}
                type="file"
                accept="image/*"
                style={{ width: '232px' }}
                onChange={this.onFileChange}
              />
              <Button
                ghost
                shape="circle"
                size="small"
                disabled={loading}
                className="operator-controls__all-strings-settings-button"
                onClick={() => onReset(id)}
                icon={<DeleteOutlined />}
              />
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-end pt-3 mt-3">
          <Button
            block
            type="primary"
            className="operator-controls__save-button"
            loading={loading}
            onClick={this.handleSave}
          >
            Save
          </Button>
        </div>
      </Modal>
    );
  }
}

UploadIcon.propTypes = {
  editId: array.isRequired,
  isOpen: bool.isRequired,
  onCloseDialog: func.isRequired,
  onSave: func.isRequired,
}

export default UploadIcon;