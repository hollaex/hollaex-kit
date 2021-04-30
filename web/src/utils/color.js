import Color from 'color';
import light from 'config/colors/light';

export const getColorByKey = (key, content = light) => {
	return content[key];
};

export const calculateThemes = (themes) => {
	const calculatedThemes = {};

	Object.entries(themes).forEach(([themeKey, themeData]) => {
		calculatedThemes[themeKey] = pushCalculatedColors(themeData);
	});

	return calculatedThemes;
};

const pushCalculatedColors = (themeData) => {
	const base_color = Color(themeData['base_background']);

	const calculatedColors = {
		calculated_footer_border: Color(themeData['base_footer']).isLight()
			? '#00000026'
			: '#ffffff26',
		'calculated_important-border': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.7)
			.string(),
		'calculated_secondary-border': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.33)
			.string(),
		'calculated_secondary-border-1': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.15)
			.string(),
		'calculated_super-pale_label-text-graphics': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.15)
			.string(),
		'calculated_market-card_gradient_background': base_color.isLight()
			? base_color.darken(0.05).hex()
			: base_color.darken(0.4).hex(),
		'calculated_trading_buying-sparkline-fill': Color(
			themeData['trading_buying-related-elements']
		)
			.alpha(0.3)
			.string(),
		'calculated_trading_selling-sparkline-fill': Color(
			themeData['trading_selling-related-elements']
		)
			.alpha(0.3)
			.string(),
		'calculated_trading_buying-orderbook-bar': Color(
			themeData['trading_buying-related-elements']
		)
			.alpha(0.12)
			.string(),
		'calculated_trading_selling-orderbook-bar': Color(
			themeData['trading_selling-related-elements']
		)
			.alpha(0.12)
			.string(),
		'calculated_trading_buying-orderbook-best-bar': Color(
			themeData['trading_buying-related-elements']
		)
			.alpha(0.55)
			.string(),
		'calculated_trading_selling-orderbook-best-bar': Color(
			themeData['trading_selling-related-elements']
		)
			.alpha(0.55)
			.string(),
		'calculated_trading_buying-orderbook-hover': Color(
			themeData['trading_buying-related-elements']
		)
			.alpha(0.65)
			.string(),
		'calculated_trading_selling-orderbook-hover': Color(
			themeData['trading_selling-related-elements']
		)
			.alpha(0.65)
			.string(),
		'calculated_trading-orderbook-text': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.8)
			.string(),
		'calculated_trading-orderbook-secondary-text': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.5)
			.string(),
		'calculated_trading_buying-related-text': Color(
			themeData['trading_buying-related-elements']
		).isLight()
			? 'black'
			: 'white',
		'calculated_trading_selling-related-text': Color(
			themeData['trading_selling-related-elements']
		).isLight()
			? 'black'
			: 'white',
		'calculated_base_modal-overlay': Color(themeData['base_background'])
			.alpha(0.75)
			.string(),
		calculated_landing_background: Color(themeData['base_background'])
			.alpha(0)
			.string(),
		calculated_landing_markets_table: Color(
			themeData['base_wallet-sidebar-and-popup']
		)
			.alpha(0.94)
			.string(),
		'calculated_specials_highlight-box': Color(
			themeData['specials_buttons-links-and-highlights']
		)
			.alpha(0.2)
			.string(),
		'calculated_base_top-bar-navigation_text': Color(
			themeData['base_top-bar-navigation']
		).isLight()
			? 'black'
			: 'white',
		'calculated_base_top-bar-navigation_text-inactive': Color(
			themeData['base_top-bar-navigation']
		).isLight()
			? '#00000099'
			: '#ffffff99',
		calculated_base_footer_text: Color(themeData['base_footer']).isLight()
			? 'black'
			: 'white',
		'calculated_trad-view_watermark': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.15)
			.string(),
		'calculated_trad-view_axis': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.3)
			.string(),
		'calculated_trad-view_text': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.7)
			.string(),
		'calculated_specials_notifications-alerts-inactive': Color(
			themeData['specials_notifications-alerts-warnings']
		)
			.alpha(0.75)
			.string(),
		'calculated_specials_notifications-alerts-text': Color(
			themeData['specials_notifications-alerts-warnings']
		).isLight()
			? 'black'
			: 'white',
		'calculated_specials_notifications-pending-text': Color(
			themeData['specials_pending-waiting-caution']
		).isLight()
			? 'black'
			: 'white',
		'calculated_specials_notifications-success-text': Color(
			themeData['specials_checks-okay-done']
		).isLight()
			? 'black'
			: 'white',
	};

	return { ...themeData, ...calculatedColors };
};

const allowedColorKeys = Object.keys(light);

export const filterThemes = (themes) => {
	const filteredThemes = {};

	Object.entries(themes).forEach(([themeKey, themeData]) => {
		filteredThemes[themeKey] = filterTheme(themeData);
	});

	return filteredThemes;
};

export const filterTheme = (theme) => {
	const filteredTheme = Object.keys(theme)
		.filter((key) => allowedColorKeys.includes(key))
		.reduce((obj, key) => {
			obj[key] = theme[key];
			return obj;
		}, {});

	return filteredTheme;
};

export const CALCULATED_COLOR_RATIO_OBJECT = {
	'base_top-bar-navigation': 1,
	'base_secondary-navigation-bar': 0.1,
	'base_wallet-sidebar-and-popup': 0,
	base_footer: 1,
};

export const CALCULATED_COLOR_KEYS = Object.keys(CALCULATED_COLOR_RATIO_OBJECT);

export const calculateBaseColors = (
	base_background,
	isDarken = true,
	baseRatios = CALCULATED_COLOR_RATIO_OBJECT
) => {
	const baseColors = {
		base_background,
	};

	const mode = isDarken ? 'darken' : 'lighten';

	Object.entries(baseRatios).forEach(([colorKey, value]) => {
		baseColors[colorKey] = Color(base_background)[mode](value).hex();
	});

	return baseColors;
};
