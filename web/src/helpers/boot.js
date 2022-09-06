import ThemeBuilder from 'helpers/themeBuilder';
import { defaultIconsKey } from 'utils/icon';

const getBooting = () => {
	return document.querySelector('.app-booting');
};

const getRoot = () => {
	return document.getElementById('root');
};

const getLoadingImage = () => {
	return document.getElementById('app-booting-image');
};

export const setLoadingImage = ({ icons }) => {
	const theme = localStorage.getItem('theme');
	getLoadingImage().src =
		icons[theme]['EXCHANGE_LOADER'] ||
		icons[defaultIconsKey]['EXCHANGE_LOADER'];
};

export const setLoadingStyle = ({ color: themes }) => {
	const theme = localStorage.getItem('theme');
	ThemeBuilder(theme, themes);
};

export const showBooting = () => {
	getBooting().style.display = 'flex';
	getRoot().style.display = 'none';
};

export const hideBooting = () => {
	getBooting().style.display = 'none';
	getRoot().style.display = 'block';
};
