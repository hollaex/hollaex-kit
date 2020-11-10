import defaultIcons from 'config/icons';
import { isLightColor, getColorFromTheme, BASE_BACKGROUND } from 'utils/color';

export const getIconByKey = (key, content = defaultIcons) => {
	return content[key];
};

export const getLogo = (
	theme,
	{ logo_path, logo_black_path, color = {} },
	{ EXCHANGE_LOGO_LIGHT, EXCHANGE_LOGO_DARK },
	key = BASE_BACKGROUND
) => {
	const isLight = isLightColor(getColorFromTheme(key, theme, color));

	if (isLight) {
		return EXCHANGE_LOGO_LIGHT || logo_path;
	} else {
		return EXCHANGE_LOGO_DARK || logo_black_path;
	}
};

const BACKGROUND_ICON_IDS = [
	'EXCHANGE_LOGO_LIGHT',
	'EXCHANGE_LOGO_DARK',
	'LOADER_LIGHT',
	'LOADER_DARK',
	'EXCHANGE_LOGO_LIGHT,EXCHANGE_LOGO_DARK',
	'EXCHANGE_LOGO_DARK,EXCHANGE_LOGO_LIGHT',
	'LOADER_LIGHT,LOADER_DARK',
	'LOADER_DARK,LOADER_LIGHT',
];

export const isBackgroundIcon = (iconId) =>
	BACKGROUND_ICON_IDS.includes(iconId);
