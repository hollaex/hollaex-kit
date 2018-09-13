import React, { Component } from 'react';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { ChatMessage } from './';
import { Loader } from '../';
import { isLoggedIn } from '../../utils/token';

class ChatMessageList extends Component {
	state = {
		containerHeight: 0
	};

	componentDidUpdate(prevProps) {
		const { chatIsClosed } = prevProps;
		if(chatIsClosed && (this.props.chatIsClosed !== chatIsClosed)) {
			this.scrollbarsRef.scrollToBottom();
		}
	}

	setScrollbarsRef = (el) => {
		if (el) {
			this.scrollbarsRef = el;
		}
	};

	componentDidMount() {
		this.setState({
			containerHeight: this.scrollbarsRef.container.clientHeight
		});
	}

	render() {
		const {
			messages,
			userType,
			chatInitialized,
			userInitialized,
			usernameInitalized,
			removeMessage
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
							opacity: '1'
						}}
					/>
				)}
				renderView={(props) => <div {...props} className="view" />}
			>
				{(chatInitialized && usernameInitalized) ||
				(!usernameInitalized && userInitialized) ||
				(chatInitialized && !isLoggedIn()) ? (
					messages.map(({ id, username, to, messageType, message, timestamp }, index) => (
						<ChatMessage
							key={index}
							id={id}
							username={username}
							ownMessage={username === this.props.username}
							to={to}
							userType={userType}
							messageType={messageType}
							messageContent={message}
							removeMessage={removeMessage}
							timestamp={timestamp}
						/>
					))
				) : (
					<Loader />
				)}
			</Scrollbars>
		);
	}
}

export default ChatMessageList;
