import React, { lazy, Suspense } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import { ChatMessageBox, ButtonLink, ErrorBoundary } from 'components';
import STRINGS from 'config/localizedStrings';
import { isLoggedIn } from 'utils/token';

const ChatEmoji = lazy(() => import('./ChatEmoji'));

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
				<ErrorBoundary>
					<Suspense
						fallback={
							<div className="d-flex h-100 w-100 content-center align-center blue-link my-3">
								<LoadingOutlined />
							</div>
						}
					>
						<ChatEmoji
							handleEmojiBox={handleEmojiBox}
							onEmojiSelect={onEmojiSelect}
						/>
					</Suspense>
				</ErrorBoundary>
			)}
		</div>
	);
};

export { ChatFooter };
