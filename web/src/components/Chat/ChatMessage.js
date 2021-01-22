import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import STRINGS from '../../config/localizedStrings';
import TruncateMarkup from 'react-truncate-markup';
import { ICONS } from '../../config/constants';
import { USER_TYPES } from '../../actions/appActions';
import { ReactSVG } from 'react-svg';

moment.updateLocale('en', {
	relativeTime: {
		s: '1 S',
		ss: '%d S',
		m: '1 M',
		mm: '%d M',
		h: '1 H',
		hh: '%d H',
		d: '1 D',
		dd: '%d D',
		M: '1 MO',
		MM: '%d MO',
		y: '1 Y',
		yy: '%d Y',
	},
});

const MAX_LINES = 5;

const MESSAGE_OPTIONS = {
	DELETE_MESSAGE: 'Remove',
};

const TIME_LIMIT = 10000;

const ReadMore = ({ onClick }) => (
	<div className="d-inline">
		<span>...</span>
		<span className="toggle-content" onClick={onClick}>
			<span>{STRINGS['CHAT.READ_MORE']}</span>
		</span>
	</div>
);

const Timestamp = ({ timestamp }) => (
	<div className="timestamp">
		{Math.abs(moment().diff(timestamp)) < TIME_LIMIT
			? STRINGS['JUST_NOW']
			: moment(timestamp).fromNow(true)}
	</div>
);

class ChatMessageWithText extends Component {
	state = {
		maxLines: MAX_LINES,
	};

	showMore = () => {
		this.setState({ maxLines: 500 });
	};

	render() {
		const {
			username,
			to,
			messageContent,
			ownMessage,
			// timestamp,
			verification_level,
		} = this.props;
		const { maxLines } = this.state;
		let icon = ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
			? ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
			: ICONS.LEVEL_ACCOUNT_ICON_4;
		return (
			<div className={classnames('nonmobile')}>
				<div className="d-flex">
					<div className="mx-2">
						{verification_level >= 3 ? (
							<ReactSVG src={icon} className="user-icon mr-1" />
						) : (
							<div className="user-icon mr-1"></div>
						)}
					</div>
					<div className="d-flex flex-1">
						{ownMessage ? (
							<div className="mr-1 my-1 own-message username">
								<div className="mr-1 d-inline-block">{`${username}:`}</div>
								{to && <span className="mr-1">{`${to}:`}</span>}
								<span className="d-inline message">{messageContent}</span>
							</div>
						) : (
							// <div className="mr-1 my-1 own-message username d-flex">
							// 	<div className="mr-1 f-none">
							// 		{`${username}:`}
							// 	</div>
							// 	{to && <span className="mr-1">{`${to}:`}</span>}
							// 	<span className="d-inline message">{messageContent}</span>
							// </div>

							<div className="mr-1 my-1 username ">
								<div className="mr-1 apply_rtl d-inline-block ">
									{`${username}:`}
								</div>
								{to && <span className="mr-1">{`${to}:`}</span>}
								<TruncateMarkup
									className="d-inline message"
									lines={maxLines}
									ellipsis={<ReadMore onClick={() => this.showMore()} />}
								>
									<span className="d-inline message">{messageContent}</span>
								</TruncateMarkup>
							</div>
							// <div className="mr-1 my-1 username d-flex">
							// 	<div className="mr-1 apply_rtl f-none" >
							// 		{`${username}:`}
							// 	</div>
							// 	{to && <span className="mr-1">{`${to}:`}</span>}
							// 	<TruncateMarkup
							// 		className="d-inline message"
							// 		lines={maxLines}
							// 		ellipsis={<ReadMore onClick={() => this.showMore()} />}
							// 	>
							// 		<span className="d-inline message">{messageContent}</span>
							// 	</TruncateMarkup>
							// </div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

class ChatMessageWithImage extends Component {
	state = {
		hideImage: false,
	};

	toggleImage = (condition) => {
		this.setState({ hideImage: condition });
	};

	render() {
		const {
			username,
			to,
			messageType,
			messageContent,
			timestamp,
			verification_level,
		} = this.props;
		const { hideImage } = this.state;
		let icon =
			verification_level >= 4
				? ICONS.LEVEL_ACCOUNT_ICON_4
				: ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`];

		return (
			<div>
				<div className="d-flex flex-row justify-content-end">
					<div>
						<Timestamp timestamp={timestamp} />
					</div>
					<div
						className={classnames(hideImage ? 'hide' : 'show')}
						onClick={() => this.toggleImage(!hideImage)}
					>
						<span className="toggle-content">
							{hideImage
								? STRINGS['CHAT.SHOW_IMAGE']
								: STRINGS['CHAT.HIDE_IMAGE']}
						</span>
					</div>
				</div>
				<div className="d-flex">
					<div className="mx-2">
						{verification_level === 3 || verification_level === 4 ? (
							<ReactSVG src={icon} className="user-icon mr-1" />
						) : (
							<div className="user-icon mr-1"></div>
						)}
					</div>
					<div>
						<div>
							<div className="d-inline username">{`${username}:`}</div>
							{to && <div className="d-inline mr-1">{`${to}:`}</div>}
						</div>
						{!hideImage && (
							<img
								className={messageType}
								src={messageContent}
								style={{ width: '4rem', height: '4rem' }}
								alt="img"
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export class ChatMessage extends Component {
	state = {
		showOptions: false,
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
			userType,
			to,
			messageType,
			messageContent,
			ownMessage,
			timestamp,
			verification_level,
			onCloseEmoji,
		} = this.props;
		const { showOptions } = this.state;
		const imageType = messageType === 'image';
		const username = this.props.username.username
			? this.props.username.username
			: this.props.username;
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
				onClick={onCloseEmoji}
			>
				<div className={classnames('message-content', messageType)}>
					{imageType ? (
						<ChatMessageWithImage
							username={username}
							to={to}
							messageContent={messageContent}
							ownMessage={ownMessage}
							messageType={messageType}
							timestamp={timestamp}
							verification_level={verification_level}
						/>
					) : (
						<ChatMessageWithText
							username={username}
							to={to}
							messageContent={messageContent}
							ownMessage={ownMessage}
							timestamp={timestamp}
							verification_level={verification_level}
						/>
					)}
				</div>
				<div className="d-flex">
					{userType === USER_TYPES.USER_TYPE_ADMIN && (
						<div className="d-flex item-options" onClick={this.toggleOptions}>
							<ReactSVG
								src={ICONS.ITEM_OPTIONS}
								beforeInjection={(svg) => {
									svg.classList.add('item-options-icon');
								}}
								className="item-options-icon-wrapper"
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
