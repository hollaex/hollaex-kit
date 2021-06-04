import { render } from 'react-dom';

export const injectPlugin = (component, targetId) => {
	const targetElement = document.getElementById(targetId);
	if (targetElement) {
		render(component, targetElement);
	} else {
		console.error(`There is no DOM element with the id ${targetId}`);
	}
};

const getPluginNameByType = (type) => {
	switch (type) {
		case 'phone':
			return 'sms';
		default:
			return type;
	}
};

export const mapPluginsTypeToName = (enabledPluginsTypes = []) =>
	enabledPluginsTypes
		.filter((type) => !!type)
		.map((type) => getPluginNameByType(type));
