import React from 'react';

import { NotificationsList, SidebarHub } from '../';
import { Logout, Help, Chat } from './rows';

const Sidebar = ({
	active,
	activePath,
	logout,
	help,
	symbol,
	changeSymbol,
	unreadMessages = 0
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
				<NotificationsList />
			</div>
			<div className="sidebar-row d-flex">
				{/*<Chat className="f-1" unreadMessages={unreadMessages} />*/}
				<Help className="f-1" onHelp={help} />
				<Logout className="f-0" onLogout={logout} />
			</div>
		</div>
	);
};

Sidebar.defaultProps = {
	active: false,
	activePath: '',
	notifications: []
};

export default Sidebar;
