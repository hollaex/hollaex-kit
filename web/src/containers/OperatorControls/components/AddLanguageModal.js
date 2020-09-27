import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, array, func, string } from 'prop-types';
import { Select, Button } from 'antd';


const { Option } = Select;

class AddLanguageModal extends Component {
  render() {
    const { isOpen, onCloseDialog, languages } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        label="operator-controls-modal"
        className="operator-controls__modal"
        disableTheme={true}
        onCloseDialog={() => onCloseDialog(true)}
        shouldCloseOnOverlayClick={true}
        showCloseText={true}
        bodyOpenClassName="operator-controls__modal-open"
      >
        <Select
          style={{ width: '100px'}}
          bordered={false}
          size="default"
          onSelect={(value) => console.log('value', value)}
        >
          {
            languages.map(({ label, value }) => (
              <Option value={value} key={value}>
                {label}
              </Option>
            ))
          }
        </Select>
      </Modal>
    );
  }
}

AddLanguageModal.defaultProps = {
  isOpen: bool.isRequired,
  onCloseDialog: func.isRequired,
  languages: array.isRequired,
}

export default AddLanguageModal;