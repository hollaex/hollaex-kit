import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import MobileSummary from './MobileSummary';

import { IconTitle } from '../../components';
import {
	openFeesStructureandLimits,
	logoutconfirm,
	setNotification,
	NOTIFICATIONS
} from '../../actions/appActions';
import {
	BASE_CURRENCY,
	DEFAULT_COIN_DATA,
	// SHOW_SUMMARY_ACCOUNT_DETAILS,
	SHOW_TOTAL_ASSETS,
	SUPPORT_HELP_URL
} from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	formatToCurrency,
	formatAverage,
	formatBaseAmount,
	calculateBalancePrice,
	donutFormatPercentage,
	calculatePrice,
	calculatePricePercentage
} from '../../utils/currency';
import { getLastMonthVolume } from './components/utils';
import { getUserReferralCount } from '../../actions/userAction';

class Summary extends Component {
	state = {
		selectedAccount: '',
		currentTradingAccount: this.props.verification_level,
		chartData: [],
		totalAssets: '',
		lastMonthVolume: 0
	};

	componentDidMount() {
		const { user, tradeVolumes, pairs, prices } = this.props;

		if (user.id) {
			this.calculateSections(this.props);
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

	componentDidUpdate(prevProps) {
		if (
			this.props.user.id !== prevProps.user.id ||
			this.props.price !== prevProps.price ||
			this.props.orders.length !== prevProps.orders.length ||
			this.props.balance.timestamp !== prevProps.balance.timestamp ||
			JSON.stringify(prevProps.prices) !== JSON.stringify(this.props.prices) ||
			JSON.stringify(prevProps.coins) !== JSON.stringify(this.props.coins) ||
			this.props.activeLanguage !== prevProps.activeLanguage
		) {
			this.calculateSections(this.props);
		}
		if (
			prevProps.user.verification_level !== this.props.user.verification_level
		) {
			this.setCurrentTradeAccount(this.props.user);
		}
		if (
			JSON.stringify(prevProps.tradeVolumes) !==
			JSON.stringify(this.props.tradeVolumes)
		) {
			let lastMonthVolume = getLastMonthVolume(
				this.props.tradeVolumes.data,
				this.props.prices,
				this.props.pairs
			);
			this.setState({ lastMonthVolume });
		}
		if (this.props.user.id !== prevProps.user.id && this.props.user.id) {
			this.props.getUserReferralCount();
		}
	}

	logoutConfirm = () => {
		this.props.logoutconfirm();
	};

	onFeesAndLimits = (tradingAccount, discount) => {
		this.props.openFeesStructureandLimits({
			verification_level: tradingAccount,
			discount: discount
		});
	};

	onAccountTypeChange = (type) => {
		this.setState({ selectedAccount: type });
	};

	onUpgradeAccount = () => {
		// this.props.openContactForm({ category: 'level' });
		if (window) {
			window.open(SUPPORT_HELP_URL, '_blank');
		}
	};

	calculateSections = ({ price, balance, orders, prices, coins }) => {
		const data = [];

		const totalAssets = calculateBalancePrice(balance, prices, coins);
		Object.keys(coins).forEach((currency) => {
			const { symbol, min } = coins[currency] || DEFAULT_COIN_DATA;
			const currencyBalance = calculatePrice(
				balance[`${symbol}_balance`],
				prices[currency]
			);
			const balancePercent = calculatePricePercentage(
				currencyBalance,
				totalAssets
			);
			data.push({
				...coins[currency],
				balance: balancePercent,
				balanceFormat: formatToCurrency(currencyBalance, min),
				balancePercentage: donutFormatPercentage(balancePercent)
			});
		});

		this.setState({
			chartData: data,
			totalAssets: formatAverage(formatBaseAmount(totalAssets))
		});
	};

	setCurrentTradeAccount = (user) => {
		let currentTradingAccount = this.state.currentTradingAccount;
		if (user.verification_level) {
			this.setState({
				currentTradingAccount,
				selectedAccount: user.verification_level
			});
		}
	};

	onInviteFriends = () => {
		this.props.setNotification(NOTIFICATIONS.INVITE_FRIENDS, {
			affiliation_code: this.props.user.affiliation_code
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
			isValidBase,
			verification_level,
			config_level,
			affiliation
		} = this.props;
		const {
			selectedAccount,
			chartData,
			totalAssets,
			lastMonthVolume
		} = this.state;
		const { fullname } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		let traderAccTitle = STRINGS.formatString(
			STRINGS.SUMMARY.LEVEL_OF_ACCOUNT,
			verification_level
		);
		// if (IS_XHT) {
		//     traderAccTitle = user.is_hap ? STRINGS.SUMMARY.HAP_ACCOUNT : STRINGS.SUMMARY.TRADER_ACCOUNT_TITLE
		// }
		return (
			<div className="summary-container">
				{!isMobile && (
					<IconTitle text={`${STRINGS.SUMMARY.TITLE}`} textType="title" />
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
						isValidBase={isValidBase}
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
						<div className="d-flex align-items-center">
							<div className="summary-section_1 trader-account-wrapper d-flex">
								<SummaryBlock title={traderAccTitle}>
									<TraderAccounts
										user={user}
										pairs={pairs}
										coins={coins}
										activeTheme={activeTheme}
										onFeesAndLimits={this.onFeesAndLimits}
										onUpgradeAccount={this.onUpgradeAccount}
										onInviteFriends={this.onInviteFriends}
										verification_level={verification_level}
									/>
								</SummaryBlock>
							</div>
							<div className="summary-section_1 requirement-wrapper d-flex">
								<SummaryBlock
									title={STRINGS.SUMMARY.REWARDS_BONUS}
									wrapperClassname="w-100"
								>
									<SummaryRequirements
										coins={coins}
										user={user}
										lastMonthVolume={lastMonthVolume}
										contentClassName="requirements-content"
									/>
								</SummaryBlock>
							</div>
						</div>
						<div className="d-flex align-items-center">
							<div
								className={classnames('assets-wrapper', 'asset_wrapper_width')}
							>
								<SummaryBlock
									title={STRINGS.SUMMARY.ACCOUNT_ASSETS}
									secondaryTitle={
										SHOW_TOTAL_ASSETS && BASE_CURRENCY && isValidBase ? (
											<span>
												<span className="title-font">{totalAssets}</span>
												{` ${fullname}`}
											</span>
										) : null
									}
									// wrapperClassname={classnames({ 'w-100': !SHOW_SUMMARY_ACCOUNT_DETAILS })}
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
							</div>
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
	isValidBase: state.app.isValidBase,
	config_level: state.app.config_level,
	affiliation: state.user.affiliation
});

const mapDispatchToProps = (dispatch) => ({
	logoutconfirm: bindActionCreators(logoutconfirm, dispatch),
	openFeesStructureandLimits: bindActionCreators(
		openFeesStructureandLimits,
		dispatch
	),
	setNotification: bindActionCreators(setNotification, dispatch),
	getUserReferralCount: bindActionCreators(getUserReferralCount, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Summary);
