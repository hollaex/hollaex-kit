export const MENU_ITEMS = {
	top: [
		{
			path: '/summary',
			activePaths: ['/summary', '/account'],
			icon_id: 'TAB_SUMMARY',
			string_id: 'ACCOUNTS.TAB_SUMMARY',
		},
	],
	features: [
		{
			id: 'pro_trade',
			path: '/trade/add/tabs',
			icon_id: 'SIDEBAR_TRADING_ACTIVE',
			string_id: 'PRO_TRADE',
			hide_from_sidebar: true,
		},
		{
			id: 'quick_trade',
			path: 'quick-trade',
			icon_id: 'QUICK_TRADE_TAB_ACTIVE',
			string_id: 'QUICK_TRADE',
			hide_from_sidebar: true,
		},
	],
	middle: [
		{
			path: '/wallet',
			icon_id: 'TAB_WALLET',
			string_id: 'ACCOUNTS.TAB_WALLET',
		},
		{
			path: '/transactions',
			icon_id: 'TAB_HISTORY',
			string_id: 'ACCOUNTS.TAB_HISTORY',
			hide_from_appbar: true,
		},
		{
			path: '/security',
			icon_id: 'TAB_SECURITY',
			string_id: 'ACCOUNTS.TAB_SECURITY',
			hide_from_appbar: true,
		},
		{
			path: '/verification',
			icon_id: 'TAB_VERIFY',
			string_id: 'ACCOUNTS.TAB_VERIFICATION',
			hide_from_appbar: true,
		},
		{
			path: '/settings',
			icon_id: 'TAB_SETTING',
			string_id: 'ACCOUNTS.TAB_SETTINGS',
			hide_from_appbar: true,
		},
	],
	bottom: [
		{
			path: 'help',
			icon_id: 'SIDEBAR_HELP',
			string_id: 'LOGIN.HELP',
			hide_from_appbar: true,
		},
		{
			path: 'logout',
			icon_id: 'TAB_SIGNOUT',
			string_id: 'ACCOUNTS.TAB_SIGNOUT',
			hide_from_appbar: true,
		},
	],
};
