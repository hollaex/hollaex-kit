import React from 'react';

import { NotificationsList, Logout, SidebarHub } from '../';

const Sidebar = ({
	goToWalletPage,
	goToTradePage,
	active,
	activePath,
	logout,
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
			<Logout className="sidebar-logout" onLogout={logout} />
		</div>
	);
};

Sidebar.defaultProps = {
	active: false,
	activePath: '',
	notifications: []
};

export default Sidebar;
