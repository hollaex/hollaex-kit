import flatten from 'flat';

const options = { safe: true, delimiter: '_' };
export const nestedColors = {
	base: {
		background: '#ffffff',
		'top-bar-navigation': '#000000',
		'secondary-navigation-bar': '#2B2B2B',
		'wallet-sidebar-and-popup': '#333333',
		footer: '#000000',
		fields: '#191919',
		'inactive-button': '#535353',
	},

	labels: {
		'important-active-labels-text-graphics': '#000000',
		'secondary-inactive-label-text-graphics': '#808080',
	},

	trading: {
		'selling-related-elements': '#ee4036',
		'buying-related-elements': '#00a69c',
	},

	specials: {
		'buttons-links-and-highlights': '#0066b4',
		'chat-messages': '#98ccb2',
		'my-username-in-chat': '#ffff00',
		'checks-okay-done': '#008000',
		'pending-waiting-caution': '#F6921E',
		'notifications-alerts-warnings': '#ed1c24',
	},
};

const color = flatten(nestedColors, options);

export default color;
