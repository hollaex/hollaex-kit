import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

import { STATIC_ICONS } from 'config/icons';
import { setEditMode } from 'actions/appActions';

import './index.css';
import OperatorControlSearch from '../AppWrapper/OperatorControlSearch';

const CARD_LIST = [
	{
		icon: STATIC_ICONS.GENERAL_SETUP,
		title: 'General exchange setup',
		description:
			'Access the general setup of your exchange such as emails, footer and IP whitelisting.',
		path: '/admin/general',
	},
	{
		icon: STATIC_ICONS.USERS_SETUP,
		title: 'Users',
		description:
			'Access all the users registered on your exchange. Verify their documents, upgrade their accounts and more.',
		path: '/admin/user',
	},
	{
		icon: STATIC_ICONS.DIGITAL_ASSETS_ICON,
		title: 'Digital Assets',
		description:
			'Manage the list of crypto assets available on your exchange. Add new tokens, control deposit & withdrawal status, and configure asset settings.',
		path: '/admin/financials',
	},
	{
		icon: STATIC_ICONS.MARKET_ICON,
		title: 'Markets',
		description:
			'Manage trading pairs for your exchange, launch an OTC desk, open orderbooks, set prices and fees, and control market availability.',
		path: '/admin/trade',
	},
	{
		icon: STATIC_ICONS.FIAT_CONTROLS_ICON,
		title: 'Fiat Controls',
		description:
			'Connect third-party payment systems to enable on/off ramps, allowing users to deposit and withdraw in local fiat currencies.',
		path: '/admin/fiat',
	},
	{
		icon: STATIC_ICONS.STAKING_ICON,
		title: 'Staking',
		description:
			'Offer staking rewards to your users by enabling supported assets and configuring pools with custom APY, slashing rules, & lock-up periods.',
		path: '/admin/stakes',
	},
	{
		icon: STATIC_ICONS.ADMIN_PLUGINS,
		title: 'Exchange plugins',
		description:
			'Give your exchange extra features such as chat, customer support and more through exchange plugins.',
		path: '/admin/plugins',
	},
	{
		icon: STATIC_ICONS.ADMIN_TIERS,
		title: 'Account level tiers',
		description:
			'Setup user account level tiers and calibrate each account level deposit/withdrawals limits and trading fees.',
		path: '/admin/tiers',
	},
	{
		icon: STATIC_ICONS.ADMIN_ROLES,
		title: 'Exchange member roles',
		description:
			'Invite a team to help you manage your exchange. Designate roles to your team with specific exchange setting access.',
		path: '/admin/roles',
	},
	{
		icon: STATIC_ICONS.ADMIN_CUSTOMIZE,
		title: 'Customize your exchange',
		description:
			'Change strings, icons, add languages to customize your exchange in real-time.',
		path: '/account',
	},
];

const Dashboard = ({ constants = {}, setEditMode = () => {} }) => {
	let showLabel = constants.api_name || '';

	const [isDisplaySearch, setIsDisplaySearch] = useState(false);
	const [search, setSearch] = useState('');

	const onHandleSearch = (text) => {
		setSearch(text);
	};

	const onHandleClose = () => {
		setIsDisplaySearch(false);
		setSearch('');
	};

	return (
		<div className="admin-content-wrapper">
			<Modal
				visible={isDisplaySearch}
				onCancel={onHandleClose}
				footer={null}
				maskClosable={false}
				className="operator-control-search-popup"
			>
				<OperatorControlSearch
					onHandleClose={onHandleClose}
					search={search}
					setSearch={onHandleSearch}
				/>
			</Modal>
			<div className="flex-menu">
				<ReactSVG
					src={constants.logo_image || STATIC_ICONS.HEX_PATTERN_ICON}
					className="sidebar-icon"
					fallback={() => (
						<img
							src={constants.logo_image || STATIC_ICONS.HEX_PATTERN_ICON}
							alt="exchange-logo"
							className="sidebar-icon"
						/>
					)}
				/>
				<div className="exchange-title">{showLabel}</div>
			</div>
			<div className="admin-dash-card-wrapper">
				{CARD_LIST.map((list, index) => (
					<div key={index} className="admin-dash-card flex-menu">
						<div>
							<ReactSVG src={list.icon} className="card-icon" />
						</div>
						<div>
							<div className="card-title">{list.title}</div>
							<div className="card-description">{list.description}</div>
							<div className="card-link">
								<span
									onClick={() => {
										setEditMode(true);
									}}
								>
									<Link to={list.path}>View more</Link>
								</span>
							</div>
						</div>
					</div>
				))}
				<div className="admin-dash-card flex-menu">
					<div>
						<ReactSVG
							src={STATIC_ICONS['OPERATOR_CONTROL_SEARCH']}
							className="card-icon operator-control-search-icon"
						/>
					</div>
					<div>
						<div className="card-title">Search</div>
						<div className="card-description">
							Explore exchange functions, pages and features.
						</div>
						<div className="card-link">
							<span
								className="pointer underline-text"
								onClick={() => setIsDisplaySearch(true)}
							>
								View more
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	setEditMode: bindActionCreators(setEditMode, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
