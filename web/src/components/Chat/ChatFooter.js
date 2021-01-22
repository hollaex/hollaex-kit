import React from 'react';
import classnames from 'classnames';

import { ChatMessageBox, ButtonLink } from '../';
import ChatEmoji from './ChatEmoji';
import STRINGS from '../../config/localizedStrings';
import { isLoggedIn } from '../../utils/token';

const ChatFooter = ({
	sendMessage,
	setChatBoxRef,
	chatWrapperInitialized,
	set_username,
	showEmojiBox = false,
	handleEmojiBox,
	onEmojiSelect,
}) => {
	return (
		<div
			className={
				set_username
					? classnames(
							'd-flex',
							'apply_rtl',
							'justify-content-center',
							'flex-column',
							'chat-footer'
					  )
					: classnames(
							'd-flex',
							'justify-content-center',
							'flex-column',
							'chat-footer',
							'chat-username-footer'
					  )
			}
		>
			{!isLoggedIn() ? (
				<div className="d-flex w-100 p-1">
					<div className="w-50">
						<ButtonLink
							link={'/signup'}
							type="button"
							label={STRINGS['SIGNUP_TEXT']}
						/>
					</div>
					<div className="separator" />
					<div className="w-50">
						<ButtonLink
							link={'/login'}
							type="button"
							label={STRINGS['LOGIN_TEXT']}
						/>
					</div>
				</div>
			) : (
				chatWrapperInitialized && (
					<ChatMessageBox
						set_username={set_username}
						sendMessage={sendMessage}
						setChatBoxRef={setChatBoxRef}
						handleEmojiBox={handleEmojiBox}
					/>
				)
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
