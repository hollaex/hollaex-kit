import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IconTitle, EditWrapper, Table } from 'components';
import { updateUserSettings, setUserData } from 'actions/userAction';
import { openConfigureApps, closeNotification } from 'actions/appActions';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { withRouter } from 'react-router';
import { userAppsSelector } from './utils';

const generateHeaders = (goToDetails, openConfigs) => {
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
			stringId: 'USER_APPS.TABLE.CONFIGURE',
			label: STRINGS['USER_APPS.TABLE.CONFIGURE'],
			renderCell: ({ name }, key) => (
				<td key={`${key}-${name}-configure`}>
					<span
						className="blue-link underline-text pointer no-wrap"
						onClick={() => openConfigs(name)}
					>
						{STRINGS['USER_APPS.TABLE.CONFIGURE']}
					</span>
				</td>
			),
		},
		{
			stringId: 'USER_APPS.TABLE.ACTION',
			label: STRINGS['USER_APPS.TABLE.ACTION'],
			renderCell: ({ name }, key) => (
				<td key={`${key}-${name}-action`}>
					<span
						className="blue-link underline-text pointer no-wrap"
						onClick={() => goToDetails(name)}
					>
						{STRINGS['USER_APPS.TABLE.VIEW_APP']}
					</span>
				</td>
			),
		},
	];
};

const User = ({
	icons: ICONS,
	router,
	userApps: data,
	settings: { apps = [] },
	setUserData,
	openConfigureApps,
	closeNotification,
}) => {
	const goToDetails = (name) => router.push(`apps/details/${name}`);
	const onRemove = (name) => {
		// send add app request and show toast notification
		const settings = {
			apps: apps.filter((app) => app !== name),
		};
		updateUserSettings(settings)
			.then(({ data }) => {
				setUserData(data);
				closeNotification();
			})
			.catch((err) => console.log('error'));
	};
	const openConfigs = (name) => openConfigureApps(() => onRemove(name));

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
					<div className="py-4">
						<EditWrapper stringId="USER_APPS.MY_APPS.SUBTITLE">
							{STRINGS['USER_APPS.MY_APPS.SUBTITLE']}
						</EditWrapper>
					</div>
					<Table
						showHeaderNoData={true}
						rowClassName="pt-2 pb-2"
						headers={generateHeaders(goToDetails, openConfigs)}
						showAll={true}
						data={data}
						rowKey={({ name }) => name}
						displayPaginator={false}
					/>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	const {
		user: { settings },
	} = state;

	return {
		userApps: userAppsSelector(state),
		settings,
	};
};

const mapDispatchToProps = (dispatch) => ({
	setUserData: bindActionCreators(setUserData, dispatch),
	openConfigureApps: bindActionCreators(openConfigureApps, dispatch),
	closeNotification: bindActionCreators(closeNotification, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withConfig(User)));
