import React from 'react';

import { NotificationsList, SidebarHub } from '../';
import { Help, Chat } from './rows';

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
				</div> : ''}
			{
				isLogged ?
					<div className="sidebar-row d-flex">
						<Chat
							className="f-1 title-font text-capitalize justify-content-center"
							onMinimize={minimizeChat}
							unreadMessages={unreadMessages}
							chatIsClosed={chatIsClosed}
						/>
						<Help className="f-8" onHelp={help} />
						{/* <Logout className="f-0" onLogout={logout} /> */}
					</div> : ''
			}
		</div>
	);
};

Sidebar.defaultProps = {
	active: false,
	activePath: '',
	notifications: []
};

export default Sidebar;
