import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
// import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import AccountDetails from './components/AccountDetails';
import Markets from './components/Markets';
import MobileSummary from './MobileSummary';

import { IconTitle } from 'components';
// import { logout } from '../../actions/authAction';
import {
	// openContactForm,
	logoutconfirm,
	setNotification,
	NOTIFICATIONS,
	setSelectedAccount,
} from 'actions/appActions';
import {
	BASE_CURRENCY,
	DEFAULT_COIN_DATA,
	// SHOW_SUMMARY_ACCOUNT_DETAILS,
	SHOW_TOTAL_ASSETS,
} from 'config/constants';
import STRINGS from 'config/localizedStrings';
import { formatAverage, formatBaseAmount } from 'utils/currency';
import { getLastMonthVolume } from './components/utils';
import { getUserReferrals } from 'actions/userAction';
import withConfig from 'components/ConfigProvider/withConfig';
import { openContactForm } from 'actions/appActions';
import { isLoggedIn } from 'utils/token';

class Summary extends Component {
	state = {
		selectedAccount: '',
		currentTradingAccount: this.props.verification_level,
		lastMonthVolume: 0,
		displaySummary: true,
		displayReferralList: false,
	};

	componentDidMount() {
		const { user, tradeVolumes, pairs, prices, getUserReferrals } = this.props;

		if (user.id) {
			this.setCurrentTradeAccount(user);
			getUserReferrals();
		} else {
			this.setCurrentTradeAccount(user);
		}
		if (tradeVolumes.fetched) {
			let lastMonthVolume = getLastMonthVolume(
				tradeVolumes.data,
				prices,
				pairs
			);
			this.setState({ lastMonthVolume });
		}

		if (this.state.displayReferralList) {
			this.props.router.push('/referral');
		}
	}

	componentDidUpdate() {
		if (this.state.displayReferralList) {
			this.props.router.push('/referral');
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
			this.props.getUserReferrals();
		}
	}

	logoutConfirm = () => {
		this.props.logoutconfirm();
	};

	onAccountTypeChange = (type) => {
		this.setState({ selectedAccount: type });
		this.props.setSelectedAccount(type);
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
			this.props.setSelectedAccount(user.verification_level);
		} else if (!isLoggedIn()) {
			const { config_level } = this.props;
			this.setState({
				selectedAccount: Object.keys(config_level)[0] || 0,
			});
			this.props.setSelectedAccount(Object.keys(config_level)[0] || 0);
		}
	};

	onInviteFriends = () => {
		this.props.setNotification(NOTIFICATIONS.INVITE_FRIENDS, {
			affiliation_code: this.props.user.affiliation_code,
		});
	};

	onDisplayReferralList = () => {
		this.setState({ displayReferralList: true, displaySummary: false });
	};

	goBackReferral = () => {
		this.setState({ displayReferralList: false, displaySummary: true });
	};

	onStakeToken = () => {
		this.props.setNotification(NOTIFICATIONS.STAKE_TOKEN);
	};

	render() {
		const {
			user,
			balance,
			pairs,
			coins,
			verification_level,
			config_level,
			affiliation,
			chartData,
			totalAsset,
			router,
			icons: ICONS,
			referral_history_config,
			sparkLineChartData,
		} = this.props;
		const {
			selectedAccount,
			lastMonthVolume,
			currentTradingAccount,
		} = this.state;

		const { fullname } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const totalAssets = formatAverage(formatBaseAmount(totalAsset));
		const level = selectedAccount
			? selectedAccount
			: isLoggedIn()
			? verification_level
			: Object.keys(config_level)[0];
		const accountData = config_level[level] || {};
		const traderAccTitle =
			accountData.name ||
			STRINGS.formatString(
				STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
				verification_level
			);

		const userData =
			config_level[
				isLoggedIn() ? verification_level : Object.keys(config_level)[0]
			] || {};
		const userAccountTitle =
			userData.name ||
			STRINGS.formatString(
				STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
				verification_level
			);

		return (
			<div>
				<div className="summary-container">
					{!isMobile && !this.state.displayReferralList && (
						<IconTitle
							stringId="SUMMARY.TITLE"
							text={`${STRINGS['SUMMARY.TITLE']}`}
							textType="title"
							iconPath={ICONS['TAB_SUMMARY']}
							iconId={'TAB_SUMMARY'}
						/>
					)}
					{isMobile && !this.state.displayReferralList && (
						<MobileSummary
							user={user}
							pairs={pairs}
							coins={coins}
							config={config_level}
							selectedAccount={selectedAccount}
							logout={this.logoutConfirm}
							balance={balance}
							chartData={chartData}
							sparkLineChartData={sparkLineChartData}
							totalAssets={totalAssets}
							lastMonthVolume={lastMonthVolume}
							traderAccTitle={traderAccTitle}
							userAccountTitle={userAccountTitle}
							affiliation={affiliation}
							onInviteFriends={this.onInviteFriends}
							onDisplayReferralList={this.onDisplayReferralList}
							onUpgradeAccount={this.onUpgradeAccount}
							onAccountTypeChange={this.onAccountTypeChange}
							verification_level={verification_level}
							referral_history_config={referral_history_config}
						/>
					)}
					{this.state.displaySummary && !isMobile && (
						<div>
							<div id="summary-header-section"></div>
							<div className="d-flex">
								<div className="summary-section_1 trader-account-wrapper d-flex">
									<SummaryBlock
										title={userAccountTitle}
										wrapperClassname="w-100"
										verification_level={verification_level}
										icons={ICONS}
									>
										<TraderAccounts
											user={user}
											pairs={pairs}
											coins={coins}
											config={config_level}
											onUpgradeAccount={this.onUpgradeAccount}
											onInviteFriends={this.onInviteFriends}
											verification_level={verification_level}
											referral_history_config={
												this.props.referral_history_config
											}
											onDisplayReferralList={this.onDisplayReferralList}
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
										router={router}
										showContent={true}
										chartData={sparkLineChartData}
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
										config={config_level}
										currentTradingAccount={currentTradingAccount.symbol}
										selectedAccount={selectedAccount}
										lastMonthVolume={lastMonthVolume}
										onAccountTypeChange={this.onAccountTypeChange}
										onUpgradeAccount={this.onUpgradeAccount}
									/>
								</SummaryBlock>
							</div>
						</div>
					)}
				</div>
				<div id="summary-footer-section"></div>
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
	referral_history_config: state.app.constants.referral_history_config,
	sparkLineChartData: state.app.sparkLineChartData,
});

const mapDispatchToProps = (dispatch) => ({
	logoutconfirm: bindActionCreators(logoutconfirm, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
	getUserReferrals: bindActionCreators(getUserReferrals, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	setSelectedAccount: bindActionCreators(setSelectedAccount, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Summary));
