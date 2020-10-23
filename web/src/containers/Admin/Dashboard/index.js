import React from 'react';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';

import { ICONS } from '../../../config/constants';

import './index.css';

const CARD_LIST = [
    {
        icon: ICONS.GENERAL_SETUP,
        title: 'General exchange setup',
        description: 'Access the general setup of your exchange such as emails, footer and IP whitelisting.',
    },
    {
        icon: ICONS.USERS_SETUP,
        title: 'Users',
        description: 'Access all the users registered on your exchange. Verify their documents, upgrade their accounts and more.',
    },
    {
        icon: ICONS.GENERAL_SETUP,
        title: 'Exchange plugins',
        description: 'Give your exchange extra features such as chat, customer support and more through exchange plugins.',
    },
    {
        icon: ICONS.GENERAL_SETUP,
        title: 'Account level tiers',
        description: 'Setup user account level tiers and calibrate each account level deposit/withdrawals limits and trading fees.',
    },
    {
        icon: ICONS.GENERAL_SETUP,
        title: 'Exchange member roles',
        description: 'Invite a team to help you manage your exchange. Designate roles to your team with specific exchange setting access.',
    },
    {
        icon: ICONS.GENERAL_SETUP,
        title: 'Customize your exchange',
        description: 'Change strings, icons, add languages to customize your exchange in real-time.',
    }
];

const Dashboard = ({ constants = {} }) => {
    let showLabel = constants.api_name || '';
    return (
        <div className="admin-content-wrapper">
            <div className="flex-menu">
                <ReactSVG path={ICONS.HEX_PATTERN_ICON} wrapperClassName="sidebar-icon" />
                <div className="exchange-title">{showLabel}</div>
            </div>
            {CARD_LIST.map((list, index) => (
                <div className="admin-dash-card flex-menu">
                    <ReactSVG path={list.icon} wrapperClassName="card-icon" />
                    <div>
                        <div className="card-title">{list.title}</div>
                        <div className="card-description">{list.description}</div>
                        <div className="card-link">View more</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const mapStateToProps = (state) => ({
	constants: state.app.constants
});

export default connect(mapStateToProps)(Dashboard);
