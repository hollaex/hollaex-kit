import React from 'react';
import classnames from 'classnames';
import { ChatMessageBox } from '../';

export const ChatFooter = ({
	sendMessage,
	setChatBoxRef,
	chatWrapperInitialized,
	usernameIsSet
}) => (
	<div
		className={usernameIsSet ? classnames('d-flex', 'justify-content-center', 'chat-footer'):
		classnames('d-flex', 'justify-content-center', 'chat-footer', 'chat-username-footer')
		}
	>
		{chatWrapperInitialized && (
			<ChatMessageBox usernameIsSet={usernameIsSet} sendMessage={sendMessage} setChatBoxRef={setChatBoxRef} />
		)}
	</div>
);
