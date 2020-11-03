import React from 'react';
import { ProjectConfig } from './index';

const withConfig = (Component) => {
  return (props) => (
    <ProjectConfig.Consumer>
      {({ defaults, icons, updateIcons, removeIcon, color, updateColor, themeOptions }) => (
        <Component
          {...props}
          defaults={defaults}
          color={color}
          updateColor={updateColor}
          icons={icons}
          updateIcons={updateIcons}
          removeIcon={removeIcon}
          themeOptions={themeOptions}
        />
      )}
    </ProjectConfig.Consumer>
  );
}

export default withConfig;