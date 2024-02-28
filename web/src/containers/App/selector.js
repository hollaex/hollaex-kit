import { isMobile } from 'react-device-detect';
import { createSelector } from 'reselect';
import { MENU_ITEMS } from 'config/menu';
import { STAKING_INDEX_COIN, isStakingAvailable } from 'config/contracts';

const getConstants = (state) => state.app.constants;
const getRemoteRoutes = (state) => state.app.remoteRoutes;
const getContracts = (state) => state.app.contracts;
const getToken = (state) => state.auth.token;

export const menuItemsSelector = createSelector(
	[getConstants, getRemoteRoutes, getContracts, getToken],
	(constants = {}, remoteRoutes = [], contracts = {}, token) => {
		const { features = {} } = constants;
		let featureItems = MENU_ITEMS.features
			.filter(
				({ id }) =>
					id !== 'stake_page' ||
					(id === 'stake_page' &&
						(features.cefi_stake ||
							isStakingAvailable(STAKING_INDEX_COIN, contracts)))
			)
			.map(
				({
					id,
					hide_from_appbar,
					hide_from_sidebar,
					hide_from_menulist,
					hide_from_bottom_nav,
					...rest
				}) => {
					const item = {
						...rest,
						hide_from_appbar: hide_from_appbar || !features[id],
						hide_from_sidebar: hide_from_sidebar || !features[id],
						hide_from_menulist: hide_from_menulist || !features[id],
						hide_from_bottom_nav: hide_from_bottom_nav || !features[id],
					};

					if (
						id === 'stake_page' &&
						(hide_from_menulist || features.cefi_stake)
					) {
						item.hide_from_menulist = false;
						item.hide_from_sidebar = false;
					}
					return item;
				}
			);

		if (features.quick_trade && features.pro_trade) {
			featureItems.push({
				id: 'trade_tab',
				path: '/trade',
				icon_id: 'SIDEBAR_TRADING_ACTIVE',
				string_id: 'ACCOUNTS.TAB_TRADE',
				hide_from_sidebar: true,
				hide_from_bottom_nav: false,
			});
			const updatedItems = featureItems.filter(
				({ string_id }) =>
					string_id !== 'QUICK_TRADE' && string_id !== 'PRO_TRADE'
			);
			featureItems = updatedItems;
		}

		if (!features.quick_trade && !features.pro_trade) {
			const updatedItems = featureItems.filter(
				({ string_id }) =>
					string_id !== 'QUICK_TRADE' && string_id !== 'PRO_TRADE'
			);
			featureItems = updatedItems;
		}

		const menuItems = isMobile
			? remoteRoutes && remoteRoutes.length
				? [
						...MENU_ITEMS.top,
						...featureItems,
						MENU_ITEMS.middle[0],
						remoteRoutes[0],
						...(token ? MENU_ITEMS.bottom : []),
				  ]
				: [
						...MENU_ITEMS.top,
						...featureItems,
						...MENU_ITEMS.middle,
						...(token ? MENU_ITEMS.bottom : []),
				  ]
			: [
					...MENU_ITEMS.top,
					...featureItems,
					...MENU_ITEMS.middle,
					...remoteRoutes,
					...(token ? MENU_ITEMS.bottom : []),
			  ];

		return menuItems;
	}
);
