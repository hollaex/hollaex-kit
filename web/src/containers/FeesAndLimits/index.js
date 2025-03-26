import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import TradingFees from './TradingFees';
import WithdrawalFees from './WithdrawalFees';
import WithdrawalLimits from './WithdrawalLimits';
import {
	IconTitle,
	EditWrapper,
	CustomMobileTabs,
	TabController,
	MobileTabBar,
	HeaderSection,
	Loader,
} from 'components';
import {
	openContactForm,
	setLimitTab,
	setSelectedAccount,
} from 'actions/appActions';
import { isLoggedIn } from 'utils/token';

const Index = ({
	config_level,
	verification_level,
	router,
	selectedAccount,
	getLimitTab,
	setSelectedAccount,
}) => {
	const [selectedLevel, setSelectedLevel] = useState(
		isLoggedIn() ? verification_level?.toString() : Object.keys(config_level)[0]
	);
	const [tabs, setTabs] = useState([]);
	const [activeTab, setActiveTab] = useState(isMobile ? null : 0);
	const [search, setSearch] = useState();

	useEffect(() => {
		setSelectedAccount(verification_level);
		//eslint-disable-next-line
	}, []);

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

	useEffect(() => {
		setSelectedLevel(selectedAccount);
	}, [selectedAccount]);

	useEffect(() => {
		if (getLimitTab >= 0) {
			setActiveTab(getLimitTab);
		}

		if (!isMobile) {
			if (router.location.search.includes('withdrawal-fees')) {
				setActiveTab(1);
			} else if (router.location.search.includes('withdrawal-limit')) {
				setActiveTab(2);
			} else if (router.location.search.includes('trading-fees')) {
				setActiveTab(0);
			}
		}
		setRenderTab();
		return () => {
			setLimitTab(isMobile ? null : 0);
		};
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		setRenderTab();
		//eslint-disable-next-line
	}, [activeTab]);

	const setRenderTab = () => {
		return activeTab === 0
			? router.push('/fees-and-limits?trading-fees')
			: activeTab === 1
			? router.push('/fees-and-limits?withdrawal-fees')
			: activeTab === 2 && router.push('/fees-and-limits?withdrawal-limits');
	};
	const renderContent = (tabs, activeTab) =>
		tabs[activeTab] && tabs[activeTab].content ? (
			tabs[activeTab].content
		) : (
			<div />
		);

	return config_level && Object.keys(config_level).length ? (
		<div className="presentation_container apply_rtl settings_container fees_limits">
			{!isMobile ? (
				<IconTitle
					stringId="FEES_AND_LIMITS.TITLE"
					text={STRINGS['FEES_AND_LIMITS.TITLE']}
					textType="title"
				/>
			) : (
				<EditWrapper stringId="FEES_AND_LIMITS.TITLE">
					<span className="fees-and-limit-title font-weight-bold">
						{STRINGS['FEES_AND_LIMITS.TITLE']}
					</span>
				</EditWrapper>
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
		app: { config_level, selectedAccount, selectedTab },
	} = state;
	return {
		verification_level: state.user.verification_level,
		config_level,
		selectedAccount,
		getLimitTab: selectedTab,
	};
};

const mapDispatchToProps = (dispatch) => ({
	setLimitTab: bindActionCreators(setLimitTab, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	setSelectedAccount: bindActionCreators(setSelectedAccount, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Index));
