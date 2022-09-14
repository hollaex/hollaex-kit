import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { openContactForm } from 'actions/appActions';
import { IconTitle, HeaderSection, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const Index = ({ openContactForm, icons: ICONS, router }) => {
	const {
		params: { app },
	} = router;
	const goBack = () => router.push('/apps');

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
					<div>
						<EditWrapper stringId="USER_APPS.APP_DETAILS.BACK_TO_APPS,USER_APPS.APP_DETAILS.BACK">
							{STRINGS.formatString(
								STRINGS['USER_APPS.APP_DETAILS.BACK_TO_APPS'],
								<span
									className="blue-link underline-text pointer"
									onClick={goBack}
								>
									{STRINGS['USER_APPS.APP_DETAILS.BACK']}
								</span>
							)}
						</EditWrapper>
					</div>
				</div>
			</HeaderSection>
		</div>
	);
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Index));
