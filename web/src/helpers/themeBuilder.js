import merge from 'lodash.merge';
import defaultThemes from 'config/colors';
import Color from 'color';

const COIN_SIZES = [
	25 /*cs-13*/,
	4.75 /*cs-12*/,
	3.5 /*cs-11*/,
	3 /*cs-10*/,
	2.5 /*cs-9*/,
	2 /*cs-8*/,
	1.8 /*cs-7*/,
	1.6 /*cs-6*/,
	1.5 /*cs-5*/,
	1.4 /*cs-4*/,
	1.3 /*css-3*/,
	1.2 /*cs-2*/,
	1.1 /*cs-1*/,
].reverse();
const getSizeClass = (index) => `cs-${index + 1}`;

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

		COIN_SIZES.forEach((size, index) => {
			classes.push(
				`.${getSizeClass(index)} { width: ${size}rem; height: ${size}rem; }`
			);
		});

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
