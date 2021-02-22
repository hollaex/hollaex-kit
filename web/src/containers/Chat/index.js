import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { setWsHeartbeat } from 'ws-heartbeat/client';

import { ChatWrapper } from '../../components';
import { WS_URL } from '../../config/constants';
import {
	setAnnouncements,
	setChatUnreadMessages,
} from '../../actions/appActions';
import { getToken } from '../../utils/token';
import { NORMAL_CLOSURE_CODE, isIntentionalClosure } from 'utils/webSocket';

const ENTER_KEY = 'Enter';

class Chat extends Component {
	state = {
		chatWs: null,
		chatSocketInitialized: false,
		chatSocketInitializing: false,
		to: '',
		messages: [],
		showEmojiBox: false,
		unreadMessages: 0,
	};

	componentWillMount() {
		// if (!this.props.fetchingAuth && isLoggedIn()) {
		if (!this.props.fetchingAuth) {
			this.initializeChatWs(getToken());
		}
	}

	componentDidMount() {
		if (
			this.props.enabledPlugins &&
			this.props.enabledPlugins.length &&
			!this.props.fetchingAuth &&
			!this.props.features.chat
		) {
			this.props.router.push('/account');
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { chatWs } = this.state;
		if (
			!nextProps.fetchingAuth &&
			nextProps.fetchingAuth !== this.props.fetchingAuth
		) {
			// if (!this.state.chatWs && isLoggedIn()) {
			if (!chatWs) {
				this.initializeChatWs(getToken());
			}
		}
		if (nextProps.username_set) {
			chatWs.send(
				JSON.stringify({
					op: 'chat',
					args: [
						{
							action: 'changeUsername',
							data: nextProps.user_id,
						},
					],
				})
			);
		}
	}

	componentWillUnmount() {
		this.closeChatSocket();
	}

	initializeChatWs = (token = '') => {
		this.isInitializing(true);
		let url = `${WS_URL}/stream`;
		if (token) {
			url = `${WS_URL}/stream?authorization=Bearer ${token}`;
		}

		const chatWs = new WebSocket(url);

		this.setState({ chatWs });

		chatWs.onopen = (evt) => {
			chatWs.send(
				JSON.stringify({
					op: 'subscribe',
					args: ['chat'],
				})
			);

			setWsHeartbeat(chatWs, JSON.stringify({ op: 'ping' }), {
				pingTimeout: 60000,
				pingInterval: 25000,
			});
		};

		chatWs.onmessage = (evt) => {
			const data = JSON.parse(evt.data);
			switch (data.action) {
				case 'init': {
					const { data: messages = [] } = data;
					this.setState(
						{
							chatSocketInitializing: false,
							messages,
						},
						() => {
							this.setState({
								chatSocketInitialized: true,
							});
						}
					);
					break;
				}

				case 'addMessage': {
					const { data: newMessage } = data;
					const messages = this.state.messages.concat(newMessage);
					const unreadMessages = this.props.minimized
						? this.props.unreadMessages +
						  (messages.length - this.state.messages.length)
						: 0;
					this.props.setChatUnreadMessages(unreadMessages);
					this.setState({ messages, unreadMessages });
					break;
				}

				case 'deleteMessage': {
					const { data: idToDelete } = data;
					const indexOfMessage = this.state.messages.findIndex(
						({ id }) => id === idToDelete
					);
					if (indexOfMessage > -1) {
						const messages = [].concat(this.state.messages);
						messages.splice(indexOfMessage, 1);
						this.setState({ messages });
					}
					break;
				}

				default:
					break;
			}
		};

		chatWs.onerror = (evt) => {
			console.error('chat socket error', evt);
		};

		chatWs.onclose = (evt) => {
			this.setState({ chatSocketInitialized: false });
			if (!isIntentionalClosure(evt)) {
				setTimeout(() => {
					this.initializeChatWs(getToken());
				}, 1000);
			}
		};
		// this.isInitializing(true);
		// let chatWs = '';
		// if (token) {
		// 	chatWs = io.connect(`${WS_URL}/chat`, {
		// 		query: {
		// 			token: token ? `Bearer ${token}` : ''
		// 		}
		// 	});
		// } else {
		// 	chatWs = io.connect(`${WS_URL}/chat`);
		// }
		//
		// this.setState({ chatWs });

		// chatWs.on('init', ({ messages = [], announcements = [] }) => {
		// 	this.setState({
		// 		chatSocketInitializing: false,
		// 		messages: messages
		// 	});
		// 	setTimeout(() => {
		// 		this.setState({
		// 			chatSocketInitialized: true
		// 		});
		// 	}, 1000);
		// 	// this.props.setAnnouncements(announcements);
		// });

		// chatWs.on('error', (error) => {
		// 	this.isInitializing(false);
		// });

		// chatWs.on('message', (message) => {
		// 	let newMessage = { ...message };
		// 	if (typeof message.username === 'object') {
		// 		newMessage = { ...message, ...message.username };
		// 	}
		// 	const messages = this.state.messages.concat(newMessage);
		// 	const unreadMessages = this.props.minimized
		// 		? this.props.unreadMessages +
		// 		  (messages.length - this.state.messages.length)
		// 		: 0;
		// 	this.props.setChatUnreadMessages(unreadMessages);
		// 	this.setState({ messages, unreadMessages });
		// });

		// chatWs.on('announcement', (announcement) => {
		// 	this.props.setAnnouncements(announcement);
		// });

		// chatWs.on('deleteMessage', (idToDelete) => {
		// 	const indexOfMessage = this.state.messages.findIndex(
		// 		({ id }) => id === idToDelete
		// 	);
		// 	if (indexOfMessage > -1) {
		// 		const messages = [].concat(this.state.messages);
		// 		messages.splice(indexOfMessage, 1);
		// 		this.setState({ messages });
		// 	}
		// });
	};

	closeChatSocket = () => {
		const { chatWs, chatSocketInitialized } = this.state;
		if (chatWs) {
			if (chatSocketInitialized) {
				chatWs.send(JSON.stringify({ op: 'unsubscribe', args: ['chat'] }));
			}
			chatWs.close(NORMAL_CLOSURE_CODE);
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
			const { chatWs } = this.state;
			const message = this.chatMessageBox.value;
			if (message.trim().length > 0) {
				chatWs.send(
					JSON.stringify({
						op: 'chat',
						args: [
							{
								action: 'addMessage',
								data: message,
							},
						],
					})
				);

				this.chatMessageBox.value = '';
				this.chatMessageBox.style.height = isMobile ? '32px' : '36px';
			}
		}
	};

	isInitializing = (condition) => {
		this.setState({ chatSocketInitializing: condition });
	};

	resetUnreadMessages = () => {
		this.setState({ unreadMessages: 0 });
	};

	removeMessage = (id) => {
		const { chatWs } = this.state;

		chatWs.send(
			JSON.stringify({
				op: 'chat',
				args: [
					{
						action: 'deleteMessage',
						data: id,
					},
				],
			})
		);
	};

	handleEmojiBox = () => {
		this.setState({ showEmojiBox: !this.state.showEmojiBox });
		this.chatMessageBox.focus();
	};

	onCloseEmoji = () => {
		this.setState({ showEmojiBox: false });
	};

	onEmojiSelect = (emoji) => {
		let value = this.chatMessageBox.value;
		if (emoji.native) {
			this.chatMessageBox.value = value + emoji.native;
		}
		this.chatMessageBox.focus();
	};

	render() {
		const {
			username,
			userType,
			userInitialized,
			onMinimize,
			minimized,
			chatIsClosed,
			set_username,
			// enabledPlugins,
			features,
		} = this.props;
		const {
			messages,
			chatSocketInitialized,
			chatSocketInitializing,
			unreadMessages,
			showEmojiBox,
		} = this.state;
		if (!features.chat) {
			return <Fragment />;
		}
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
				// minimized={minimized || !userInitialized || !chatSocketInitialized}
				minimized={minimized}
				minimizeChat={onMinimize}
				chatIsClosed={chatIsClosed}
				set_username={set_username}
				showEmojiBox={showEmojiBox}
				handleEmojiBox={this.handleEmojiBox}
				removeMessage={this.removeMessage}
				onEmojiSelect={this.onEmojiSelect}
				onCloseEmoji={this.onCloseEmoji}
			/>
		);
	}
}

const mapStateToProps = (store) => ({
	fetchingAuth: store.auth.fetching,
	user_id: store.user.id,
	username: store.user.username,
	username_set: store.user.username_set,
	userType: store.auth.userType,
	userInitialized: store.user.fetched,
	unreadMessages: store.app.chatUnreadMessages,
	set_username: store.user.settings.chat.set_username,
	is_hap: store.user.is_hap,
	enabledPlugins: store.app.enabledPlugins,
	features: store.app.features,
});

const mapDispatchToProps = (dispatch) => ({
	setAnnouncements: bindActionCreators(setAnnouncements, dispatch),
	setChatUnreadMessages: bindActionCreators(setChatUnreadMessages, dispatch),
	dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
