import merge from 'lodash.merge';
import defaultThemes from 'config/colors';
import Color from 'color';

const ThemeBuilder = (activeTheme, themes, coins) => {
	const element = document.documentElement;
	const mergedThemes = merge({}, defaultThemes, themes);
	const classes = [];

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
					const textColor = Color(color).isLight() ? '#000000' : '#ffffff';

					classes.push(
						`.chart_${key} {fill: ${color}; stroke: ${color};} .currency_ball-${key} {background-color: ${color}; color: ${textColor}; border: none !important;}`
					);
				}
			});
		}

		let style = document.getElementById('dynamic_coin_colors');
		if (!style) {
			style = document.createElement('style');
			style.id = 'dynamic_coin_colors';
			style.type = 'text/css';
		}

		style.innerHTML = classes.join('\n');
		document.getElementsByTagName('head')[0].appendChild(style);
	}
};

export default ThemeBuilder;
