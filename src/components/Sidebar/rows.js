import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

import { Chat as ChatComponent } from '../../containers';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

export const Cell = ({
	className,
	iconClassName,
	onClick,
	text,
	iconPath,
	children
}) => (
	<div
		className={classnames(
			className,
			'd-flex',
			'justify-content-between',
			'align-items-center',
			'cell-wrapper',
			'pointer'
		)}
		onClick={onClick}
	>
		{text && (
			<div className="sidebar-row--left text-uppercase w-100 text-center">
				{text}
			</div>
		)}
		{iconPath && (
			<div className="sidebar-row--right">
				<ReactSVG
					path={iconPath}
					wrapperClassName={classnames(
						'sidebar-row--right-icon',
						iconClassName
					)}
				/>
			</div>
		)}
		{children}
	</div>
);

export const Chat = ({ unreadMessages = 0, ...rest }) => {
	const text =
		unreadMessages > 0
			? STRINGS.formatString(
					STRINGS.CHAT.CHAT_UNREAD,
					STRINGS.CHAT.CHAT_TEXT,
					unreadMessages
				)
			: STRINGS.CHAT.CHAT_TEXT;

	return (
		<Cell {...rest} text={text}>
			<ChatComponent />
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
	<Cell onClick={onHelp} {...rest} text={STRINGS.HELP_TEXT} />
);
