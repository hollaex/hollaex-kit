import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
// import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
// import TradingVolume from './components/TradingVolume';
import AccountDetails from './components/AccountDetails';
import Markets from './components/Markets';
import MobileSummary from './MobileSummary';

import { IconTitle } from '../../components';
// import { logout } from '../../actions/authAction';
import {
	openFeesStructureandLimits,
	// openContactForm,
	logoutconfirm,
	setNotification,
	NOTIFICATIONS,
} from '../../actions/appActions';
import {
	BASE_CURRENCY,
	DEFAULT_COIN_DATA,
	// SHOW_SUMMARY_ACCOUNT_DETAILS,
	SHOW_TOTAL_ASSETS,
} from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { formatAverage, formatBaseAmount } from 'utils/currency';
import { getLastMonthVolume } from './components/utils';
import { getUserReferralCount } from '../../actions/userAction';
import withConfig from 'components/ConfigProvider/withConfig';
import { openContactForm } from 'actions/appActions';

class Summary extends Component {
	state = {
		selectedAccount: '',
		currentTradingAccount: this.props.verification_level,
		lastMonthVolume: 0,
	};

	componentDidMount() {
		const { user, tradeVolumes, pairs, prices } = this.props;

		if (user.id) {
			this.setCurrentTradeAccount(user);
			this.props.getUserReferralCount();
		}
		if (tradeVolumes.fetched) {
			let lastMonthVolume = getLastMonthVolume(
				tradeVolumes.data,
				prices,
				pairs
			);
			this.setState({ lastMonthVolume });
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			this.props.user.verification_level !== nextProps.user.verification_level
		) {
			this.setCurrentTradeAccount(nextProps.user);
		}
		if (
			JSON.stringify(this.props.tradeVolumes) !==
			JSON.stringify(nextProps.tradeVolumes)
		) {
			let lastMonthVolume = getLastMonthVolume(
				nextProps.tradeVolumes.data,
				nextProps.prices,
				nextProps.pairs
			);
			this.setState({ lastMonthVolume });
		}
		if (nextProps.user.id !== this.props.user.id && nextProps.user.id) {
			this.props.getUserReferralCount();
		}
	}

	logoutConfirm = () => {
		this.props.logoutconfirm();
	};

	onFeesAndLimits = (tradingAccount, discount) => {
		this.props.openFeesStructureandLimits({
			verification_level: tradingAccount,
			discount: discount,
		});
	};

	onAccountTypeChange = (type) => {
		this.setState({ selectedAccount: type });
	};

	onUpgradeAccount = () => {
		const { openContactForm } = this.props;
		openContactForm();
	};

	setCurrentTradeAccount = (user) => {
		let currentTradingAccount = this.state.currentTradingAccount;
		if (user.verification_level) {
			this.setState({
				currentTradingAccount,
				selectedAccount: user.verification_level,
			});
		}
	};

	onInviteFriends = () => {
		this.props.setNotification(NOTIFICATIONS.INVITE_FRIENDS, {
			affiliation_code: this.props.user.affiliation_code,
		});
	};

	onStakeToken = () => {
		this.props.setNotification(NOTIFICATIONS.STAKE_TOKEN);
	};

