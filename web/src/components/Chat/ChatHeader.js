import React from 'react';
import classnames from 'classnames';
import STRINGS from '../../config/localizedStrings';

export const MinimalizeChat = ({ minimized, onClick }) => (
	<div className={classnames('d-flex', 'minimize-button')} onClick={onClick}>
		<div className={minimized ? 'maximize-arrow' : 'minimize-button-content'} />
	</div>
);

export const ChatHeader = ({
	title,
	chatWrapperInitialized,
	minimized,
	minimizeChat,
	unreadMessages,
	onCloseEmoji,
}) => (
	<div
		className={classnames(
			'd-flex',
			'apply_rtl',
			'justify-content-between',
			'align-items-center',
			'chat-header'
		)}
		onClick={
			minimized
				? () => {
						minimizeChat();
						onCloseEmoji();
				  }
				: onCloseEmoji
		}
	>
		<div className="chat-header-txt">
			{STRINGS.formatString(STRINGS['CHAT.TROLLBOX'], unreadMessages)}
		</div>
		{/* <div className="d-flex chat-header-icon" /> */}
		<MinimalizeChat minimized={minimized} onClick={minimizeChat} />
	</div>
);
