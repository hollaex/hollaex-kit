import React from 'react';
import { ProjectConfig } from 'config/project.config';

const withConfig = (Component) => {
  return (props) => (
    <ProjectConfig.Consumer>
      {({ icons, updateIcons }) => (
        <Component
          {...props}
          icons={icons}
          updateIcons={updateIcons}
        />
      )}
    </ProjectConfig.Consumer>
  );
}

export default withConfig;