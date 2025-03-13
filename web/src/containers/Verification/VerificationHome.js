import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
	IconTitle,
	HeaderSection,
	CustomTabBar,
	MobileTabBar,
	NotLoggedIn,
	ActionNotification,
	Loader,
} from 'components';
import STRINGS from 'config/localizedStrings';
import { EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import { STATIC_ICONS } from 'config/icons';
import { getMe } from 'actions/userAction';

const VerificationHome = ({
	activeTab,
	tabProps,
	tabs,
	openContactForm,
	setActiveTab,
	renderContent,
	icons: ICONS,
	getMe,
	setMe = () => {},
}) => {
	// if (activeTab < tabs.length) {
	const [isLoading, setLoading] = useState(false);

	const refreshHandler = async () => {
		try {
			setLoading(true);
			const userDetail = await getMe();
			const detail = userDetail?.value?.data;
			setMe(detail);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="presentation_container apply_rtl verification_container">
			{!isMobile && (
				<IconTitle
					stringId="ACCOUNTS.TAB_VERIFICATION"
					text={STRINGS['ACCOUNTS.TAB_VERIFICATION']}
					textType="title"
					iconPath={ICONS['TAB_VERIFY']}
					iconId={STRINGS['ACCOUNTS.TAB_VERIFICATION']}
				/>
			)}
			<HeaderSection openContactForm={openContactForm} />
			<div
				className={classnames('header-content', {
					'w-50': !isMobile,
					'w-100': isMobile,
				})}
			>
				<div className="mb-3">
					<EditWrapper stringId="USER_VERIFICATION.INFO_TXT">
						{STRINGS['USER_VERIFICATION.INFO_TXT']}
					</EditWrapper>
				</div>
				<div className="mb-3">
					<EditWrapper stringId="USER_VERIFICATION.INFO_TXT_1">
						{STRINGS['USER_VERIFICATION.INFO_TXT_1']}
					</EditWrapper>
				</div>
			</div>
			<NotLoggedIn>
				<div className="inner-content">
					{!isMobile && (
						<span className="d-flex justify-content-end mb-3">
							<ActionNotification
								stringId="REFRESH"
								text={STRINGS['REFRESH']}
								iconId="REFRESH"
								iconPath={STATIC_ICONS['REFRESH']}
								className="blue-icon refresh-link"
								onClick={() => refreshHandler()}
							/>
						</span>
					)}
					{!isMobile ? (
						<CustomTabBar
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							{...tabProps}
						/>
					) : (
						<MobileTabBar
							activeTab={activeTab}
							renderContent={renderContent}
							setActiveTab={setActiveTab}
							{...tabProps}
						/>
					)}
					{!isMobile ? (
						<div className="inner_container">
							{isLoading ? (
								<Loader relative={true} background={false} />
							) : (
								activeTab > -1 && renderContent(tabs, activeTab)
							)}
						</div>
					) : null}
				</div>
			</NotLoggedIn>
		</div>
	);
	// } else {
	//     return (
	//         <div className="presentation_container apply_rtl verification_container">
	//             {!isMobile && <TabController {...tabProps} />}
	//             <div className="inner_container">complete</div>
	//         </div>
	//     )
	// }
};

const mapDispatchToProps = (dispatch) => ({
	getMe: bindActionCreators(getMe, dispatch),
});
export default connect('', mapDispatchToProps)(withConfig(VerificationHome));
