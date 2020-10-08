import React from 'react';
import { ProjectConfig } from 'config/project.config';

const withConfig = (Component) => {
  return (props) => (
    <ProjectConfig.Consumer>
      {config => <Component {...props} configuration={config} />}
    </ProjectConfig.Consumer>
  );
}

export default withConfig;