import { THEMES, THEME_DEFAULT } from '../config/constants';

export const getTheme = (theme = '') => {
	const indexOfTheme = THEMES.indexOf(theme);
	if (indexOfTheme > -1) {
		return THEMES[indexOfTheme];
	}
	return THEME_DEFAULT;
};

export const getThemeClass = (theme = '') => {
  return `${getTheme(theme)}-theme`;
}
