import React, { Component } from 'react';
import classnames from 'classnames';
import { Emoji } from 'emoji-mart';
import ReactSVG from 'react-svg';

import { ChatMessageBox } from '../';
import { customEmojis } from './utils';
import { ICONS } from '../../config/constants';


class ChatFooter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedCategory: customEmojis[0] ? customEmojis[0].id : ''
		}
	}
	
	onClickEmoji = (category) => {
		this.setState({ selectedCategory: category });
	}

	render() {
		const {
			sendMessage,
			setChatBoxRef,
			chatWrapperInitialized,
			set_username,
			showEmojiBox = false,
			handleEmojiBox,
			onEmojiSelect,
			handleTextFocus
		} = this.props;
		const selectedEmojis = customEmojis.filter((data) => data.id === this.state.selectedCategory)
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
						handleTextFocus={handleTextFocus}
					/>
				)}
				{showEmojiBox && (
					<div className="d-flex flex-wrap emoji-container">
						<div className="d-flex justify-content-between chat-category">
							<div className="d-flex flex-wrap">
								{customEmojis.map(((emoji, index) => {
									return (
										<div key={index} className="mt-1 pointer top-background">
											<div className={classnames({ 'activeEmoji': this.state.selectedCategory === emoji.id })}>
												<Emoji
													emoji={
														emoji.custom
															? { ...emoji }
															: { id: emoji.id, skin: emoji.skin }
													}
													size={18}
													onClick={() => this.onClickEmoji(emoji.id)}
												/>
											</div>

										</div>
									)
								}))}
							</div>
							<div onClick={handleTextFocus}>
								<ReactSVG
									path={ICONS.CANCEL_CROSS_ACTIVE}
									wrapperClassName="cross-icon-back"
								/>
							</div>
						</div>
						{selectedEmojis.map((emoji, key) => {
							return <div key={key} className="d-flex flex-wrap">
								{emoji.emojis.map((emoji, index) => {
									return (
										<div key={index} className="pointer" >
											<Emoji
												emoji={
													emoji.custom
														? { ...emoji }
														: { id: emoji.id }
												}
												size={18}
												onClick={onEmojiSelect} />
										</div>
									)
								})}
							</div>
						})
						}

					</div>
				)}
			</div>
		)
	}
}

export { ChatFooter };