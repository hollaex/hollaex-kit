import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, object, func, string } from 'prop-types';
import { Input, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import initialTheme from 'config/colors/light';
import { getColorByKey } from 'utils/color';
import { filterTheme } from 'utils/color';

class AddTheme extends Component {
  constructor(props) {
    super(props);
    const { themes, selectedTheme: themeKey = '' } = this.props;
    const isEditTheme = !!themeKey
    const theme = themeKey && themes[themeKey] ? themes[themeKey] : initialTheme
    const filteredTheme = filterTheme(theme);

    this.state = {
      isEditTheme,
      themeKey,
      theme: filteredTheme,
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

  isDisabled = () => {
    const { isEditTheme, themeKey } = this.state;
    const { themes } = this.props;
    const themeKeys = Object.keys(themes)

    return !themeKey || (!isEditTheme && themeKeys.includes(themeKey))
  }

  onReset = (name) => {
    const value = getColorByKey(name)
    this.updateTheme(value, name)
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
              <div className="d-flex justify-content-between align-items-center py-1" key={colorKey}>
                <div className="bold">{colorKey.split("_")[1].replace(/-/g, ' ')}</div>
                <div className="d-flex align-items-center">
                  <div
                    className="mr-2"
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '1px solid #322D2D99',
                      borderRadius: '38px',
                      backgroundColor: colorValue,
                    }}
                  />
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
                    onClick={() => this.onReset(colorKey)}
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
            disabled={this.isDisabled()}
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