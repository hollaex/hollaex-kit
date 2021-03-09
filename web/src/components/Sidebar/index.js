import React from 'react';
import classnames from 'classnames';

import { NotificationsList, SidebarHub } from '../';
import STRINGS from '../../config/localizedStrings';

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
	unreadMessages = 0,
	sidebarFitHeight = false,
	enabledPlugins,
}) => {
	const sidebarHubProps = {
		activePath,
		pair,
		isLogged,
		theme,
	};
	return (
		<div
			className={classnames('sidebar-container apply_rtl', {
				'sidebar-fit-to-screen': sidebarFitHeight,
			})}
		>
			<SidebarHub {...sidebarHubProps} />
			{enabledPlugins.includes('announcements') ? (
				<div className="sidebar-notifications m-3">
					<div className="ml-3 my-3 sidebar-title">
						{STRINGS['TRADE_TAB_POSTS'].toUpperCase()}
					</div>
					<NotificationsList />
				</div>
			) : null}
			{/* {isLogged ?
			<div className="sidebar-row d-flex">
				<Chat
					className="f-1 title-font text-capitalize justify-content-center"
					onMinimize={minimizeChat}
					unreadMessages={unreadMessages}
					chatIsClosed={chatIsClosed}
				/>
				<Help className="f-8" onHelp={help} />
				<Logout className="f-0" onLogout={logout} />
			</div> : ''} */}
		</div>
	);
};

Sidebar.defaultProps = {
	active: false,
	activePath: '',
	notifications: [],
};

export default Sidebar;
