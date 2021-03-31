import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { cloneDeep } from 'lodash';
import { ChatMessage } from './';
import { Loader } from '../';
import { isLoggedIn } from '../../utils/token';
import { isMobile } from 'react-device-detect';

class ChatMessageList extends Component {
	state = {
		containerHeight: 0,
	};

	componentDidUpdate(prevProps) {
		if (this.shouldScroll(prevProps)) {
			this.scrollbarsRef.scrollToBottom();
		}
	}

	shouldScroll = (prevProps) => {
		const lastMsg = cloneDeep(this.props.messages).pop();
		return (
			(lastMsg &&
				(this.scrollbarsRef.getValues().top > 0.95 ||
					this.props.username === lastMsg.username)) ||
			(!isMobile &&
				prevProps.chatIsClosed &&
				prevProps.chatIsClosed !== this.props.chatIsClosed) ||
			(!prevProps.chatInitialized &&
				prevProps.chatInitialized !== this.props.chatInitialized) ||
			(!prevProps.userInitialized &&
				prevProps.userInitialized !== this.props.userInitialized) ||
			prevProps.showEmojiBox !== this.props.showEmojiBox
		);
	};
	scrollToBottom = () => {
		if (
			this.scrollbarsRef.container.clientHeight < this.state.containerHeight
		) {
			this.setState({
				containerHeight: this.scrollbarsRef.container.clientHeight,
			});
			this.scrollbarsRef.scrollToBottom();
		}
	};

	scrollUpdate = (values) => {
		this.scrollToBottom();
	};

	setScrollbarsRef = (el) => {
		if (el) {
			this.scrollbarsRef = el;
		}
	};

	componentDidMount() {
		this.setState({
			containerHeight: this.scrollbarsRef.container.clientHeight,
		});
		if (isMobile) {
			this.scrollbarsRef.scrollToBottom();
		}
	}

	constructData = (message) => {
		let keyIndex = [];
		let obj = {};
		let keyLength = message.split('').filter((char, key) => {
			if (char === '`') {
				if (obj.start === undefined) obj.start = key;
				else if (!obj.end) {
					obj.end = key;
					keyIndex.push(obj);
					obj = {};
				}
				return true;
			}
			return false;
		});
		if (!keyLength.length || keyLength.length === 1) {
			return message;
		}
		let msgData = [];
		keyIndex.forEach((idx, count, arr) => {
			let start = idx.start + 1;
			let end = idx.end;
			let preStart = count === 0 ? 0 : arr[count - 1].end + 1;
			let prevEnd = idx.start;
			msgData.push(message.substring(preStart, prevEnd));
			if (message.substring(start, end).includes('http')) {
				msgData.push(
					<a
						key={start}
						className="blue-link"
						target="_blank"
						rel="noopener noreferrer"
						href={message.substring(start, end)}
					>
						{message.substring(start, end)}
					</a>
				);
			} else {
				msgData.push(
					<span key={start} className="blue-link">
						{message.substring(start, end)}
					</span>
				);
			}
			if (arr.length === count + 1) {
				msgData.push(message.substring(end + 1, message.length));
			}
		});
		return message.includes('`') ? msgData : message;
	};

	render() {
		const {
			messages,
			userType,
			chatInitialized,
			userInitialized,
			usernameInitalized,
			removeMessage,
			is_hap,
			onCloseEmoji,
		} = this.props;

		return (
			<Scrollbars
				ref={this.setScrollbarsRef}
				className={classnames(
					'd-flex',
					'flex-row',
					'flex-column',
					'chat-message-list'
				)}
				renderThumbVertical={({ style, ...props }) => (
					<div
						{...props}
						style={{
							...style,
							backgroundColor: '#333333',
							opacity: '1',
						}}
					/>
				)}
				renderView={(props) => <div {...props} className="view" />}
				onUpdate={this.scrollUpdate}
			>
				{(chatInitialized && usernameInitalized) ||
				(!usernameInitalized && userInitialized) ||
				(chatInitialized && !isLoggedIn()) ? (
					messages.map(
						(
							{
								id,
								username,
								to,
								messageType,
								message,
								timestamp,
								verification_level,
							},
							index
						) => (
							<ChatMessage
								key={index}
								id={id}
								username={username}
								ownMessage={username === this.props.username}
								to={to}
								userType={userType}
								verification_level={verification_level}
								messageType={messageType}
								messageContent={message}
								removeMessage={removeMessage}
								timestamp={timestamp}
								is_hap={is_hap}
								onCloseEmoji={onCloseEmoji}
							/>
						)
					)
				) : (
					<Loader />
				)}
			</Scrollbars>
		);
	}
}

const mapStateToProps = (store) => ({
	// activeTheme: store.app.theme,
	is_hap: store.user.is_hap,
});

export default connect(mapStateToProps)(ChatMessageList);
