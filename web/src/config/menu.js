import { isMobile } from 'react-device-detect';

export const MENU_ITEMS = {
	top: [
		{
			path: '/summary',
			activePaths: ['/summary', '/account'],
			icon_id: 'TAB_SUMMARY',
			string_id: 'ACCOUNTS.TAB_SUMMARY',
			hide_from_bottom_nav: true,
		},
		{
			path: '/account',
			activePaths: [
				'/summary',
				'/account',
				'/security',
				'/verification',
				'/settings',
			],
			icon_id: `${isMobile ? 'FOOTER_ACCOUNT_LINE' : 'ACCOUNT_LINE'}`,
			string_id: 'ACCOUNT_TEXT',
			hide_from_appbar: true,
			hide_from_sidebar: true,
			hide_from_menulist: true,
			hide_from_bottom_nav: false,
		}
	],
	features: [
		{
			id: 'pro_trade',
			path: '/markets',
			icon_id: `${
				isMobile ? 'FOOTER_TRADING_ACTIVE' : 'SIDEBAR_TRADING_ACTIVE'
			}`,
			string_id: 'SUMMARY.MARKETS',
			hide_from_sidebar: true,
			hide_from_bottom_nav: false,
			hide_from_menulist: true
		},
		{
			id: 'quick_trade',
			path: 'quick-trade',
			icon_id: 'FOOTER_QUICK_ACTIVE',
			string_id: 'CONVERT',
			hide_from_sidebar: true,
			hide_from_bottom_nav: false,
			hide_from_menulist: true
		},
		{
			id: 'stake_page',
			path: '/stake',
			icon_id: 'TAB_STAKE',
			string_id: 'ACCOUNTS.TAB_STAKE',
			hide_from_appbar: true,
			hide_from_bottom_nav: true,
		},
		{
			id: 'apps',
			path: '/apps',
			icon_id: 'TAB_APPS',
			string_id: 'ACCOUNTS.TAB_APPS',
			hide_from_bottom_nav: true,
		},
		{
			id: 'chat',
			path: '/chat',
			icon_id: 'CHAT',
			string_id: 'USER_SETTINGS.TITLE_CHAT',
			hide_from_appbar: true,
			hide_from_sidebar: true,
			hide_from_menulist: true,
			hide_from_bottom_nav: true,
		},
	],
	middle: [
		{
			path: '/wallet',
			icon_id: `${isMobile ? 'WALLET_FOOTER' : 'TAB_WALLET'}`,
			string_id: 'ACCOUNTS.TAB_WALLET',
			hide_from_appbar: false
		},
		{
			path: '/transactions',
			icon_id: 'TAB_HISTORY',
			string_id: 'ACCOUNTS.TAB_HISTORY',
			hide_from_appbar: true,
			hide_from_bottom_nav: true,
		},
		{
			path: '/security',
			icon_id: 'TAB_SECURITY',
			string_id: 'ACCOUNTS.TAB_SECURITY',
			hide_from_appbar: true,
			hide_from_bottom_nav: true,
		},
		{
			path: '/verification',
			icon_id: 'TAB_VERIFY',
			string_id: 'ACCOUNTS.TAB_VERIFICATION',
			hide_from_appbar: true,
			hide_from_bottom_nav: true,
		},
		{
			id: 'prices',
			path: '/prices',
			icon_id: 'FOOTERBAR_ASSETS_TRADE',
			string_id: 'HOLLAEX_TOKEN.PRICES.TITLE',
			hide_from_sidebar: true,
			hide_from_appbar: false,
			hide_from_menulist: true,
			hide_from_bottom_nav: false,
		},
	],
	bottom: [
		{
			path: '/settings',
			icon_id: 'TAB_SETTING',
			string_id: 'ACCOUNTS.TAB_SETTINGS',
			hide_from_appbar: true,
			hide_from_bottom_nav: true,
		},
		{
			path: 'help',
			icon_id: 'SIDEBAR_HELP',
			string_id: 'LOGIN.HELP',
			hide_from_appbar: true,
			hide_from_bottom_nav: true,
		},
		{
			path: 'logout',
			icon_id: 'TAB_SIGNOUT',
			string_id: 'ACCOUNTS.TAB_SIGNOUT',
			hide_from_appbar: true,
			hide_from_bottom_nav: true,
		},
	],
};