import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { openContactForm } from 'actions/appActions';
import { IconTitle, HeaderSection, EditWrapper, SmartTarget } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { generateDynamicTarget } from 'utils/id';
import { userAppsSelector } from 'containers/Apps/utils';

const Index = ({ openContactForm, icons: ICONS, router, userApps }) => {
	const [mounted, setMounted] = useState(false);
	const goBack = () => router.push('/apps');

	const {
		params: { app },
	} = router;

	if (!mounted) {
		if (!app || !userApps.map(({ name }) => name).includes(app)) {
			goBack();
		}
	}

	const id = generateDynamicTarget(app, 'app', 'kit');

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="presentation_container apply_rtl settings_container">
			{!isMobile && (
				<IconTitle
					stringId="ACCOUNTS.TAB_APPS"
					text={STRINGS['ACCOUNTS.TAB_APPS']}
					textType="title"
					iconPath={ICONS['TAB_SETTING']}
					iconId={STRINGS['ACCOUNTS.TAB_APPS']}
				/>
			)}

			<HeaderSection title={app} openContactForm={openContactForm}>
				<div className="header-content">
					<EditWrapper
						stringId="USER_APPS.APP_DETAILS.BACK_TO_APPS,USER_APPS.APP_DETAILS.BACK"
						renderWrapper={(children) => <div>{children}</div>}
					>
						{STRINGS.formatString(
							STRINGS['USER_APPS.APP_DETAILS.BACK_PLACEHOLDER'],
							<span
								className="blue-link underline-text pointer px-1"
								onClick={goBack}
							>
								{STRINGS['USER_APPS.APP_DETAILS.BACK']}
							</span>,
							STRINGS['USER_APPS.APP_DETAILS.BACK_TO_APPS']
						)}
					</EditWrapper>
				</div>
			</HeaderSection>
			<SmartTarget id={id} />
		</div>
	);
};

const mapStateToProps = (state) => ({
	userApps: userAppsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Index));
