import { createSelector } from 'reselect';
import { MENU_ITEMS } from 'config/menu';
import { STAKING_INDEX_COIN, isStakingAvailable } from 'config/contracts';

const getConstants = (state) => state.app.constants;
const getRemoteRoutes = (state) => state.app.remoteRoutes;
const getContracts = (state) => state.app.contracts;

export const menuItemsSelector = createSelector(
	[getConstants, getRemoteRoutes, getContracts],
	(constants = {}, remoteRoutes = [], contracts = {}) => {
		const { features = {} } = constants;
		const featureItems = MENU_ITEMS.features
			.filter(
				({ id }) =>
					id !== 'stake_page' ||
					(id === 'stake_page' &&
						isStakingAvailable(STAKING_INDEX_COIN, contracts))
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
					return item;
				}
			);

		const menuItems = [
			...MENU_ITEMS.top,
			...featureItems,
			...MENU_ITEMS.middle,
			...remoteRoutes,
			...MENU_ITEMS.bottom,
		];

		return menuItems;
	}
);
