import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { ICONS, IS_XHT } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class AppMenuBar extends Component {
    state = {
        activeMenu: '',
        securityPending: 0,
        verificationPending: 0,
        walletPending: 0
    };

    componentDidMount() {
        if (this.props.location && this.props.location.pathname) {
            this.setActiveMenu(this.props.location.pathname);
        }
        if (this.props.user && this.props.user.id) {
            this.checkVerificationStatus(this.props.user, this.props.enabledPlugins);
            this.checkWalletStatus(this.props.user, this.props.coins);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.location && nextProps.location
            && this.props.location.pathname !== nextProps.location.pathname) {
            this.setActiveMenu(nextProps.location.pathname);
        }
        if (JSON.stringify(this.props.user) !== JSON.stringify(nextProps.user)
            || JSON.stringify(this.props.coins) !== JSON.stringify(nextProps.coins)) {
            this.checkVerificationStatus(nextProps.user, nextProps.enabledPlugins);
            this.checkWalletStatus(nextProps.user, nextProps.coins);
        }
        if (this.props.activeLanguage !== nextProps.activeLanguage) {
            this.setActiveMenu(nextProps.location.pathname);
        }
    }

    checkVerificationStatus = (user, enabledPlugins) => {
        const userData = user.userData || {};
        const { phone_number, full_name, id_data = {}, bank_account = [] } = userData;
        let securityPending = 0;
        let verificationPending = 0;
        if (!user.otp_enabled) {
            securityPending += 1;
        }
        if (user.verification_level < 1 && !full_name && enabledPlugins.includes('kyc')) {
            verificationPending += 1;
        }
        if ((id_data.status === 0 || id_data.status === 2) &&
            enabledPlugins.includes('kyc')) {
            verificationPending += 1;
        }
        if (!phone_number && enabledPlugins.includes('sms')) {
            verificationPending += 1;
        }
        if (bank_account.filter(acc => acc.status === 0 || acc.status === 2).length === bank_account.length &&
            enabledPlugins.includes('bank')) {
            verificationPending += 1;
        }
        this.setState({ securityPending, verificationPending });
    };

    checkWalletStatus = (user, coins) => {
        let walletPending = false;
        if (user.balance) {
            walletPending = true;
            Object.keys(coins).forEach(pair => {
                if (user.balance[`${pair.toLowerCase()}_balance`] > 0) {
                    walletPending = false;
                }
            })
        }
        this.setState({ walletPending: walletPending ? 1 : 0 });
    };

    handleMenuChange = menu => {
        if (menu === 'account') {
            this.props.router.push('/account');
        } else if (menu === 'security') {
            this.props.router.push('/security');
        } else if (menu === 'verification') {
            this.props.router.push('/verification');
        } else if (menu === 'wallet') {
            this.props.router.push('/wallet');
        } else if (menu === 'settings') {
            this.props.router.push('/settings');
        } /* else if (menu === 'api') {
			this.props.router.push('/api');
		} */else if (menu === 'summary') {
            this.props.router.push('/summary');
        }
        this.setState({ activeMenu: menu });
    };

    setActiveMenu = path => {
        let activeMenu = this.state.activeMenu;
        switch (path) {
            case '/account':
            case '/summary':
                activeMenu = 'summary';
                break;
            case '/wallet':
                activeMenu = 'wallet';
                break;
            case '/security':
                activeMenu = 'security';
                break;
            case '/settings':
                activeMenu = 'settings';
                break;
            case '/verification':
                activeMenu = 'verification';
                break;
            case '/api':
                activeMenu = 'api';
                break;
            default:
                activeMenu = '';
                break;
        };
        this.setState({ activeMenu });
    };

    render() {
        const { activeMenu, securityPending, verificationPending, walletPending } = this.state;
        return (
            <div className="d-flex justify-content-between">
                <div className="app-menu-bar d-flex align-items-end justify-content-center title-font apply_rtl">
                    <div
                        className={classnames("app-menu-bar-content d-flex", { 'active-menu': activeMenu === 'summary' })}
                        onClick={() => this.handleMenuChange('summary')}>
                        <div className="app-menu-bar-content-item d-flex">
                            <ReactSVG path={ICONS.TAB_SUMMARY} wrapperClassName="app-menu-bar-icon" />
                            {STRINGS.ACCOUNTS.TAB_SUMMARY}
                        </div>
                    </div>
                    <div
                        className={
                            classnames(
                                "app-menu-bar-content d-flex",
                                {
                                    'notification': !!walletPending && IS_XHT,
                                    'active-menu': activeMenu === 'wallet'
                                })
                        }
                        onClick={() => this.handleMenuChange('wallet')}>
                        <div className="app-menu-bar-content-item d-flex">
                            {!!walletPending && IS_XHT &&
                                <div
                                    className="app-menu-bar-icon-notification">
                                    {walletPending}
                                </div>
                            }
                            <ReactSVG path={ICONS.TAB_WALLET} wrapperClassName="app-menu-bar-icon" />
                            {STRINGS.ACCOUNTS.TAB_WALLET}
                        </div>
                    </div>
                    <div
                        className={
                            classnames(
                                'app-menu-bar-content d-flex',
                                {
                                    'notification': !!securityPending,
                                    'active-menu': activeMenu === 'security'
                                })
                        }
                        onClick={() => this.handleMenuChange('security')}>
                        <div className="app-menu-bar-content-item d-flex">
                            {!!securityPending &&
                                <div
                                    className="app-menu-bar-icon-notification">
                                    {securityPending}
                                </div>
                            }
                            <ReactSVG path={ICONS.TAB_SECURITY} wrapperClassName="app-menu-bar-icon" />
                            {STRINGS.ACCOUNTS.TAB_SECURITY}
                        </div>
                    </div>
                    <div
                        className={
                            classnames(
                                'app-menu-bar-content d-flex',
                                {
                                    'notification': !!verificationPending && !IS_XHT,
                                    'active-menu': activeMenu === 'verification'
                                })
                        }
                        onClick={() => this.handleMenuChange('verification')}>
                        <div className="app-menu-bar-content-item d-flex">
                            {!!verificationPending && !IS_XHT &&
                                <div
                                    className="app-menu-bar-icon-notification">
                                    {verificationPending}
                                </div>
                            }
                            <ReactSVG path={ICONS.TAB_VERIFY} wrapperClassName="app-menu-bar-icon" />
                            {STRINGS.ACCOUNTS.TAB_VERIFICATION}
                        </div>
                    </div>
                    <div
                        className={classnames("app-menu-bar-content d-flex", { 'active-menu': activeMenu === 'settings' })}
                        onClick={() => this.handleMenuChange('settings')}>
                        <div className="app-menu-bar-content-item d-flex">
                            <ReactSVG path={ICONS.TAB_SETTING} wrapperClassName="app-menu-bar-icon" />
                            {STRINGS.ACCOUNTS.TAB_SETTINGS}
                        </div>
                    </div>
                    {/* <div
                        className={classnames("app-menu-bar-content d-flex", { 'active-menu': activeMenu === 'api' })}
                        onClick={() => this.handleMenuChange('api')}>
                        <div className="app-menu-bar-content-item d-flex">
                            <ReactSVG path={ICONS.TAB_API} wrapperClassName="app-menu-bar-icon" />
                            {STRINGS.ACCOUNTS.TAB_API}
                        </div>
                    </div> */}
                </div>
                <div className="app-menu-bar app-menu-bar-side"></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    coins: state.app.coins,
    activeLanguage: state.app.language,
    enabledPlugins: state.app.enabledPlugins
});

export default connect(mapStateToProps)(AppMenuBar);
