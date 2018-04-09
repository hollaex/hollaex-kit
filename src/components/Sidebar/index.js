import React from 'react';

import { NotificationsList, SidebarHub } from '../';
import { Logout, Help } from './rows';

const Sidebar = ({
	active,
	activePath,
	logout,
	help,
	notifications,
	symbol,
	changeSymbol
}) => {
	const sidebarHubProps = {
		activePath,
		currency: symbol,
		changeCurrency: changeSymbol
	};
	return (
		<div className="sidebar-container apply_rtl">
			<SidebarHub {...sidebarHubProps} />
			<div className="sidebar-notifications">
				<NotificationsList notifications={notifications} />
			</div>
			<Help className="sidebar-row" onHelp={help} />
			<Logout className="sidebar-row" onLogout={logout} />
		</div>
	);
};

Sidebar.defaultProps = {
	active: false,
	activePath: '',
	notifications: []
};

export default Sidebar;
