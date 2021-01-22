import React from 'react';
import classnames from 'classnames';
import Textarea from 'react-expanding-textarea';
import { Link } from 'react-router';
import { ReactSVG } from 'react-svg';

import { STATIC_ICONS } from 'config/icons';
import STRINGS from '../../config/localizedStrings';

const MAX_LENGTH = 480;

export const ChatMessageBox = ({
	value,
	onChange,
	sendMessage,
	setChatBoxRef,
	set_username,
	handleEmojiBox,
}) =>
	set_username ? (
		<div className={classnames('d-flex')} style={{ flex: 1 }}>
			<Textarea
				ref={setChatBoxRef}
				rows="1"
				maxLength={MAX_LENGTH}
				className="chat-message-box"
				placeholder={STRINGS['CHAT.CHAT_MESSAGE_BOX_PLACEHOLDER']}
				onKeyPress={sendMessage}
			/>
			<div
				className="d-flex align-items-center justify-content-center chat-emoji-wrapper"
				onClick={handleEmojiBox}
			>
				<ReactSVG src={STATIC_ICONS.CHAT_EMOJI} className="chat-emoji-icon" />
			</div>
		</div>
	) : (
		<div
			className={classnames(
				'd-flex justify-content-center',
				'username-to-chat'
			)}
		>
			<Link className="pointer" to={'/account/settings/username?tab=3'}>
				SET USERNAME TO CHAT
			</Link>
		</div>
	);
