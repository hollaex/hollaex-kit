export const MENU_ITEMS = {
	top: [
		{
			path: '/summary',
			activePaths: ['/summary', '/account'],
			icon_id: 'TAB_SUMMARY',
			string_id: 'ACCOUNTS.TAB_SUMMARY',
		},
		{
			path: '/wallet',
			icon_id: 'TAB_WALLET',
			string_id: 'ACCOUNTS.TAB_WALLET',
		},
		{
			path: '/transactions',
			icon_id: 'TAB_HISTORY',
			string_id: 'ACCOUNTS.TAB_HISTORY',
		},
		{
			path: '/security',
			icon_id: 'TAB_SECURITY',
			string_id: 'ACCOUNTS.TAB_SECURITY',
		},
		{
			path: '/verification',
			icon_id: 'TAB_VERIFY',
			string_id: 'ACCOUNTS.TAB_VERIFICATION',
		},
		{
			path: '/settings',
			icon_id: 'TAB_SETTING',
			string_id: 'ACCOUNTS.TAB_SETTINGS',
		},
	],
	bottom: [
		{
			path: 'help',
			icon_id: 'SIDEBAR_HELP',
			string_id: 'LOGIN.HELP',
		},
		{
			path: 'logout',
			icon_id: 'TAB_SIGNOUT',
			string_id: 'ACCOUNTS.TAB_SIGNOUT',
		},
	],
};
