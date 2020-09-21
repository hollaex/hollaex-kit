import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';

import SummaryBlock from './components/SummaryBlock';
// import TraderAccounts from './components/TraderAccounts';
// import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
// import TradingVolume from './components/TradingVolume';
import MobileSummary from './MobileSummary';

import { IconTitle } from '../../components';
// import { logout } from '../../actions/authAction';
import {
	openFeesStructureandLimits,
	// openContactForm,
	logoutconfirm,
	setNotification,
	NOTIFICATIONS
} from '../../actions/appActions';
import {
	BASE_CURRENCY,
	DEFAULT_COIN_DATA,
	// SHOW_SUMMARY_ACCOUNT_DETAILS,
	SHOW_TOTAL_ASSETS
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

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			nextProps.user.id !== this.props.user.id ||
			nextProps.price !== this.props.price ||
			nextProps.orders.length !== this.props.orders.length ||
			nextProps.balance.timestamp !== this.props.balance.timestamp ||
			JSON.stringify(this.props.prices) !== JSON.stringify(nextProps.prices) ||
			JSON.stringify(this.props.coins) !== JSON.stringify(nextProps.coins) ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.calculateSections(nextProps);
		}
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
			discount: discount
		});
	};

	onAccountTypeChange = (type) => {
		this.setState({ selectedAccount: type });
	};

	onUpgradeAccount = () => {
		// this.props.openContactForm({ category: 'level' });
		const { links = {} } = this.props.constants;
		if (window && links && links.helpdesk) {
			window.open(links.helpdesk, '_blank');
		}
	};

	calculateSections = ({ price, balance, orders, prices, coins }) => {
		const data = [];

		const totalAssets = calculateBalancePrice(balance, prices, coins);
		Object.keys(coins).forEach((currency) => {
			const { symbol, min } = coins[currency] || DEFAULT_COIN_DATA;
			const currencyBalance = calculatePrice(
				balance[`${symbol}_balance`],
        currency
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
		return (
			<div className="summary-container">
				{!isMobile && (
					<IconTitle text={`${STRINGS["SUMMARY.TITLE"]}`} textType="title" />
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
						{/*<div className="d-flex align-items-center">
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
									title={STRINGS["SUMMARY.TASKS"]}
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
						</div>*/}
						<div className="d-flex align-items-center">
							<div
								className={classnames('assets-wrapper', 'asset_wrapper_width')}
							>
								<SummaryBlock
									title={STRINGS["SUMMARY.ACCOUNT_ASSETS"]}
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
	affiliation: state.user.affiliation,
	constants: state.app.constants
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
