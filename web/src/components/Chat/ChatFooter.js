import React from 'react';
import classnames from 'classnames';
import { ChatMessageBox } from '../';

export const ChatFooter = ({
	sendMessage,
	setChatBoxRef,
	chatWrapperInitialized,
	set_username
}) => (
	<div
		className={set_username ? classnames('d-flex', 'justify-content-center', 'chat-footer'):
		classnames('d-flex', 'justify-content-center', 'chat-footer', 'chat-username-footer')
		}
	>
		{chatWrapperInitialized && (
			<ChatMessageBox set_username={set_username} sendMessage={sendMessage} setChatBoxRef={setChatBoxRef} />
		)}
	</div>
);
