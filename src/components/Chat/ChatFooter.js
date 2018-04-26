import React from 'react';
import classnames from 'classnames';
import { ChatMessageBox } from '../';

export const ChatFooter = ({
	sendMessage,
	setChatBoxRef,
	children,
	chatWrapperInitialized
}) => (
	<div
		className={classnames('d-flex', 'justify-content-center', 'chat-footer')}
	>
		{chatWrapperInitialized ? (
			<ChatMessageBox sendMessage={sendMessage} setChatBoxRef={setChatBoxRef} />
		) : (
			children
		)}
	</div>
);
