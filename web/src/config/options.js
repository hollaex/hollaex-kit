import STRINGS from 'config/localizedStrings';

export const SIDES = [
	{ value: 'buy', label: STRINGS['SIDES.BUY'] },
	{ value: 'sell', label: STRINGS['SIDES.SELL'] },
];

export const TYPES = [
	{ value: 'market', label: STRINGS['TYPES.MARKET'] },
	{ value: 'limit', label: STRINGS['TYPES.LIMIT'] },
];

export const DEFAULT_TOGGLE_OPTIONS = [
	{ value: true, label: STRINGS['DEFAULT_TOGGLE_OPTIONS.ON'] },
	{ value: false, label: STRINGS['DEFAULT_TOGGLE_OPTIONS.OFF'] },
];

export const MARKET_OPTIONS = [
	{ value: 'List', label: STRINGS['MARKET_OPTIONS.LIST'] },
	{ value: 'Card', label: STRINGS['MARKET_OPTIONS.CARD'] },
];
