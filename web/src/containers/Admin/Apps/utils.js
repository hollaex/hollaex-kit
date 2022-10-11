import { createSelector } from 'reselect';

const getPlugins = (state) => state.app.plugins;

export const appsSelector = createSelector([getPlugins], (plugins) =>
	plugins.filter(
		({ web_view }) =>
			web_view &&
			web_view.some(({ meta: { is_app, type } }) => is_app && type === 'admin')
	)
);
