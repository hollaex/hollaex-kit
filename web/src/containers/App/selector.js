import { isMobile } from 'react-device-detect';
import { createSelector } from 'reselect';
import { MENU_ITEMS } from 'config/menu';
import { STAKING_INDEX_COIN, isStakingAvailable } from 'config/contracts';
import { MarketsSelector } from 'containers/Trade/utils';

const getConstants = (state) => state.app.constants;
const getRemoteRoutes = (state) => state.app.remoteRoutes;
const getContracts = (state) => state.app.contracts;
const getToken = (state) => state.auth.token;
const getFavourites = (state) => state.app.favourites;
const getMarkets = (state) => MarketsSelector(state);

export const menuItemsSelector = createSelector(
	[
		getConstants,
		getRemoteRoutes,
		getContracts,
		getToken,
		getFavourites,
		getMarkets,
	],
	(
		constants = {},
		remoteRoutes = [],
		contracts = {},
		token,
		getFavourites = {},
		getMarkets = {}
	) => {
		const { features = {} } = constants;
		const featureItems = MENU_ITEMS.features
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
					if (id === 'pro_trade') {
						if (getFavourites && getFavourites.length) {
							item.path = `/trade/${getFavourites[0]}`;
						} else {
							item.path = `/trade/${getMarkets[0]?.key}`;
						}
					}
					return item;
				}
			);

		const menuItems = isMobile
			? [
					...MENU_ITEMS.top,
					...featureItems,
					...MENU_ITEMS.middle,
					...(token ? MENU_ITEMS.bottom : []),
			  ]
			: [
					...MENU_ITEMS.top,
					...MENU_ITEMS.middle,
					...featureItems,
					...remoteRoutes,
					...(token ? MENU_ITEMS.bottom : []),
			  ];

		return menuItems;
	}
);
