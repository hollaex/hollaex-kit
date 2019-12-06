import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import moment from 'moment';
import classnames from 'classnames';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import TradingVolume from './components/TradingVolume';
import AccountDetails from './components/AccountDetails';
import MobileSummary from './MobileSummary';

import { IconTitle } from '../../components';
import { logout } from '../../actions/authAction';
import { openFeesStructureandLimits, openContactForm, logoutconfirm, setNotification, NOTIFICATIONS } from '../../actions/appActions';
import {
    BASE_CURRENCY,
    DEFAULT_COIN_DATA,
    SHOW_SUMMARY_ACCOUNT_DETAILS,
    SHOW_TOTAL_ASSETS,
    IS_HEX
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
            JSON.stringify(this.props.prices) !== JSON.stringify(nextProps.prices) ||
            JSON.stringify(this.props.coins) !== JSON.stringify(nextProps.coins) ||
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
        this.props.openFeesStructureandLimits({
            verification_level: tradingAccount
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

        const totalAssets = calculateBalancePrice(balance, prices, coins);
        Object.keys(coins).forEach((currency) => {
            const { symbol, min } = coins[currency] || DEFAULT_COIN_DATA;
            const currencyBalance = calculatePrice(balance[`${symbol}_balance`], prices[currency]);
            const balancePercent = calculatePricePercentage(currencyBalance, totalAssets);
            data.push({
                ...coins[currency],
                balance: balancePercent,
                balanceFormat: formatToCurrency(currencyBalance, min),
                balancePercentage: donutFormatPercentage(balancePercent),
            });
        });

        this.setState({ chartData: data, totalAssets: formatAverage(formatBaseAmount(totalAssets)) });
    };

    setCurrentTradeAccount = user => {
        let currentTradingAccount = this.state.currentTradingAccount;
        if (user.verification_level) {
            this.setState({ currentTradingAccount, selectedAccount: user.verification_level });
        };
    }

    onInviteFriends = () => {
        this.props.setNotification(NOTIFICATIONS.INVITE_FRIENDS, { affiliation_code: this.props.user.affiliation_code });
    };

    onStakeToken = () => {
        this.props.setNotification(NOTIFICATIONS.STAKE_TOKEN);
    };

    render() {
        const { user, balance, activeTheme, pairs, coins, isValidBase, verification_level, config_level } = this.props;
        const { selectedAccount, chartData, totalAssets, lastMonthVolume } = this.state;
        const { fullname } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
        let traderAccTitle = STRINGS.formatString(STRINGS.SUMMARY.LEVEL_OF_ACCOUNT, verification_level);
        // if (IS_HEX) {
        //     traderAccTitle = user.is_hap ? STRINGS.SUMMARY.HAP_ACCOUNT : STRINGS.SUMMARY.TRADER_ACCOUNT_TITLE
        // }
        return (
            <div className="summary-container">
                {!isMobile && <IconTitle
                    text={`${STRINGS.SUMMARY.TITLE}`}
                    textType="title"
                />}
                {isMobile
                    ? <MobileSummary
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
                        onInviteFriends={this.onInviteFriends}
                        onFeesAndLimits={this.onFeesAndLimits}
                        onUpgradeAccount={this.onUpgradeAccount}
                        onAccountTypeChange={this.onAccountTypeChange}
                        verification_level={verification_level}
                        onStakeToken={this.onStakeToken}
                    />
                    : (<div>
                        <div className="d-flex align-items-center">
                            <div className="summary-section_1 trader-account-wrapper d-flex">
                                <SummaryBlock title={traderAccTitle} >
                                    <TraderAccounts
                                        user={user}
                                        pairs={pairs}
                                        coins={coins}
                                        activeTheme={activeTheme}
                                        onFeesAndLimits={this.onFeesAndLimits}
                                        onUpgradeAccount={this.onUpgradeAccount}
                                        onInviteFriends={this.onInviteFriends}
                                        verification_level={verification_level}
                                        onStakeToken={this.onStakeToken} />
                                </SummaryBlock>
                            </div>
                            <div className="summary-section_1 requirement-wrapper d-flex">
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.URGENT_REQUIREMENTS}
                                    wrapperClassname="w-100" >
                                    <SummaryRequirements
                                        coins={coins}
                                        user={user}
                                        lastMonthVolume={lastMonthVolume}
                                        contentClassName="requirements-content" />
                                </SummaryBlock>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div
                                className={
                                    classnames(
                                        "assets-wrapper",
                                        "asset_wrapper_width",
                                        {
                                            'hex_asset_wrapper_width': !SHOW_SUMMARY_ACCOUNT_DETAILS,
                                        }
                                    )}>
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.ACCOUNT_ASSETS}
                                    secondaryTitle={
                                        SHOW_TOTAL_ASSETS && BASE_CURRENCY && isValidBase ?
                                            <span>
                                                <span className="title-font">
                                                    {totalAssets}
                                                </span>
                                                {` ${fullname}`}
                                            </span>
                                            : null
                                    }
                                    wrapperClassname={classnames({ 'w-100': !SHOW_SUMMARY_ACCOUNT_DETAILS })}
                                >
                                    <AccountAssets
                                        user={user}
                                        chartData={chartData}
                                        totalAssets={totalAssets}
                                        balance={balance}
                                        coins={coins}
                                        activeTheme={activeTheme} />
                                </SummaryBlock>
                            </div>
                            {SHOW_SUMMARY_ACCOUNT_DETAILS
                                ? <div className="trading-volume-wrapper">
                                    <SummaryBlock
                                        title={STRINGS.SUMMARY.TRADING_VOLUME}
                                        secondaryTitle={<span>
                                            <span className="title-font">
                                                {` ${formatAverage(formatBaseAmount(lastMonthVolume))}`}
                                            </span>
                                            {` ${fullname} ${STRINGS.formatString(STRINGS.SUMMARY.NOMINAL_TRADING_WITH_MONTH, moment().subtract(1, "month").startOf("month").format('MMMM')).join('')}`}
                                        </span>
                                        }
                                    >
                                        <TradingVolume user={user} />
                                    </SummaryBlock>
                                </div>
                                : null
                            }
                        </div>
                        <div className="d-flex align-items-center">
                            <SummaryBlock
                                title={STRINGS.SUMMARY.ACCOUNT_DETAILS}
                                secondaryTitle={traderAccTitle}
                                wrapperClassname="w-100" >
                                <AccountDetails
                                    user={user}
                                    coins={coins}
                                    pairs={pairs}
                                    activeTheme={activeTheme}
                                    selectedAccount={selectedAccount}
                                    lastMonthVolume={lastMonthVolume}
                                    onAccountTypeChange={this.onAccountTypeChange}
                                    onFeesAndLimits={this.onFeesAndLimits}
                                    onUpgradeAccount={this.onUpgradeAccount}
                                    config={config_level}
                                    verification_level={verification_level} />
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
    user: state.user || {},
    verification_level: state.user.verification_level,
    balance: state.user.balance,
    activeTheme: state.app.theme,
    prices: state.orderbook.prices,
    symbol: state.orderbook.symbol,
    price: state.orderbook.price,
    orders: state.order.activeOrders,
    activeLanguage: state.app.language,
    tradeVolumes: state.user.tradeVolumes,
    isValidBase: state.app.isValidBase,
    config: state.app.config,
    config_level: state.app.config_level
});

const mapDispatchToProps = (dispatch) => ({
    logoutconfirm: bindActionCreators(logoutconfirm, dispatch),
    logout: bindActionCreators(logout, dispatch),
    openFeesStructureandLimits: bindActionCreators(openFeesStructureandLimits, dispatch),
    openContactForm: bindActionCreators(openContactForm, dispatch),
    setNotification: bindActionCreators(setNotification, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Summary);

