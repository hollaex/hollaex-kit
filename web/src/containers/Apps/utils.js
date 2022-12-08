import React from 'react';
import { createSelector } from 'reselect';
import { Help, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';

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
export const isDustEnabled = createSelector([getPlugins], (plugins) =>
	plugins.map(({ name }) => name).includes('dust')
);

export const DustLink = ({ router }) => {
	return (
		<EditWrapper stringId="DUST.TOOLTIP,DUST.LINK">
			<Help tip={STRINGS['DUST.TOOLTIP']}>
				<div
					className="text-underline pointer blue-link"
					onClick={() => router.push('apps/details/dust')}
				>
					{STRINGS['DUST.LINK']}
				</div>
			</Help>
		</EditWrapper>
	);
};
