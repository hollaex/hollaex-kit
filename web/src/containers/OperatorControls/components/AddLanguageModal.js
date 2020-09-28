import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, array, func } from 'prop-types';
import { Select, Button } from 'antd';


const { Option } = Select;

class AddLanguageModal extends Component {
  constructor(props) {
    super(props);

    const { languages } = this.props;

    this.state = {
      selectedLanguage: languages[0].value
    }
  }

  handleSelect = (selectedLanguage) => {
    this.setState({ selectedLanguage });
  }

  addLanguage = () => {
    const { selectedLanguage } = this.state;
    const { onSave } = this.props;

    onSave(selectedLanguage);
  }

  render() {
    const { isOpen, onCloseDialog, languages } = this.props;
    const { selectedLanguage } = this.state;
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
          value={selectedLanguage}
          style={{ width: 120 }}
          bordered={false}
          size="default"
          onSelect={this.handleSelect}
        >
          {
            languages.map(({ label, value }) => (
              <Option value={value} key={value}>
                {label}
              </Option>
            ))
          }
        </Select>
        <Button
          onClick={this.addLanguage}
        >
          Save
        </Button>
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