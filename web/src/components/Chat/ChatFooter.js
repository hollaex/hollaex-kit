import React from 'react';
import classnames from 'classnames';

import { ChatMessageBox } from '../';
import ChatEmoji from './ChatEmoji';

const ChatFooter = ({
	sendMessage,
	setChatBoxRef,
	chatWrapperInitialized,
	set_username,
	showEmojiBox = false,
	handleEmojiBox,
	onEmojiSelect
}) => {
	return (
		<div
			className={set_username ? classnames('d-flex', 'justify-content-center', 'flex-column', 'chat-footer') :
				classnames('d-flex', 'justify-content-center', 'flex-column', 'chat-footer', 'chat-username-footer')
			}
		>
			{chatWrapperInitialized && (
				<ChatMessageBox
					set_username={set_username}
					sendMessage={sendMessage}
					setChatBoxRef={setChatBoxRef}
					handleEmojiBox={handleEmojiBox}
				/>
			)}
			{showEmojiBox && (
				<ChatEmoji
					handleEmojiBox={handleEmojiBox}
					onEmojiSelect={onEmojiSelect}
				/>
			)}
		</div>
	);
};

export { ChatFooter };
