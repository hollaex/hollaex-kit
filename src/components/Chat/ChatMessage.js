import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import STRINGS from '../../config/localizedStrings';
import TruncateMarkup from 'react-truncate-markup';
import { ICONS } from '../../config/constants';
import { USER_TYPES } from '../../actions/appActions';
import ReactSVG from 'react-svg';

const MAX_LINES = 5;

const MESSAGE_OPTIONS = {
	DELETE_MESSAGE: 'Remove'
};

const TIME_LIMIT = 10000;

const ReadMore = ({ onClick }) => (
	<div className="d-inline">
		<span>...</span>
		<span className="toggle-content" onClick={onClick}>
			<span>{STRINGS.CHAT.READ_MORE}</span>
		</span>
	</div>
);

const Timestamp = ({ timestamp }) => (
	<div className="timestamp">
		{Math.abs(moment().diff(timestamp)) < TIME_LIMIT
			? STRINGS.JUST_NOW
			: moment(timestamp).fromNow()}
	</div>
);

class ChatMessageWithText extends Component {
	state = {
		maxLines: MAX_LINES
	};

	showMore = () => {
		this.setState({ maxLines: 500 });
	};

	render() {
		const { username, to, messageContent, ownMessage, timestamp } = this.props;
		const { maxLines } = this.state;
		return (
			<div className={classnames('nonmobile')}>
				<Timestamp timestamp={timestamp} />
				<div className="d-inline mr-1 own-message username">{`${username}:`}</div>
				{to && <div className="mr-1">{`${to}:`}</div>}
				{ownMessage ? (
					<div className="d-inline message">{messageContent}</div>
				) : (
					<TruncateMarkup
						className="d-inline message"
						lines={maxLines}
						ellipsis={<ReadMore onClick={() => this.showMore()} />}
					>
						<div className="d-inline message">{messageContent}</div>
					</TruncateMarkup>
				)}
			</div>
		);
	}
}

class ChatMessageWithImage extends Component {
	state = {
		hideImage: false
	};

	toggleImage = (condition) => {
		this.setState({ hideImage: condition });
	};

	render() {
		const { username, to, messageType, messageContent, timestamp } = this.props;
		const { hideImage } = this.state;

		return (
			<div>
				<div className="d-flex flex-row">
					<div>
						<Timestamp timestamp={timestamp} />
						<div className="d-inline username">{`${username}:`}</div>
						{to && <div className="d-inline mr-1">{`${to}:`}</div>}
					</div>
					<div
						className={classnames(hideImage ? 'hide' : 'show')}
						onClick={() => this.toggleImage(!hideImage)}
					>
						<span className="toggle-content">
							{hideImage ? STRINGS.CHAT.SHOW_IMAGE : STRINGS.CHAT.HIDE_IMAGE}
						</span>
					</div>
				</div>
				{!hideImage && (
					<img className={messageType} src={messageContent} alt="img" />
				)}
			</div>
		);
	}
}

export class ChatMessage extends Component {
	state = {
		showOptions: false
	};

	toggleOptions = () => {
		this.setState({ showOptions: !this.state.showOptions });
	};

	onClickOption = (key, id) => {
		switch (key) {
			case 'DELETE_MESSAGE':
				return this.props.removeMessage(id);
			default:
				break;
		}
	};

	render() {
		const {
			id,
			username,
			userType,
			to,
			messageType,
			messageContent,
			ownMessage,
			timestamp
		} = this.props;
		const { showOptions } = this.state;
		const imageType = messageType === 'image';
		return (
			<div
				className={classnames(
					'd-flex',
					'flex-row',
					'flex-1',
					'chat-message',
					'justify-content-between',
					ownMessage && 'user'
				)}
			>
				<div className={classnames('message-content', messageType)}>
					{imageType ? (
						<ChatMessageWithImage
							username={username}
							to={to}
							messageContent={messageContent}
							messageType={messageType}
							timestamp={timestamp}
						/>
					) : (
						<ChatMessageWithText
							username={username}
							to={to}
							messageContent={messageContent}
							ownMessage={ownMessage}
							timestamp={timestamp}
						/>
					)}
				</div>
				<div className="d-flex">
					{userType === USER_TYPES.USER_TYPE_ADMIN && (
						<div className="d-flex item-options" onClick={this.toggleOptions}>
							<ReactSVG
								path={ICONS.ITEM_OPTIONS}
								className="item-options-icon"
								wrapperClassName="item-options-icon-wrapper"
							/>
							{showOptions && (
								<div className="item-options-wrapper">
									{Object.entries(MESSAGE_OPTIONS).map(
										([key, value], index) => (
											<div
												key={index}
												className="d-flex item-option"
												onClick={() => this.onClickOption(key, id)}
											>
												{value}
											</div>
										)
									)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}
}
