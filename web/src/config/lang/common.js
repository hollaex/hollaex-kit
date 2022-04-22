import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';

export default {
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
	TERMS_OF_SERVICES: {
		SERVICE_AGREEMENT: AGREEMENT,
	},
	SIDES: [
		{ value: 'buy' }, // label: 'buy'
		{ value: 'sell' }, // label: 'sell'
	],
	TYPES: [
		{ value: 'market' }, // label: 'market'
		{ value: 'limit' }, // label: 'limit'
	],
	DEFAULT_TOGGLE_OPTIONS: [
		{ value: true }, // label: 'on'
		{ value: false }, // label: 'off'
	],
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false }, // label: 'NO'
		{ value: true }, // label: 'YES'
	],
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white' }, // label: 'White'
		{ value: 'dark' }, // label: 'Dark'
	],
	MARKET_OPTIONS: [
		{ value: 'List' }, // label: 'List'
		{ value: 'Card' }, // label: 'Card'
	],
};
