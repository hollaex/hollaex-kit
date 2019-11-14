import React from 'react';
import classnames from 'classnames';
import { Emoji } from 'emoji-mart';

import { ChatMessageBox } from '../';
import { customEmojis } from './utils';

export const ChatFooter = ({
	sendMessage,
	setChatBoxRef,
	chatWrapperInitialized,
	set_username,
	showEmojiBox = false,
	handleEmojiBox,
	onEmojiSelect,
	handleTextFocus
}) => (
	<div
		className={set_username ? classnames('d-flex', 'justify-content-center', 'flex-column', 'chat-footer'):
		classnames('d-flex', 'justify-content-center', 'flex-column', 'chat-footer', 'chat-username-footer')
		}
	>
		{chatWrapperInitialized && (
			<ChatMessageBox
				set_username={set_username}
				sendMessage={sendMessage}
				setChatBoxRef={setChatBoxRef}
				handleEmojiBox={handleEmojiBox}
				handleTextFocus={handleTextFocus}
			/>
		)}
		{showEmojiBox && (
			<div className="d-flex flex-wrap emoji-container">
				{customEmojis.map(((emoji, index) => (
					<div key={index} className="mt-1 pointer">
						<Emoji
							emoji={
								emoji.custom
								? { ...emoji }
								: { id: emoji.id, skin: emoji.skin }
							}
							size={18}
							onClick={onEmojiSelect} />
					</div>
				)))}
			</div>
		)}
	</div>
);
