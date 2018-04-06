import React from 'react';

import { NotificationsList, SidebarHub } from '../';
import { Logout, Help } from './rows';

const Sidebar = ({
	goToWalletPage,
	goToTradePage,
	active,
	activePath,
	logout,
	help,
	notifications,
	symbol,
	changeSymbol,
	goToAccountPage,
	goToQuickTradePage
}) => {
	const sidebarHubProps = {
		goToQuickTradePage,
		goToWalletPage,
		goToTradePage,
		goToAccountPage,
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
