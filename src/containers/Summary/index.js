import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import TradingVolume from './components/TradingVolume';
import AccountDetails from './components/AccountDetails';
import MobileSummary from './MobileSummary';

import { IconTitle } from '../../components';
import { openFeesStructureandLimits, openContactForm } from '../../actions/appActions';
import { requestLimits, requestFees } from '../../actions/userAction';
import { SUMMMARY_ICON, CURRENCIES, TRADING_ACCOUNT_TYPE } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const FIAT = CURRENCIES.fiat.symbol;
const default_trader_account = TRADING_ACCOUNT_TYPE.shrimp;

class Summary extends Component {
    state = {
        selectedAccount: default_trader_account.symbol,
        currentTradingAccount: default_trader_account
    };

    componentDidMount() {
        if (!this.props.limits.fetched && !this.props.limits.fetching) {
            this.props.requestLimits();
        }

        if (!this.props.fees.fetched && !this.props.fees.fetching) {
            this.props.requestFees();
        }
    }

    onFeesAndLimits = tradingAccount => {
        const { fees, limits, verification_level, pairs } = this.props;
        this.props.openFeesStructureandLimits({
            fees: fees.data,
            limits: limits.data,
            verification_level,
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

    render() {
        const { user, balance, activeTheme } = this.props;
        const { selectedAccount, currentTradingAccount } = this.state;
        return (
            <div className="summary-container">
                {/* <IconTitle
                    text={`${STRINGS.ACCOUNTS.TITLE} ${STRINGS.SUMMARY.TITLE}`}
                    textType="title"
                /> */}
                {isMobile
                    ? <MobileSummary
                        user={user}
                        activeTheme={activeTheme}
                        default_trader_account={default_trader_account}
                        currentTradingAccount={currentTradingAccount}
                        selectedAccount={selectedAccount}
                        FIAT={FIAT}
                        balance={balance}
                        onFeesAndLimits={this.onFeesAndLimits}
                        onUpgradeAccount={this.onUpgradeAccount}
                        onAccountTypeChange={this.onAccountTypeChange}
                    />
                    : (<div>
                        <div className="d-flex align-items-center">
                            <div className="summary-section_1 trader-account-wrapper d-flex">
                                <SummaryBlock title={STRINGS.SUMMARY.TINY_PINK_SHRIMP_TRADER_ACCOUNT} >
                                    <TraderAccounts
                                        icon={SUMMMARY_ICON.SHRIMP}
                                        activeTheme={activeTheme}
                                        account={default_trader_account}
                                        onFeesAndLimits={this.onFeesAndLimits}
                                        onUpgradeAccount={this.onUpgradeAccount} />
                                </SummaryBlock>
                            </div>
                            <div className="summary-section_1 requirement-wrapper d-flex">
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.URGENT_REQUIREMENTS}
                                    wrapperClassname="w-100" >
                                    <SummaryRequirements user={user} contentClassName="requirements-content" />
                                </SummaryBlock>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="assets-wrapper">
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.ACCOUNT_ASSETS}
                                    secondaryTitle={`${balance[`${FIAT}_balance`]} ${STRINGS.FIAT_FULLNAME}`} >
                                    <AccountAssets user={user} />
                                </SummaryBlock>
                            </div>
                            <div className="trading-volume-wrapper">
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.TRADING_VOLUME}
                                    secondaryTitle={`${balance[`${FIAT}_balance`]} ${STRINGS.FIAT_FULLNAME}`} >
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
                                    activeTheme={activeTheme}
                                    currentTradingAccount={currentTradingAccount.symbol}
                                    selectedAccount={selectedAccount}
                                    onAccountTypeChange={this.onAccountTypeChange}
                                    onFeesAndLimits={this.onFeesAndLimits} />
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
    user: state.user,
    verification_level: state.user.verification_level,
    balance: state.user.balance,
    fees: state.user.feeValues,
    limits: state.user.limits,
    activeTheme: state.app.theme
});

const mapDispatchToProps = (dispatch) => ({
    requestLimits: bindActionCreators(requestLimits, dispatch),
    requestFees: bindActionCreators(requestFees, dispatch),
    openFeesStructureandLimits: bindActionCreators(openFeesStructureandLimits, dispatch),
    openContactForm: bindActionCreators(openContactForm, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Summary);

