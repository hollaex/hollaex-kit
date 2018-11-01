import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
 
class AppMenuBar extends Component {
    render() {
        return (
            <div className="app-menu-bar d-flex align-items-end justify-content-center title-font">
                <div className="app-menu-bar-content d-flex active-menu">
                    <ReactSVG path={ICONS.TAB_SUMMARY} wrapperClassName="app-menu-bar-icon" />
                    {STRINGS.ACCOUNTS.TAB_SUMMARY}
                </div>
                <div className="app-menu-bar-content d-flex">
                    <ReactSVG path={ICONS.TAB_WALLET} wrapperClassName="app-menu-bar-icon" />
                    {STRINGS.ACCOUNTS.TAB_WALLET}
                </div>
                <div className={classnames('app-menu-bar-content d-flex', { 'notification': true })}>
                    <div className="app-menu-bar-icon-notification">1</div>
                    <ReactSVG path={ICONS.TAB_SECURITY} wrapperClassName="app-menu-bar-icon" />
                    {STRINGS.ACCOUNTS.TAB_SECURITY}
                </div>
                <div className={classnames('app-menu-bar-content d-flex', { 'notification': true })}>
                    <div className="app-menu-bar-icon-notification">2</div>
                    <ReactSVG path={ICONS.TAB_VERIFY} wrapperClassName="app-menu-bar-icon" />
                    {STRINGS.ACCOUNTS.TAB_VERIFICATION}
                </div>
                <div className="app-menu-bar-content d-flex">
                    <ReactSVG path={ICONS.TAB_SETTING} wrapperClassName="app-menu-bar-icon" />
                    {STRINGS.ACCOUNTS.TAB_SETTINGS}
                </div>
                <div className="app-menu-bar-content d-flex">
                    <ReactSVG path={ICONS.TAB_API} wrapperClassName="app-menu-bar-icon" />
                    {STRINGS.ACCOUNTS.TAB_API}
                </div>
            </div>
        );
    }
}

export default AppMenuBar;
