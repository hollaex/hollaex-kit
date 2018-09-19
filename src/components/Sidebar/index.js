import React from 'react';

import { NotificationsList, SidebarHub } from '../';
import { Logout, Help, Chat } from './rows';

const Sidebar = ({
	isLogged,
	active,
	activePath,
	logout,
	minimizeChat,
	help,
	pair,
	chatIsClosed,
	theme,
	unreadMessages = 0
}) => {
	const sidebarHubProps = {
		activePath,
		pair,
		isLogged,
		theme
	};
	return (
		<div className="sidebar-container apply_rtl">
			<SidebarHub {...sidebarHubProps} />
			{isLogged ?
			<div className="sidebar-notifications">
				<NotificationsList />
			</div>: '' }
			{isLogged ?
			<div className="sidebar-row d-flex">
				<Chat
					className="f-1"
					onMinimize={minimizeChat}
					unreadMessages={unreadMessages}
					chatIsClosed={chatIsClosed}
				/>
				<Help className="f-1" onHelp={help} />
				<Logout className="f-0" onLogout={logout} />
			</div> : ''}
		</div>
	);
};

Sidebar.defaultProps = {
	active: false,
	activePath: '',
	notifications: []
};

export default Sidebar;