	render() {
		const {
			user,
			balance,
			activeTheme,
			pairs,
			coins,
			verification_level,
			config_level,
			affiliation,
			chartData,
			totalAsset,
			router,
			icons: ICONS,
		} = this.props;
		const {
			selectedAccount,
			lastMonthVolume,
			currentTradingAccount,
		} = this.state;

		const { fullname } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const totalAssets = formatAverage(formatBaseAmount(totalAsset));
		let traderAccTitle = STRINGS.formatString(
			STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
			verification_level
		);
		return (
			<div className="summary-container">
				{!isMobile && (
					<IconTitle
						stringId="SUMMARY.TITLE"
						text={`${STRINGS['SUMMARY.TITLE']}`}
						textType="title"
						iconPath={ICONS['TAB_SUMMARY']}
						iconId={`${STRINGS['SUMMARY.TITLE']}`}
					/>
				)}
				{isMobile ? (
					<MobileSummary
						user={user}
						pairs={pairs}
						coins={coins}
						config={config_level}
						activeTheme={activeTheme}
						selectedAccount={selectedAccount}
						logout={this.logoutConfirm}
						balance={balance}
						chartData={chartData}
						totalAssets={totalAssets}
						lastMonthVolume={lastMonthVolume}
						traderAccTitle={traderAccTitle}
						affiliation={affiliation}
						onInviteFriends={this.onInviteFriends}
						onFeesAndLimits={this.onFeesAndLimits}
						onUpgradeAccount={this.onUpgradeAccount}
						onAccountTypeChange={this.onAccountTypeChange}
						verification_level={verification_level}
					/>
				) : (
					<div>
						<div className="d-flex">
							<div className="summary-section_1 trader-account-wrapper d-flex">
								<SummaryBlock title={traderAccTitle} wrapperClassname="w-100">
									<TraderAccounts
										user={user}
										pairs={pairs}
										coins={coins}
										config={config_level}
										activeTheme={activeTheme}
										onFeesAndLimits={this.onFeesAndLimits}
										onUpgradeAccount={this.onUpgradeAccount}
										onInviteFriends={this.onInviteFriends}
										verification_level={verification_level}
									/>
								</SummaryBlock>
							</div>
							<div className="summary-section_1 requirement-wrapper d-flex">
								{/* <SummaryBlock
									title={STRINGS["SUMMARY.TASKS"]}
									wrapperClassname="w-100"
								>
									<SummaryRequirements
										coins={coins}
										user={user}
										lastMonthVolume={lastMonthVolume}
										contentClassName="requirements-content"
									/>
								</SummaryBlock> */}
								{/* <div
									className={classnames(
										'assets-wrapper',
										'asset_wrapper_width'
									)}
								> */}
								<SummaryBlock
									stringId="SUMMARY.ACCOUNT_ASSETS"
									title={STRINGS['SUMMARY.ACCOUNT_ASSETS']}
									secondaryTitle={
										SHOW_TOTAL_ASSETS && BASE_CURRENCY ? (
											<span>
												<span className="title-font">{totalAssets}</span>
												{` ${fullname}`}
											</span>
										) : null
									}
									wrapperClassname={classnames('assets-wrapper', 'w-100')}
								>
									<AccountAssets
										user={user}
										chartData={chartData}
										totalAssets={totalAssets}
										balance={balance}
										coins={coins}
										activeTheme={activeTheme}
									/>
								</SummaryBlock>
								{/* </div> */}
							</div>
						</div>
						<div className="w-100">
							<SummaryBlock
								stringId="SUMMARY.MARKETS"
								title={STRINGS['SUMMARY.MARKETS']}
							>
								<Markets
									user={user}
									coins={coins}
									pairs={pairs}
									activeTheme={activeTheme}
									router={router}
								/>
							</SummaryBlock>
							{/*<div className="trading-volume-wrapper">
                                <SummaryBlock
                                    title={STRINGS["SUMMARY.TRADING_VOLUME"]}
                                    // secondaryTitle={<span>
                                    //     <span className="title-font">
                                    //         {` ${formatAverage(formatBaseAmount(lastMonthVolume))}`}
                                    //     </span>
                                    //     {` ${fullname} ${STRINGS.formatString(STRINGS["SUMMARY.NOMINAL_TRADING_WITH_MONTH"], moment().subtract(1, "month").startOf("month").format('MMMM')).join('')}`}
                                    // </span>
                                    // }
                                >
                                    <TradingVolume user={user} />
                                </SummaryBlock>
                            </div>*/}
						</div>
						<div className="w-100">
							<SummaryBlock
								stringId="SUMMARY.ACCOUNT_DETAILS"
								title={STRINGS['SUMMARY.ACCOUNT_DETAILS']}
								secondaryTitle={currentTradingAccount.name}
							>
								<AccountDetails
									user={user}
									coins={coins}
									pairs={pairs}
									activeTheme={activeTheme}
									config={config_level}
									currentTradingAccount={currentTradingAccount.symbol}
									selectedAccount={selectedAccount}
									lastMonthVolume={lastMonthVolume}
									onAccountTypeChange={this.onAccountTypeChange}
									onFeesAndLimits={this.onFeesAndLimits}
									onUpgradeAccount={this.onUpgradeAccount}
								/>
							</SummaryBlock>
						</div>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	user: state.user || {},
	verification_level: state.user.verification_level,
	balance: state.user.balance,
	activeTheme: state.app.theme,
	prices: state.orderbook.prices,
	price: state.orderbook.price,
	orders: state.order.activeOrders,
	activeLanguage: state.app.language,
	tradeVolumes: state.user.tradeVolumes,
	config_level: state.app.config_level,
	affiliation: state.user.affiliation,
	constants: state.app.constants,
	chartData: state.asset.chartData,
	totalAsset: state.asset.totalAsset,
});

const mapDispatchToProps = (dispatch) => ({
	logoutconfirm: bindActionCreators(logoutconfirm, dispatch),
	openFeesStructureandLimits: bindActionCreators(
		openFeesStructureandLimits,
		dispatch
	),
	setNotification: bindActionCreators(setNotification, dispatch),
	getUserReferralCount: bindActionCreators(getUserReferralCount, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Summary));
