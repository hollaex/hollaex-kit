import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

const MenuList = ({ selectedMenu, handleMenu, logout }) => {
    return (
        <div className="app-bar-account-menu">
            <div 
                className={classnames("d-flex app-bar-account-menu-list", { 'menu-active': selectedMenu === 'account' })}
                onClick={() => handleMenu('account')}>
                <div className="notification-content"></div>
                <div className="app-bar-account-content mr-2">
                    <ReactSVG path={ICONS.SIDEBAR_ACCOUNT_ACTIVE} wrapperClassName="app-bar-account-list-icon" />
                    <div className="app-bar-account-menu-notification">2</div>
                </div>
                <div>{STRINGS.ACCOUNT_TEXT}</div>
            </div>
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
                className={classnames('app-bar-account-menu-list d-flex', { 'notification': true })}
                onClick={() => handleMenu('security')}>
                <div className="notification-content">
                    <div className="app-bar-account-list-notification">1</div>
                </div>
                <ReactSVG path={ICONS.TAB_SECURITY} wrapperClassName="app-bar-account-list-icon" />
                {STRINGS.ACCOUNTS.TAB_SECURITY}
            </div>
            <div
                className={classnames('app-bar-account-menu-list d-flex', { 'notification': true })}
                onClick={() => handleMenu('verification')}>
                <div className="notification-content">
                    <div className="app-bar-account-list-notification">2</div>
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
            <div 
                className={classnames("app-bar-account-menu-list d-flex", { 'menu-active': selectedMenu === 'api' })}
                onClick={() => handleMenu('api')}>
                <div className="notification-content"></div>
                <ReactSVG path={ICONS.TAB_API} wrapperClassName="app-bar-account-list-icon" />
                {STRINGS.ACCOUNTS.TAB_API}
            </div>
            <div 
                className="app-bar-account-menu-list d-flex" onClick={logout}>
                <div className="notification-content"></div>
                <ReactSVG path={ICONS.TAB_SIGNOUT} wrapperClassName="app-bar-account-list-icon" />
                {STRINGS.ACCOUNTS.TAB_SIGNOUT}
            </div>
        </div>
    );
};

export default MenuList;