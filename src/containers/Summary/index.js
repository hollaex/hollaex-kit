import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import moment from 'moment';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import TradingVolume from './components/TradingVolume';
import AccountDetails from './components/AccountDetails';
import MobileSummary from './MobileSummary';

import { IconTitle } from '../../components';
import { logout } from '../../actions/authAction';
import { openFeesStructureandLimits, openContactForm, logoutconfirm } from '../../actions/appActions';
import { requestLimits, requestFees } from '../../actions/userAction';
import { BASE_CURRENCY, TRADING_ACCOUNT_TYPE } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
    formatToCurrency,
    formatAverage,
    formatFiatAmount,
    calculateBalancePrice,
    donutFormatPercentage,
    calculatePrice,
    calculatePricePercentage } from '../../utils/currency';
import { getLastMonthVolume } from './components/utils';

const default_trader_account = TRADING_ACCOUNT_TYPE.shrimp;

class Summary extends Component {
    state = {
        selectedAccount: default_trader_account.symbol,
        currentTradingAccount: default_trader_account,
        chartData: [],
        totalAssets: '',
        lastMonthVolume: 0
    };

    
    componentDidMount() {
        const { user, tradeVolumes, pairs, prices } = this.props;

        if (user.id) {
            this.calculateSections(this.props);
            this.setCurrentTradeAccount(user);
        }
        if (tradeVolumes.fetched) {
            let lastMonthVolume = getLastMonthVolume(tradeVolumes.data, prices, pairs);
            this.setState({ lastMonthVolume });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.user.id !== this.props.user.id ||
            nextProps.price !== this.props.price ||
            nextProps.orders.length !== this.props.orders.length ||
            nextProps.balance.timestamp !== this.props.balance.timestamp ||
            nextProps.activeLanguage !== this.props.activeLanguage
        ) {
            this.calculateSections(nextProps);
        }
        if (this.props.user.verification_level !== nextProps.user.verification_level) {
            this.setCurrentTradeAccount(nextProps.user);
        }
        if (JSON.stringify(this.props.tradeVolumes) !== JSON.stringify(nextProps.tradeVolumes)) {
            let lastMonthVolume = getLastMonthVolume(nextProps.tradeVolumes.data, nextProps.prices, nextProps.pairs);
            this.setState({ lastMonthVolume });
        }
    }

    logoutConfirm = () => {
        this.props.logoutconfirm()
    }

    onFeesAndLimits = tradingAccount => {
        const { fees, limits, pairs, requestLimits, requestFees } = this.props;
        if (!limits.fetched && !limits.fetching) {
            requestLimits();
        }

        if (!fees.fetched && !fees.fetching) {
            requestFees();
        }
        this.props.openFeesStructureandLimits({
            fees: fees.data,
            limits: limits.data,
            verification_level: tradingAccount.level,
            tradingAccount,
            pairs
        });
    };

    onAccountTypeChange = type => {
        this.setState({ selectedAccount: type });
    };

    onUpgradeAccount = () => {
        this.props.openContactForm({ category: 'level' });
    };

    calculateSections = ({ price, balance, orders, prices, coins }) => {
        const data = [];

        const totalAssets = calculateBalancePrice(balance, prices);
        Object.keys(coins).forEach((currency) => {
            const { symbol, min } = coins[currency] || {};
            const currencyBalance = calculatePrice(balance[`${symbol}_balance`], prices[currency]);
            const balancePercent = calculatePricePercentage(currencyBalance, totalAssets);
            data.push({
                ...coins[currency],
                balance: balancePercent,
                balanceFormat: formatToCurrency(currencyBalance, min),
                balancePercentage: donutFormatPercentage(balancePercent),
            });
        });

        this.setState({ chartData: data, totalAssets: formatAverage(formatFiatAmount(totalAssets)) });
    };

    setCurrentTradeAccount = user => {
        let currentTradingAccount = this.state.currentTradingAccount;
        switch (user.verification_level) {
            case 1:
                currentTradingAccount = TRADING_ACCOUNT_TYPE.shrimp;
                break;
            case 2:
                currentTradingAccount = TRADING_ACCOUNT_TYPE.snapper;
                break;
            case 3:
                currentTradingAccount = TRADING_ACCOUNT_TYPE.kraken;
                break;
            case 4:
                currentTradingAccount = TRADING_ACCOUNT_TYPE.leviathan;
                break;
            default:
                currentTradingAccount = TRADING_ACCOUNT_TYPE.leviathan;
                break;
        }
        this.setState({ currentTradingAccount, selectedAccount: currentTradingAccount.symbol });
    };

