import React, { Component } from 'react';
import { ProjectConfig } from 'config/project.config';

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

  render() {
    const { children } = this.props;
    const { icons } = this.state;
    const { updateIcons } = this;

    return (
      <ProjectConfig.Provider
        value={{
          icons,
          updateIcons,
        }}
      >
        {children}
      </ProjectConfig.Provider>
    );
  }
}
export default ConfigProvider;