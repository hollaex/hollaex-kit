import React from 'react';
import { ProjectConfig } from 'config/project.config';

const withConfig = (Component) => {
  return (props) => (
    <ProjectConfig.Consumer>
      {({ icons, updateIcons, removeIcon, defaultLanguage, color, updateColor, themeOptions }) => (
        <Component
          {...props}
          color={color}
          updateColor={updateColor}
          icons={icons}
          updateIcons={updateIcons}
          removeIcon={removeIcon}
          themeOptions={themeOptions}
          defaultLanguage={defaultLanguage}
        />
      )}
    </ProjectConfig.Consumer>
  );
}

export default withConfig;