import React, { Component } from 'react';
import { ProjectConfig } from 'config/project.config';
import { getIconByKey } from 'utils/icon';

class ConfigProvider extends Component {
  constructor(props) {
    super(props);
    const { initialConfig } = this.props;
    const {
      icons = {},
      defaultLanguage,
      color = {},
    } = { ...initialConfig }

    const themeOptions = Object.keys(color).map((value) => ({ value }))

    this.state = {
      icons,
      color,
      defaultLanguage,
      themeOptions,
    };
  }

  UNSAFE_componentWillUpdate(_, nextState) {
    const { color } = this.state;
    if (JSON.stringify(color) !== JSON.stringify(nextState.color)) {
      const themeOptions = Object.keys(nextState.color).map((value) => ({ value }))
      this.setState({
        themeOptions
      })
    }
  }

  updateIcons = (icons = {}) => {
    this.setState((prevState) => ({
      ...prevState,
      icons: {
        ...prevState.icons,
        ...icons,
      }
    }))
  }

  removeIcon = (key) => {
    const iconObject = { [key]: getIconByKey(key)};
    this.updateIcons(iconObject);
  }

  updateColor = (color = {}) => {
    this.setState((prevState) => ({
      ...prevState,
      color: {
        ...prevState.color,
        ...color,
      }
    }))
  }

  render() {
    const { children } = this.props;
    const { icons, defaultLanguage, color, themeOptions } = this.state;
    const { updateIcons, removeIcon, updateColor } = this;

    return (
      <ProjectConfig.Provider
        value={{
          icons,
          color,
          themeOptions,
          updateIcons,
          updateColor,
          removeIcon,
          defaultLanguage,
        }}
      >
        {children}
      </ProjectConfig.Provider>
    );
  }
}
export default ConfigProvider;