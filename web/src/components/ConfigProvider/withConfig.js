import React from 'react';
import { ProjectConfig } from 'config/project.config';

const withConfig = (Component) => {
  return (props) => (
    <ProjectConfig.Consumer>
      {({ icons, updateIcons, removeIcon, defaultLanguage }) => (
        <Component
          {...props}
          icons={icons}
          updateIcons={updateIcons}
          removeIcon={removeIcon}
          defaultLanguage={defaultLanguage}
        />
      )}
    </ProjectConfig.Consumer>
  );
}

export default withConfig;