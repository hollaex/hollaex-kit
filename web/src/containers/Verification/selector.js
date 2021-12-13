import { createSelector } from 'reselect';
import { globalize, generateDynamicTarget } from 'utils/id';

const getPlugins = (state) => state.app.plugins;

const getMetaByType = (web_view = [], type) => {
	const view = web_view.find(
		({ meta }) => meta && meta.is_verification_tab && meta.type === type
	);
	return !!view ? view.meta : {};
};

export const verificationTabsSelector = createSelector(
	[getPlugins],
	(plugins = []) => {
		const verificationsTabs = {};

		plugins.forEach(({ name, web_view = [] }) => {
			if (
				web_view &&
				web_view.length &&
				web_view.filter(({ meta }) => meta && meta.is_verification_tab).length
			) {
				const homeMeta = getMetaByType(web_view, 'home');

				verificationsTabs[name] = {
					home: {
						target: generateDynamicTarget(name, 'verification', 'home'),
						icon_id: globalize(name)(homeMeta.icon),
						string_id: globalize(name)(homeMeta.string),
					},
					verification: {
						target: generateDynamicTarget(name, 'verification', 'verification'),
					},
				};
			}
		});

		return verificationsTabs;
	}
);
