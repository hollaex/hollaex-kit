import React from 'react';
import Draggable from 'react-draggable';
import classnames from 'classnames';
import { ChatHeader, ChatMessageList, ChatFooter } from './';

export const ChatWrapper = ({
	chatSocketInitializing,
	chatSocketInitialized,
	title,
	username = '',
	messages,
	sendMessage,
	setChatBoxRef,
	userInitialized = false,
	minimizeChat,
	minimized,
	unreadMessages,
	userType,
	removeMessage
}) => {
	const chatInitialized =
		chatSocketInitialized && !chatSocketInitializing ? true : false;
	const usernameInitalized = username ? true : false;
	const chatWrapperInitialized = chatInitialized && usernameInitalized && userInitialized

	return (
		<Draggable disabled={!userInitialized || minimized} cancel=".chat-message-box">
			<div
				className={classnames(
					'd-flex',
					'flex-column',
					'chat-wrapper',
					minimized && 'minimized',
					unreadMessages > 0 && 'unread-messages'
				)}
			>
				<ChatHeader
					title={minimized && unreadMessages > 0 ? unreadMessages : title}
					minimizeChat={minimizeChat}
					minimized={minimized}
				/>
				<ChatMessageList
					chatInitialized={chatInitialized}
					usernameInitalized={usernameInitalized}
					userInitialized={userInitialized}
					username={username}
					userType={userType}
					messages={messages}
					removeMessage={removeMessage}
				/>
				<ChatFooter
					chatWrapperInitialized={chatWrapperInitialized}
					sendMessage={sendMessage}
					setChatBoxRef={setChatBoxRef}
				/>
			</div>
		</Draggable>
	);
};