    render() {
        const { user, balance, activeTheme, fees, limits, pairs, coins, logout } = this.props;
        const { selectedAccount, currentTradingAccount, chartData, totalAssets, lastMonthVolume } = this.state;
        return (
            <div className="summary-container">
                {!isMobile && <IconTitle
                    text={`${STRINGS.SUMMARY.TITLE}`}
                    textType="title"
                />}
                {isMobile
                    ? <MobileSummary
                        user={user}
                        fees={fees.data}
                        limits={limits.data}
                        pairs={pairs}
                        coins={coins}
                        activeTheme={activeTheme}
                        default_trader_account={default_trader_account}
                        currentTradingAccount={currentTradingAccount}
                        selectedAccount={selectedAccount}
                        logout={this.logoutConfirm}
                        balance={balance}
                        chartData={chartData}
                        totalAssets={totalAssets}
                        lastMonthVolume={lastMonthVolume}
                        onFeesAndLimits={this.onFeesAndLimits}
                        onUpgradeAccount={this.onUpgradeAccount}
                        onAccountTypeChange={this.onAccountTypeChange}
                    />
                    : (<div>
                        <div className="d-flex align-items-center">
                            <div className="summary-section_1 trader-account-wrapper d-flex">
                                <SummaryBlock title={currentTradingAccount.fullName} >
                                    <TraderAccounts
                                        fees={fees.data}
                                        limits={limits.data}
                                        pairs={pairs}
                                        activeTheme={activeTheme}
                                        account={currentTradingAccount}
                                        onFeesAndLimits={this.onFeesAndLimits}
                                        onUpgradeAccount={this.onUpgradeAccount} />
                                </SummaryBlock>
                            </div>
                            <div className="summary-section_1 requirement-wrapper d-flex">
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.URGENT_REQUIREMENTS}
                                    wrapperClassname="w-100" >
                                    <SummaryRequirements user={user} lastMonthVolume={lastMonthVolume} contentClassName="requirements-content" />
                                </SummaryBlock>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="assets-wrapper">
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.ACCOUNT_ASSETS}
                                    secondaryTitle={<span><span className="title-font">{totalAssets}</span>{` ${STRINGS[`${BASE_CURRENCY.toUpperCase()}_FULLNAME`]}`}</span>} >
                                    <AccountAssets
                                        user={user}
                                        chartData={chartData}
                                        totalAssets={totalAssets}
                                        balance={balance}
                                        coins={coins} />
                                </SummaryBlock>
                            </div>
                            <div className="trading-volume-wrapper">
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.TRADING_VOLUME}
                                    secondaryTitle={<span>
                                        <span className="title-font">
                                            {` ${formatAverage(formatFiatAmount(lastMonthVolume))}`}
                                        </span>
                                        {` ${STRINGS.FIAT_FULLNAME} ${STRINGS.formatString(STRINGS.SUMMARY.NOMINAL_TRADING_WITH_MONTH, moment().subtract(1, "month").startOf("month").format('MMMM')).join('')}`}
                                    </span>
                                    }
                                >
                                    <TradingVolume user={user} />
                                </SummaryBlock>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <SummaryBlock
                                title={STRINGS.SUMMARY.ACCOUNT_DETAILS}
                                secondaryTitle={currentTradingAccount.name}
                                wrapperClassname="w-100" >
                                <AccountDetails
                                    user={user}
                                    fees={fees.data}
                                    limits={limits.data}
                                    pairs={pairs}
                                    activeTheme={activeTheme}
                                    currentTradingAccount={currentTradingAccount.symbol}
                                    selectedAccount={selectedAccount}
                                    lastMonthVolume={lastMonthVolume}
                                    onAccountTypeChange={this.onAccountTypeChange}
                                    onFeesAndLimits={this.onFeesAndLimits}
                                    onUpgradeAccount={this.onUpgradeAccount} />
                            </SummaryBlock>
                        </div>
                    </div>)
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    pairs: state.app.pairs,
    coins: state.app.coins,
    user: state.user,
    verification_level: state.user.verification_level,
    balance: state.user.balance,
    fees: state.user.feeValues,
    limits: state.user.limits,
    activeTheme: state.app.theme,
    prices: state.orderbook.prices,
    symbol: state.orderbook.symbol,
    price: state.orderbook.price,
    orders: state.order.activeOrders,
    activeLanguage: state.app.language,
    tradeVolumes: state.user.tradeVolumes
});

const mapDispatchToProps = (dispatch) => ({
    logoutconfirm: bindActionCreators(logoutconfirm, dispatch),
	logout: bindActionCreators(logout, dispatch),
    requestLimits: bindActionCreators(requestLimits, dispatch),
    requestFees: bindActionCreators(requestFees, dispatch),
    openFeesStructureandLimits: bindActionCreators(openFeesStructureandLimits, dispatch),
    openContactForm: bindActionCreators(openContactForm, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Summary);

