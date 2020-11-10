import React from 'react';
// import Draggable from 'react-draggable';
import classnames from 'classnames';
import { ChatHeader, ChatMessageList, ChatFooter } from './';
import { isMobile } from 'react-device-detect';

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
	removeMessage,
	chatIsClosed,
	set_username,
	showEmojiBox,
	handleEmojiBox,
	onEmojiSelect,
	onCloseEmoji,
}) => {
	const chatInitialized =
		chatSocketInitialized && !chatSocketInitializing ? true : false;
	const usernameInitalized = username ? true : false;
	const chatWrapperInitialized =
		chatInitialized && usernameInitalized && userInitialized;

	return (
		// <Draggable
		// 	disabled={!userInitialized || minimized || isMobile}
		// 	cancel=".nondraggable"
		// >
		<div
			className={classnames(
				'd-flex',
				'flex-column',
				'chat-wrapper',
				'apply_rtl',
				minimized && 'minimized',
				unreadMessages > 0 && 'unread-messages'
			)}
		>
			{!isMobile && (
				<ChatHeader
					title={minimized && unreadMessages > 0 ? unreadMessages : title}
					minimizeChat={minimizeChat}
					minimized={minimized}
					unreadMessages={unreadMessages}
					onCloseEmoji={onCloseEmoji}
				/>
			)}
			<div className="d-flex flex-column nondraggable">
				<ChatMessageList
					chatInitialized={chatInitialized}
					usernameInitalized={usernameInitalized}
					userInitialized={userInitialized}
					username={username}
					userType={userType}
					messages={messages}
					showEmojiBox={showEmojiBox}
					removeMessage={removeMessage}
					chatIsClosed={chatIsClosed}
					onCloseEmoji={onCloseEmoji}
				/>
				<ChatFooter
					set_username={set_username}
					chatWrapperInitialized={chatWrapperInitialized}
					sendMessage={sendMessage}
					setChatBoxRef={setChatBoxRef}
					showEmojiBox={showEmojiBox}
					handleEmojiBox={handleEmojiBox}
					onEmojiSelect={onEmojiSelect}
				/>
			</div>
		</div>
		// </Draggable>
	);
};
