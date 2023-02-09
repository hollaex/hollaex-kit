import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	IconTitle,
	EditWrapper,
	CustomMobileTabs,
	TabController,
	MobileTabBar,
	HeaderSection,
	Loader,
} from 'components';
import { openContactForm } from 'actions/appActions';
import TradingFees from './TradingFees';
import WithdrawalFees from './WithdrawalFees';
import WithdrawalLimits from './WithdrawalLimits';

const Index = ({ config_level, verification_level, router }) => {
	const [selectedLevel, setSelectedLevel] = useState(
		verification_level?.toString()
	);
	const [tabs, setTabs] = useState([]);
	const [activeTab, setActiveTab] = useState(0);
	const [search, setSearch] = useState();

	useEffect(() => {
		const updateTabs = () => {
			const commonProps = {
				selectedLevel,
				setSelectedLevel,
				setActiveTab,
				search,
				setSearch,
			};

			const tabs = [
				{
					title: isMobile ? (
						<CustomMobileTabs
							title={STRINGS['FEES_AND_LIMITS.TABS.TRADING_FEES.TITLE']}
						/>
					) : (
						<EditWrapper stringId="FEES_AND_LIMITS.TABS.TRADING_FEES.TITLE">
							{STRINGS['FEES_AND_LIMITS.TABS.TRADING_FEES.TITLE']}
						</EditWrapper>
					),
					content: <TradingFees {...commonProps} />,
				},
				{
					title: isMobile ? (
						<CustomMobileTabs
							title={STRINGS['FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TITLE']}
						/>
					) : (
						<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TITLE">
							{STRINGS['FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TITLE']}
						</EditWrapper>
					),
					content: <WithdrawalFees {...commonProps} />,
				},
				{
					title: isMobile ? (
						<CustomMobileTabs
							title={STRINGS['FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TITLE']}
						/>
					) : (
						<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TITLE">
							{STRINGS['FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TITLE']}
						</EditWrapper>
					),
					content: <WithdrawalLimits {...commonProps} />,
				},
			];

			setTabs(tabs);
		};

		updateTabs();
	}, [selectedLevel, config_level, search]);

	const renderContent = (tabs, activeTab) =>
		tabs[activeTab] && tabs[activeTab].content ? (
			tabs[activeTab].content
		) : (
			<div />
		);

	return config_level && Object.keys(config_level).length && selectedLevel ? (
		<div className="presentation_container apply_rtl settings_container">
			{!isMobile && (
				<IconTitle
					stringId="FEES_AND_LIMITS.TITLE"
					text={STRINGS['FEES_AND_LIMITS.TITLE']}
					textType="title"
				/>
			)}

			<HeaderSection>
				<div className="header-content">
					<EditWrapper
						stringId="FEES_AND_LIMITS.BACK.BACK,FEES_AND_LIMITS.BACK.TO"
						renderWrapper={(children) => <div>{children}</div>}
					>
						{STRINGS.formatString(
							STRINGS['FEES_AND_LIMITS.BACK.PLACEHOLDER'],
							<span
								className="blue-link underline-text pointer px-1"
								onClick={() => router.push('/summary')}
							>
								{STRINGS['FEES_AND_LIMITS.BACK.BACK']}
							</span>,
							STRINGS['FEES_AND_LIMITS.BACK.TO']
						)}
					</EditWrapper>
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
	) : (
		<Loader background={false} />
	);
};

const mapStateToProps = (state) => {
	const {
		app: { config_level },
	} = state;
	return {
		verification_level: state.user.verification_level,
		config_level,
	};
};

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Index));
