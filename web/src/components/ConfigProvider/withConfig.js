import React from 'react';
import { ProjectConfig } from './index';

const withConfig = (Component) => {
	return (props) => (
		<ProjectConfig.Consumer>
			{({
				defaults,
				icons,
				allIcons,
				updateIcons,
				removeIcon,
				color,
				updateColor,
				themeOptions,
				removeTheme,
				updateDefaults,
				sections,
				updateSections,
			}) => (
				<Component
					{...props}
					defaults={defaults}
					color={color}
					updateColor={updateColor}
					icons={icons}
					allIcons={allIcons}
					updateIcons={updateIcons}
					removeIcon={removeIcon}
					themeOptions={themeOptions}
					removeTheme={removeTheme}
					updateDefaults={updateDefaults}
					sections={sections}
					updateSections={updateSections}
				/>
			)}
		</ProjectConfig.Consumer>
	);
};

export default withConfig;
