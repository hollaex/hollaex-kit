import STRINGS from 'config/localizedStrings';

export const SIDES = [
	{ value: 'buy', label: STRINGS['SIDES.BUY'], className: 'onHoverOpacity' },
	{ value: 'sell', label: STRINGS['SIDES.SELL'], className: 'onHoverOpacity' },
];

export const TYPES = [
	{
		value: 'market',
		label: STRINGS['TYPES.MARKET'],
		className: 'onHoverOpacity',
	},
	{
		value: 'limit',
		label: STRINGS['TYPES.LIMIT'],
		className: 'onHoverOpacity',
	},
];

export const DEFAULT_TOGGLE_OPTIONS = [
	{ value: true, label: STRINGS['DEFAULT_TOGGLE_OPTIONS.ON'] },
	{ value: false, label: STRINGS['DEFAULT_TOGGLE_OPTIONS.OFF'] },
];

export const MARKET_OPTIONS = [
	{ value: 'List', label: STRINGS['MARKET_OPTIONS.LIST'] },
	{ value: 'Card', label: STRINGS['MARKET_OPTIONS.CARD'] },
];
