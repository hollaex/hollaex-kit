import { THEME_DEFAULT, CHAT_STATUS_KEY } from '../config/constants';

export const getTheme = (theme = '') => {
	// const indexOfTheme = THEMES.indexOf(theme);
	// if (indexOfTheme > -1) {
	// 	return THEMES[indexOfTheme];
	// }
	return theme || THEME_DEFAULT;
};

export const getThemeClass = (theme = '') => {
	return `${getTheme(theme)}-theme`;
};

export const getChatMinimized = () => {
	const minimized = localStorage.getItem(CHAT_STATUS_KEY) || false;
	return !!minimized;
};

export const setChatMinimized = (minimized) => {
	localStorage.setItem(CHAT_STATUS_KEY, minimized);
};

export const hasTheme = (theme = '', themes = {}) => {
	const themeKeys = Object.keys(themes);
	return themeKeys.includes(theme);
};
