import { createSelector } from 'reselect';

const getPlugins = (state) => state.app.plugins;
const getUserApps = (state) => state.user.settings.apps || [];
export const appsSelector = createSelector([getPlugins], (plugins) =>
	plugins.filter(
		({ web_view }) =>
			web_view &&
			web_view.some(({ meta: { is_app, type } }) => is_app && type === 'kit')
	)
);

export const userAppsSelector = createSelector(
	[getUserApps, appsSelector],
	(user_apps, apps) => {
		return apps.filter(({ name }) => user_apps.includes(name));
	}
);

export const isEnabled = (app, apps) => apps.includes(app);
