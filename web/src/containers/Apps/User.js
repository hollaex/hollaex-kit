import React from 'react';
import { IconTitle, EditWrapper, Table } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { withRouter } from 'react-router';

const data = [
	{
		id: 0,
		name: 'Name of the app',
		description: 'App description short sentence here',
	},
];

const generateHeaders = (goToDetails) => {
	return [
		{
			stringId: 'USER_APPS.TABLE.APP_NAME',
			label: STRINGS['USER_APPS.TABLE.APP_NAME'],
			key: 'name',
		},
		{
			stringId: 'USER_APPS.TABLE.DESCRIPTION',
			label: STRINGS['USER_APPS.TABLE.DESCRIPTION'],
			key: 'description',
		},
		{
			stringId: 'USER_APPS.TABLE.ACTION',
			label: STRINGS['USER_APPS.TABLE.ACTION'],
			renderCell: ({ id, name }, key) => (
				<td key={`${key}-${id}-app`}>
					<span
						className="blue-link underline-text pointer"
						onClick={() => goToDetails(name)}
					>
						{STRINGS['USER_APPS.TABLE.VIEW_APP']}
					</span>
				</td>
			),
		},
	];
};

const User = ({ icons: ICONS, router }) => {
	const goToDetails = (name) => router.push(`apps/details/${name}`);

	return (
		<div>
			<div className="settings-form-wrapper">
				<div className="settings-form">
					<IconTitle
						stringId="USER_APPS.MY_APPS.TITLE"
						text={STRINGS['USER_APPS.MY_APPS.TITLE']}
						textType="title"
						iconPath={ICONS['APPS_USER']}
					/>
					<div>
						<EditWrapper stringId="USER_APPS.MY_APPS.SUBTITLE">
							{STRINGS['USER_APPS.MY_APPS.SUBTITLE']}
						</EditWrapper>
					</div>
					<Table
						rowClassName="pt-2 pb-2"
						headers={generateHeaders(goToDetails)}
						count={data.length}
						data={data}
						rowKey={({ id }) => id}
					/>
				</div>
			</div>
		</div>
	);
};

export default withRouter(withConfig(User));
