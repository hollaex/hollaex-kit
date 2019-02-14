import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

class MenuList extends Component {

    componentDidMount() {
        document.addEventListener('click', this.onOutsideClick);
    }

    onOutsideClick = event => {
        const element = document.getElementById('tab-account-menu');
        if (element &&
            event.target !== element &&
            !element.contains(event.target)) {
            this.props.closeAccountMenu();
        }
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.onOutsideClick);
    }

    logout = () => {
        this.props.logout();
        this.props.closeAccountMenu();
    }

    render() {
        const { selectedMenu, handleMenu, securityPending, verificationPending } = this.props;
        return (
            <div id="tab-account-menu" className="app-bar-account-menu">
                <div
                    className={classnames("app-bar-account-menu-list d-flex", { 'menu-active': selectedMenu === 'summary' })}
                    onClick={() => handleMenu('summary')}>
                    <div className="notification-content"></div>
                    <ReactSVG path={ICONS.TAB_SUMMARY} wrapperClassName="app-bar-account-list-icon" />
                    {STRINGS.ACCOUNTS.TAB_SUMMARY}
                </div>
                <div
                    className={classnames("app-bar-account-menu-list d-flex", { 'menu-active': selectedMenu === 'wallet' })} 
                    onClick={() => handleMenu('wallet')}>
                    <div className="notification-content"></div>
                    <ReactSVG path={ICONS.TAB_WALLET} wrapperClassName="app-bar-account-list-icon" />
                    {STRINGS.ACCOUNTS.TAB_WALLET}
                </div>
                <div
                    className={classnames('app-bar-account-menu-list d-flex', { 'notification': !!securityPending })}
                    onClick={() => handleMenu('security')}>
                    <div className="notification-content">
                        {!!securityPending && <div className="app-bar-account-list-notification">{securityPending}</div>}
                    </div>
                    <ReactSVG path={ICONS.TAB_SECURITY} wrapperClassName="app-bar-account-list-icon" />
                    {STRINGS.ACCOUNTS.TAB_SECURITY}
                </div>
                <div
                    className={classnames('app-bar-account-menu-list d-flex', { 'notification': !!verificationPending })}
                    onClick={() => handleMenu('verification')}>
                    <div className="notification-content">
                        {!!verificationPending && <div className="app-bar-account-list-notification">{verificationPending}</div>}
                    </div>
                    <ReactSVG path={ICONS.TAB_VERIFY} wrapperClassName="app-bar-account-list-icon" />
                    {STRINGS.ACCOUNTS.TAB_VERIFICATION}
                </div>
                <div
                    className={classnames("app-bar-account-menu-list d-flex", { 'menu-active': selectedMenu === 'settings' })}
                    onClick={() => handleMenu('settings')}>
                    <div className="notification-content"></div>
                    <ReactSVG path={ICONS.TAB_SETTING} wrapperClassName="app-bar-account-list-icon" />
                    {STRINGS.ACCOUNTS.TAB_SETTINGS}
                </div>
                {/* <div 
                    className={classnames("app-bar-account-menu-list d-flex", { 'menu-active': selectedMenu === 'api' })}
                    onClick={() => handleMenu('api')}>
                    <div className="notification-content"></div>
                    <ReactSVG path={ICONS.TAB_API} wrapperClassName="app-bar-account-list-icon" />
                    {STRINGS.ACCOUNTS.TAB_API}
                </div> */}
                <div
                    className="app-bar-account-menu-list d-flex" onClick={this.logout}>
                    <div className="notification-content"></div>
                    <ReactSVG path={ICONS.TAB_SIGNOUT} wrapperClassName="app-bar-account-list-icon" />
                    {STRINGS.ACCOUNTS.TAB_SIGNOUT}
                </div>
            </div>
        );
    }
};

export default MenuList;