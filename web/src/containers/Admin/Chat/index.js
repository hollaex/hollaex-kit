import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { WS_URL } from '../../../config/constants';
import { getToken } from '../../../utils/token';
import { Tabs } from 'antd';
import { Ban } from './ban';
import { Announcements } from './announcements';
import { Messages } from './messages';

import './index.css';

const TabPane = Tabs.TabPane;

class Chat extends Component {
	state = {
		chatWs: undefined,
		messages: [],
		announcements: [],
		bannedUsers: {},
		bannedUsersUsernames: {},
		ready: false
	};

	componentDidMount() {
		this.connectToChat(getToken());
	}

	connectToChat = (token) => {
		const chatWs = io(`${WS_URL}/chat`, {
			query: {
				token: `Bearer ${token}`
			}
		});

		chatWs.on('init', ({ messages = [], announcements = [] }) => {
			this.setState({ messages, announcements, ready: true });
			this.getBannedUsers();
		});

		chatWs.on('message', (message) => {
			this.setState({ messages: this.state.messages.concat(message) });
		});

		chatWs.on('announcement', (announcement) => {
			this.setState({
				announcements: this.state.announcements.concat(announcement)
			});
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

		chatWs.on('bannedUsers', ({ bannedUsers }) => {
			const bannedUsersUsernames = {};
			Object.values(bannedUsers).forEach((username) => {
				bannedUsersUsernames[username] = 1;
			});
			this.setState({ bannedUsers, bannedUsersUsernames });
		});

		this.setState({ chatWs });
	};

	addMessage = (message) => {
		const { username } = this.props;
		this.state.chatWs.emit('message', {
			message,
			username
		});
	};

	deleteMessage = (idToDelete) => {
		this.state.chatWs.emit('deleteMessage', idToDelete);
	};

	addAnnouncement = (message) => {
		this.state.chatWs.emit('announcement', {
			message,
			type: 'announcement'
		});
	};

	deleteAnnouncement = (idToDelete) => {
		this.state.chatWs.emit('deleteAnnouncement', idToDelete);
		const indexOfAnnouncement = this.state.announcements.findIndex(
			({ id }) => id === idToDelete
		);
		if (indexOfAnnouncement > -1) {
			const announcements = [].concat(this.state.announcements);
			announcements.splice(indexOfAnnouncement, 1);
			this.setState({ announcements });
		}
	};

	getBannedUsers = () => {
		this.state.chatWs.emit('getBannedUsers');
	};

	banUser = (username) => {
		this.state.chatWs.emit('banUser', { username });
	};

	unbanUser = (user_id) => {
		this.state.chatWs.emit('unbanUser', { user_id });
	};

	disconnectFromChat = () => {
		if (this.state.chatWs) {
			this.state.chatWs.disconnect();
		}
	};

	render() {
		const {
			ready,
			messages,
			announcements,
			bannedUsers,
			bannedUsersUsernames
		} = this.state;

		return (
			<div className="app_container-content">
				{!ready ? (
					<Spin size="large" />
				) : (
					<div>
						<h1>USER CHAT</h1>
						<Tabs className="chat-tabs">
							<TabPane tab="Messages" key="messages">
								<Messages
									messages={messages.slice().reverse()}
									deleteMessage={this.deleteMessage}
									addMessage={this.addMessage}
									banUser={this.banUser}
									bannedUsers={bannedUsersUsernames}
								/>
							</TabPane>
							{/* <TabPane tab="Announcements" key="announcements">
								<Announcements
									announcements={announcements}
									deleteAnnouncement={this.deleteAnnouncement}
									addAnnouncement={this.addAnnouncement}
								/>
							</TabPane> */}
							<TabPane tab="Banned Users" key="banuser">
								<Ban
									bannedUsers={bannedUsers}
									unbanUser={this.unbanUser}
									banUser={this.banUser}
								/>
							</TabPane>
						</Tabs>
					</div>
				)}
			</div>
		);
	}
}
const mapStateToProps = (store) => ({
	username : store.user.username
});

export default connect(mapStateToProps)(Chat);
