import flatten from 'flat';

const options = { safe: true, delimiter: '_' };
export const nestedColors = {
	base: {
		background: '#f8f8f8',
		'top-bar-navigation': '#000000',
		'secondary-navigation-bar': '#e9e9e9',
		'wallet-sidebar-and-popup': '#f8f8f8',
		footer: '#000000',
	},

	labels: {
		'important-active-labels-text-graphics': '#000000',
		'secondary-inactive-label-text-graphics': '#4d4d4d',
		fields: '#dfdfdf',
		'inactive-button': '#cccccc',
	},

	trading: {
		'selling-related-elements': '#ee4036',
		'buying-related-elements': '#00a69c',
	},

	specials: {
		'buttons-links-and-highlights': '#0066b4',
		'chat-messages': '#3b5c4c',
		'my-username-in-chat': '#80a000',
		'checks-okay-done': '#008000',
		'pending-waiting-caution': '#F6921E',
		'notifications-alerts-warnings': '#ed1c24',
	},
};

const color = flatten(nestedColors, options);

export default color;
