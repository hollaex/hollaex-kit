import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
 
class AppMenuBar extends Component {
    state = {
        activeMenu: ''
    };

    componentDidMount() {
        if (this.props.location && this.props.location.pathname) {
            this.setActiveMenu(this.props.location.pathname);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location && nextProps.location
            && this.props.location.pathname !== nextProps.location.pathname) {
            this.setActiveMenu(nextProps.location.pathname);
        }
    }

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
		}  else if (menu === 'summary') {
			this.props.router.push('/summary');
		} */
        this.setState({ activeMenu: menu });
    };

    setActiveMenu = path => {
        let activeMenu = this.state.activeMenu;
        switch (path) {
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
        const { activeMenu } = this.state;
        return (
            <div className="d-flex justify-content-between">
                <div className="app-menu-bar d-flex align-items-end justify-content-center title-font">
                    <div
                        className={classnames("app-menu-bar-content d-flex", { 'active-menu': activeMenu === 'summary' })}
                        onClick={() => this.handleMenuChange('summary')}>
                        <div className="app-menu-bar-content-item d-flex">
                            <ReactSVG path={ICONS.TAB_SUMMARY} wrapperClassName="app-menu-bar-icon" />
                            {STRINGS.ACCOUNTS.TAB_SUMMARY}
                        </div>
                    </div>
                    <div
                        className={classnames("app-menu-bar-content d-flex", { 'active-menu': activeMenu === 'wallet' })}
                        onClick={() => this.handleMenuChange('wallet')}>
                        <div className="app-menu-bar-content-item d-flex">
                            <ReactSVG path={ICONS.TAB_WALLET} wrapperClassName="app-menu-bar-icon" />
                            {STRINGS.ACCOUNTS.TAB_WALLET}
                        </div>
                    </div>
                    <div
                        className={classnames('app-menu-bar-content d-flex', { 'notification': true, 'active-menu': activeMenu === 'security' })}
                        onClick={() => this.handleMenuChange('security')}>
                        <div className="app-menu-bar-content-item d-flex">
                            <div className="app-menu-bar-icon-notification">1</div>
                            <ReactSVG path={ICONS.TAB_SECURITY} wrapperClassName="app-menu-bar-icon" />
                            {STRINGS.ACCOUNTS.TAB_SECURITY}
                        </div>
                    </div>
                    <div
                        className={classnames('app-menu-bar-content d-flex', { 'notification': true, 'active-menu': activeMenu === 'verification' })}
                        onClick={() => this.handleMenuChange('verification')}>
                        <div className="app-menu-bar-content-item d-flex">
                            <div className="app-menu-bar-icon-notification">2</div>
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
                    <div
                        className={classnames("app-menu-bar-content d-flex", { 'active-menu': activeMenu === 'api' })}
                        onClick={() => this.handleMenuChange('api')}>
                        <div className="app-menu-bar-content-item d-flex">
                            <ReactSVG path={ICONS.TAB_API} wrapperClassName="app-menu-bar-icon" />
                            {STRINGS.ACCOUNTS.TAB_API}
                        </div>
                    </div>
                </div>
                <div className="app-menu-bar app-menu-bar-side"></div>
            </div>
        );
    }
}

export default AppMenuBar;
