import React from 'react';
import classnames from 'classnames';
import Textarea from 'react-expanding-textarea';
import STRINGS from '../../config/localizedStrings';

const MAX_LENGTH = 400;

export const ChatMessageBox = ({
	value,
	onChange,
	sendMessage,
	setChatBoxRef
}) => (
	<div className={classnames('d-flex')} style={{flex:1}}>
		<Textarea
			ref={setChatBoxRef}
			rows="1"
			maxLength={MAX_LENGTH}
			className="chat-message-box"
			placeholder={STRINGS.CHAT.CHAT_MESSAGE_BOX_PLACEHOLDER}
			onKeyPress={sendMessage}
		/>
	</div>
);
