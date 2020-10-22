import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, object, func, string } from 'prop-types';
import { Input, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { oldLight as initialTheme } from 'config/colors/light';

class AddTheme extends Component {
  constructor(props) {
    super(props);
    const { themes, selectedTheme: themeKey = '' } = this.props;
    const isEditTheme = !!themeKey
    const theme = themeKey && themes[themeKey] ? themes[themeKey] : initialTheme

    this.state = {
      isEditTheme,
      themeKey,
      theme,
    }
  }

  addTheme = () => {
    const { themeKey, theme } = this.state;
    const { onSave } = this.props;

    onSave(themeKey, theme);
  }

  updateTheme = (value, name) => {
    this.setState(prevState => ({
      ...prevState,
      theme: {
        ...prevState.theme,
        [name]: value,
      }
    }));
  }

  handleInputChange = ({ target: { value, name } }) => {
    this.updateTheme(value, name)
  }

  handleThemeKey = ({ target: { value: themeKey }}) => {
    this.setState({
      themeKey,
    });
  }

  render() {
    const { isOpen, onCloseDialog } = this.props;
    const { isEditTheme, themeKey, theme } = this.state;

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
        <div className="operator-controls__all-strings-header">
          <div className="operator-controls__modal-title">
            {`${isEditTheme ? 'Edit' : 'Add'} theme`}
          </div>
        </div>
        <div className="py-4 mb-5 d-flex align-center">
          <div className="bold mr-4">
            Theme:
          </div>
          <Input
            disabled={isEditTheme}
            type="text"
            name="theme-key"
            placeholder="Please enter a theme name"
            className="operator-controls__input mr-5"
            value={themeKey}
            onChange={this.handleThemeKey}
          />
        </div>
        <div>
          {Object.entries(theme).map(([colorKey, colorValue]) => {
            return (
              <div className="d-flex justify-content-between py-1" key={colorKey}>
                <div className="bold">{colorKey}</div>
                <div className="d-flex align-items-center">
                  <Input
                    type="text"
                    name={colorKey}
                    placeholder="Please pick a color"
                    className="operator-controls__input mr-2"
                    value={colorValue}
                    onChange={this.handleInputChange}
                  />
                  <Button
                    ghost
                    shape="circle"
                    size="small"
                    className="operator-controls__all-strings-settings-button"
                    onClick={() => console.log('get default color')}
                    icon={<DeleteOutlined />}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="pt-4">
          <Button
            block
            type="primary"
            size="large"
            className="operator-controls__save-button"
            onClick={this.addTheme}
          >
            Save
          </Button>
        </div>
      </Modal>
    );
  }
}

AddTheme.defaultProps = {
  isOpen: bool.isRequired,
  onCloseDialog: func.isRequired,
  themes: object.isRequired,
  selectedTheme: string.isRequired,
}

export default AddTheme;