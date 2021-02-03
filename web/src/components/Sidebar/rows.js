import React from 'react';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
import { ICONS, FLEX_CENTER_CLASSES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

export const Cell = ({
	className,
	iconClassName,
	onClick,
	text,
	iconPath,
	children,
}) => (
	<div
		className={classnames(
			className,
			FLEX_CENTER_CLASSES,
			'cell-wrapper',
			'pointer'
		)}
		onClick={() => onClick()}
	>
		{text && (
			<div className="sidebar-row--left text-uppercase w-100 text-center">
				{text}
			</div>
		)}
		{iconPath && (
			<div className="sidebar-row--right">
				<ReactSVG
					src={iconPath}
					className={classnames('sidebar-row--right-icon', iconClassName)}
				/>
			</div>
		)}
		{children}
	</div>
);

export const Chat = ({ onMinimize, unreadMessages = 0, ...rest }) => {
	const text =
		unreadMessages > 0
			? STRINGS.formatString(
					STRINGS['CHAT.CHAT_UNREAD'],
					STRINGS['CHAT.MARKET_CHAT'],
					unreadMessages
			  )
			: STRINGS['CHAT.MARKET_CHAT'];

	return (
		<Cell
			onClick={onMinimize}
			{...rest}
			iconClassName="icon--chat"
			iconPath={ICONS.SIDEBAR_CHAT}
		>
			<div className="ml-2">{text}</div>
		</Cell>
	);
};

export const Logout = ({ onLogout, ...rest }) => (
	<Cell
		onClick={onLogout}
		{...rest}
		iconPath={ICONS.LOGOUT_DOOR_INACTIVE}
		iconClassName="icon--logout"
	/>
);

export const Help = ({ onHelp, ...rest }) => (
	<Cell
		onClick={onHelp}
		{...rest}
		iconClassName="icon--help"
		iconPath={ICONS.SIDEBAR_HELP}
	/>
);
