import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChatWrapper, Button } from '../../components';
import { WS_URL } from '../../config/constants';
import {
	setAnnouncements,
	USER_TYPES,
	MESSAGE_TYPES
} from '../../actions/appActions';
import { getToken } from '../../utils/token';
import STRINGS from '../../config/localizedStrings';

const ENTER_KEY = 'Enter';

class Chat extends Component {
	state = {
		chatWs: null,
		chatSocketInitialized: false,
		chatSocketInitializing: false,
		chatSocket: undefined,
		to: '',
		messages: [],
		minimized: false,
		unreadMessages: 0
	};

	componentWillMount() {
		this.initializeChatWs(getToken());
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.username && !this.props.username) {
			this.state.chatSocket.emit('set_username', {
				username: nextProps.username
			});
		}
	}

	componentWillUnmount() {
		this.closeChatSocket();
	}

	initializeChatWs = (token = '') => {
		this.isInitializing(true);
		const chatWs = io(`${WS_URL}/chat`, {
			query: {
				token: `Bearer ${token}`
			}
		});
		this.setState({ chatWs });

		chatWs.on('init', ({ messages = [], announcements = [] }) => {
			this.setState({
				chatSocketInitializing: false,
				chatSocketInitialized: true,
				messages: messages
			});
			this.props.setAnnouncements(announcements);
		});

		chatWs.on('error', (error) => {
			this.isInitializing(false);
			console.log(error);
		});

		chatWs.on('message', (message) => {
			const messages = this.state.messages.concat(message);
			const unreadMessages = this.state.minimized
				? this.state.unreadMessages +
					(messages.length - this.state.messages.length)
				: 0;
			this.setState({ messages, unreadMessages });
		});

		chatWs.on('announcement', (announcement) => {
			this.props.setAnnouncements(announcement);
		});

		chatWs.on('deleteMessage', (idToDelete) => {
			const indexOfMessage = this.state.messages.findIndex(
				({ id }) => id === idToDelete
			);
			if (indexOfMessage > -1) {
				const messages = [].concat(this.state.messages);
				messages.splice(indexOfMessage, 1);
				this.setState({ messages });
			}
		});
	};

	closeChatSocket = () => {
		if (this.state.chatSocket) {
			this.state.chatSocket.close();
		}
	};

	setChatBoxRef = (ref) => {
		if (ref && ref.el) {
			this.chatMessageBox = ref.el;
		}
	};

	sendMessage = (e) => {
		if (e.key === ENTER_KEY) {
			e.preventDefault();
			const message = this.chatMessageBox.value;
			if (message.trim().length > 0) {
				const { username } = this.props;
				const { to } = this.state;
				const chatMessage = {
					username,
					userType: USER_TYPES.USER_TYPE_NORMAL,
					to,
					message,
					type: MESSAGE_TYPES.MESSAGE_TYPE_NORMAL
				};

				this.state.chatSocket.emit('message', chatMessage);

				this.chatMessageBox.value = '';
				this.chatMessageBox.style.height = '24px';
			}
		}
	};

	// navigateToUsernameSetting = () => {
	// 	this.props.changeModalRoute(PATHS.SETTINGS, { tab: 'username' });
	// };

	isInitializing = (condition) => {
		this.setState({ chatSocketInitializing: condition });
	};

	minimizeChat = () => {
		const minimized = !this.state.minimized;
		if (minimized === false) {
			this.resetUnreadMessages();
		}
		this.setState({ minimized });
	};

	resetUnreadMessages = () => {
		this.setState({ unreadMessages: 0 });
	};

	removeMessage = (id) => {
		this.state.chatSocket.emit('deleteMessage', id);
	};

	render() {
		const { username, userType, userInitialized, children } = this.props;
		const {
			messages,
			chatSocketInitialized,
			chatSocketInitializing,
			minimized,
			unreadMessages
		} = this.state;

		const childWithProps = React.Children.map(children, (child) =>
			React.cloneElement(child, {
				disabled: userInitialized || !chatSocketInitialized
			})
		);

		return (
			<ChatWrapper
				chatSocketInitializing={chatSocketInitializing}
				chatSocketInitialized={chatSocketInitialized}
				title="Chat"
				username={username}
				userType={userType}
				messages={messages}
				unreadMessages={unreadMessages}
				setChatBoxRef={this.setChatBoxRef}
				sendMessage={this.sendMessage}
				userInitialized={userInitialized}
				minimized={minimized}
				minimizeChat={this.minimizeChat}
				removeMessage={this.removeMessage}
			>
				{!userInitialized && !username ? (
					childWithProps
				) : (
					<Button
						label={STRINGS.CHAT.JOIN_CHAT}
						onClick={this.navigateToUsernameSetting}
						disabled={!userInitialized || !chatSocketInitialized}
					/>
				)}
			</ChatWrapper>
		);
	}
}

const mapStateToProps = (store) => ({
	username: store.user.username,
	userType: store.user.userType,
	userInitialized: store.user.fetched
});

const mapDispatchToProps = (dispatch) => ({
	setAnnouncements: bindActionCreators(setAnnouncements, dispatch),
	//changeModalRoute: bindActionCreators(changeModalRoute, dispatch),
	dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
