import merge from 'lodash.merge';
import defaultThemes from 'config/colors';

const ThemeBuilder = (activeTheme, themes, coins) => {
	const element = document.documentElement;
	const mergedThemes = merge({}, defaultThemes, themes);

	if (element) {
		const themeData = mergedThemes[activeTheme];
		if (themeData && Object.keys(themeData)) {
			Object.keys(themeData).forEach((name) => {
				element.style.setProperty(`--${name}`, themeData[name]);
			});
		}

		if (coins && Object.keys(coins)) {
			Object.entries(coins).forEach(([key, { meta: { color } = {} }]) => {
				if (color) {
					element.style.setProperty(`--coin-${key}`, color);
				}
			});
		}
	}
};

export default ThemeBuilder;
