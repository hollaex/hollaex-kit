import { createSelector } from 'reselect';

const getPlugins = (state) => state.app.plugins;

export const appsSelector = createSelector([getPlugins], (plugins) =>
	plugins.filter(({ type }) => type === 'app')
);
