import React, { Component } from 'react';
import { ProjectConfig } from 'config/project.config';
import { getIconByKey } from 'utils/icon';

class ConfigProvider extends Component {
  constructor(props) {
    super(props);
    const { initialConfig } = this.props;
    const { icons = {} } = { ...initialConfig }
    this.state = {
      icons
    };
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

  render() {
    const { children } = this.props;
    const { icons } = this.state;
    const { updateIcons, removeIcon } = this;

    return (
      <ProjectConfig.Provider
        value={{
          icons,
          updateIcons,
          removeIcon,
        }}
      >
        {children}
      </ProjectConfig.Provider>
    );
  }
}
export default ConfigProvider;