import React from 'react';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';
import { connect } from 'react-redux';

import {
	IconTitle,
	HeaderSection,
	CustomTabBar,
	MobileTabBar,
} from '../../components';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

const VerificationHome = ({
	activeTab,
	tabProps,
	tabs,
	openContactForm,
	setActiveTab,
	renderContent,
	icons: ICONS,
}) => {
	// if (activeTab < tabs.length) {
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
			<div className="inner-content">
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
						{activeTab > -1 && renderContent(tabs, activeTab)}
					</div>
				) : null}
			</div>
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

export default connect(null)(withConfig(VerificationHome));
