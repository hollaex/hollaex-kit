import React, { Component } from 'react';
import { Emoji } from 'emoji-mart';
import { ReactSVG } from 'react-svg';
import classnames from 'classnames';

import { customEmojis } from './utils';
import { STATIC_ICONS } from 'config/icons';

class ChatEmoji extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedCategory: customEmojis[0] ? customEmojis[0].id : '',
		};
	}

	onClickEmoji = (category) => {
		this.setState({ selectedCategory: category });
	};

	render() {
		const { handleEmojiBox, onEmojiSelect } = this.props;
		const selectedEmojis = customEmojis.filter(
			(data) => data.id === this.state.selectedCategory
		);
		return (
			<div>
				<div className="emoji-container">
					<div className="d-flex justify-content-between chat-category">
						<div className="d-flex flex-wrap">
							{customEmojis.map((emoji, index) => {
								return (
									<div key={index} className="mt-1 pointer top-background">
										<div
											className={classnames({
												activeEmoji: this.state.selectedCategory === emoji.id,
											})}
										>
											<Emoji
												emoji={
													emoji.custom
														? { ...emoji }
														: { id: emoji.id, skin: emoji.skin }
												}
												size={18}
												set="google"
												onClick={() => this.onClickEmoji(emoji.id)}
											/>
										</div>
									</div>
								);
							})}
						</div>
						<div className="emoji-close" onClick={handleEmojiBox}>
							<ReactSVG
								src={STATIC_ICONS.CANCEL_CROSS_ACTIVE}
								className="cross-icon-back"
							/>
						</div>
					</div>
					<div className="d-flex flex-wrap align-content-start py-2 emoji-content">
						{selectedEmojis.map((emoji, key) => {
							return emoji.emojis.map((emoji, index) => (
								<div key={index} className="pointer">
									<Emoji
										emoji={emoji.custom ? { ...emoji } : { id: emoji.id }}
										size={18}
										set="google"
										onClick={onEmojiSelect}
									/>
								</div>
							));
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default ChatEmoji;
