import { createSelector } from 'reselect';
import { MENU_ITEMS } from 'config/menu';

const getConstants = (state) => state.app.constants;
const getRemoteRoutes = (state) => state.app.remoteRoutes;

export const menuItemsSelector = createSelector(
	[getConstants, getRemoteRoutes],
	(constants = {}, remoteRoutes = []) => {
		const { features = {} } = constants;
		const featureItems = MENU_ITEMS.features.map(
			({
				id,
				hide_from_appbar,
				hide_from_sidebar,
				hide_from_menulist,
				...rest
			}) => {
				const item = {
					...rest,
					hide_from_appbar: hide_from_appbar || !features[id],
					hide_from_sidebar: hide_from_sidebar || !features[id],
					hide_from_menulist: hide_from_menulist || !features[id],
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
