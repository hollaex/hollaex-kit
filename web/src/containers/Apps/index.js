import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	IconTitle,
	HeaderSection,
	EditWrapper,
	CustomMobileTabs,
	TabController,
	MobileTabBar,
} from 'components';
import { openContactForm } from 'actions/appActions';
import All from './All';
import User from './User';

const Index = ({ icons: ICONS, openContactForm }) => {
	const [tabs, setTabs] = useState([]);
	const [activeTab, setActiveTab] = useState(0);

	useEffect(() => {
		updateTabs();
	}, []);

	const updateTabs = () => {
		const tabs = [
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS['USER_APPS.ALL_APPS.TAB_TITLE']}
						// icon={ICONS['SETTING_NOTIFICATION_ICON']}
					/>
				) : (
					<div>{STRINGS['USER_APPS.ALL_APPS.TAB_TITLE']}</div>
				),
				content: <All />,
			},
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS['USER_APPS.MY_APPS.TAB_TITLE']}
						// icon={ICONS['SETTING_NOTIFICATION_ICON']}
					/>
				) : (
					<div>{STRINGS['USER_APPS.MY_APPS.TAB_TITLE']}</div>
				),
				content: <User />,
			},
		];
		setTabs(tabs);
	};

	const renderContent = (tabs, activeTab) =>
		tabs[activeTab] && tabs[activeTab].content ? (
			tabs[activeTab].content
		) : (
			<div />
		);

	return (
		<div className="presentation_container apply_rtl settings_container">
			{!isMobile && (
				<IconTitle
					stringId="ACCOUNTS.TAB_APPS"
					text={STRINGS['ACCOUNTS.TAB_APPS']}
					textType="title"
					iconPath={ICONS['TAB_APPS']}
					iconId="TAB_APPS"
				/>
			)}

			<HeaderSection
				stringId="USER_APPS.TITLE"
				title={STRINGS['USER_APPS.TITLE']}
				openContactForm={openContactForm}
			>
				<div className="header-content">
					<div>
						<EditWrapper stringId="USER_APPS.SUBTITLE">
							{STRINGS['USER_APPS.SUBTITLE']}
						</EditWrapper>
					</div>
				</div>
			</HeaderSection>

			{!isMobile ? (
				<TabController
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					tabs={tabs}
				/>
			) : (
				<MobileTabBar
					activeTab={activeTab}
					renderContent={renderContent}
					setActiveTab={setActiveTab}
					tabs={tabs}
				/>
			)}

			{isMobile ? <div className="my-4" /> : renderContent(tabs, activeTab)}
		</div>
	);
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Index));
