import defaultIcons from 'config/icons';
import merge from 'lodash.merge';

const defaultIconsKey = 'dark';

export const getIconByKey = (
	key,
	theme = defaultIconsKey,
	content = defaultIcons
) => {
	return content[theme][key];
};

const BACKGROUND_ICON_IDS = ['EXCHANGE_LOGO', 'EXCHANGE_LOADER'];

export const isBackgroundIcon = (iconId) =>
	BACKGROUND_ICON_IDS.includes(iconId);

export const generateAllIcons = (themes, icons) => {
	const themeKeys = Object.keys(themes);

	// missing keys and values are set from the default Icons Object
	const defaultIconsObject = icons[defaultIconsKey];

	const allIcons = {};

	themeKeys.forEach((theme) => {
		const themeSpecificIconsObject = icons[theme] || {};
		allIcons[theme] = merge({}, defaultIconsObject, themeSpecificIconsObject);
	});

	return allIcons;
};

export const addDefaultLogo = (defaultLogo, icons) => {
	if (!icons[defaultIconsKey]['EXCHANGE_LOGO']) {
		icons[defaultIconsKey]['EXCHANGE_LOGO'] = defaultLogo;
	}
	return icons;
};

export const getAllIconsArray = (themeKeys, content = defaultIcons) => {
	const allIcons = [];

	Object.keys(content[defaultIconsKey]).forEach((key) => {
		const iconObject = { key };
		themeKeys.forEach((theme) => {
			iconObject[theme] = getIconByKey(key, theme, content);
		});
		allIcons.push(iconObject);
	});

	return allIcons;
};
