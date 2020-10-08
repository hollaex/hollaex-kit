import React, { Component } from 'react';
import { ProjectConfig } from 'config/project.config';

class ConfigProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children, initialConfig } = this.props;
    return (
      <ProjectConfig.Provider value={initialConfig}>
        {children}
      </ProjectConfig.Provider>
    );
  }
}
export default ConfigProvider;