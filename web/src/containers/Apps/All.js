import React from 'react';
import { IconTitle, EditWrapper, Table } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const data = [
	{
		id: 0,
		name: 'Name of the app',
		description: 'App description short sentence here',
	},
];

const generateHeaders = () => {
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
			label: '',
			key: 'name',
		},
	];
};

const All = ({ icons: ICONS }) => {
	return (
		<div>
			<div className="settings-form-wrapper">
				<div className="settings-form">
					<IconTitle
						stringId="USER_APPS.ALL_APPS.TITLE"
						text={STRINGS['USER_APPS.ALL_APPS.TITLE']}
						textType="title"
						iconPath={ICONS['APPS_ALL']}
					/>
					<div>
						<EditWrapper stringId="USER_APPS.ALL_APPS.SUBTITLE">
							{STRINGS['USER_APPS.ALL_APPS.SUBTITLE']}
						</EditWrapper>
					</div>
					<Table
						rowClassName="pt-2 pb-2"
						headers={generateHeaders()}
						count={data.length}
						data={data}
						rowKey={({ id }) => id}
					/>
				</div>
			</div>
		</div>
	);
};

export default withConfig(All);
