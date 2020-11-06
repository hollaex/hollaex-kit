import React from 'react';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { ICONS } from '../../../config/constants';

import './index.css';

const CARD_LIST = [
    {
        icon: ICONS.GENERAL_SETUP,
        title: 'General exchange setup',
        description: 'Access the general setup of your exchange such as emails, footer and IP whitelisting.',
        path: '/admin/general'
    },
    {
        icon: ICONS.USERS_SETUP,
        title: 'Users',
        description: 'Access all the users registered on your exchange. Verify their documents, upgrade their accounts and more.',
        path: '/admin/user'
    },
    {
        icon: ICONS.ADMIN_PLUGINS,
        title: 'Exchange plugins',
        description: 'Give your exchange extra features such as chat, customer support and more through exchange plugins.',
        path: '/admin/plugins'
    },
    {
        icon: ICONS.ADMIN_TIERS,
        title: 'Account level tiers',
        description: 'Setup user account level tiers and calibrate each account level deposit/withdrawals limits and trading fees.',
        path: '/admin/tiers'
    },
    {
        icon: ICONS.ADMIN_ROLES,
        title: 'Exchange member roles',
        description: 'Invite a team to help you manage your exchange. Designate roles to your team with specific exchange setting access.',
        path: '/admin/roles'
    },
    {
        icon: ICONS.ADMIN_CUSTOMIZE,
        title: 'Customize your exchange',
        description: 'Change strings, icons, add languages to customize your exchange in real-time.',
        path: '/account'
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
                    <div>
                        <ReactSVG path={list.icon} wrapperClassName="card-icon" />
                    </div>
                    <div>
                        <div className="card-title">{list.title}</div>
                        <div className="card-description">{list.description}</div>
                        <div className="card-link">
                            <Link to={list.path}>
                                View more
                            </Link>
                        </div>
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
