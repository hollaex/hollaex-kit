import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { WS_URL } from '../../../config/constants';
import { getToken } from '../../../utils/token';
import { Tabs } from 'antd';
import { Ban } from './ban';
import { Messages } from './messages';

import './index.css';

const TabPane = Tabs.TabPane;

class Chat extends Component {
	state = {
		chatWs: undefined,
		messages: [],
		bannedUsers: {},
		bannedUsersUsernames: {},
		ready: false
	};

	componentDidMount() {
		this.connectToChat(getToken());
	}

	componentWillUnmount() {
    this.disconnectFromChat()
	}

	connectToChat = (token) => {
		const url = `${WS_URL}/stream?authorization=Bearer ${token}`;
    const chatWs = new WebSocket(url);
    this.setState({ chatWs });

    chatWs.onopen = (evt) => {
      console.info('Connected Chat Socket', evt);
      chatWs.send(
        JSON.stringify({
          op: 'subscribe',
          args: ['chat'],
        })
      );
      this.wsInterval = setInterval(() => {
        chatWs.send(
          JSON.stringify({
            op: 'ping'
          })
        );
      }, 55000);
    };

    chatWs.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      console.info('chatWs', data);
      switch (data.action) {

        case 'init': {
          const { data: messages = [] } = data;
          this.setState({
            messages,
						ready: true,
          });
          this.getBannedUsers();
          break;
        }

        case 'addMessage': {
          const { data: newMessage } = data;
          this.setState((prevState) => ({
						messages: [...prevState.messages, newMessage]
					}));
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

				case 'bannedUsers': {
					const { data: bannedUsers } = data;
          const bannedUsersUsernames = {};
          Object.values(bannedUsers).forEach((username) => {
            bannedUsersUsernames[username] = 1;
          });
          this.setState({ bannedUsers, bannedUsersUsernames });
          break;
				}

        default:
          break;
      }
    }

    chatWs.onerror = (evt) => {
      console.error('chat socket error', evt);
    };

    // const chatWs = io(`${WS_URL}/chat`, {
    // 	query: {
    // 		token: `Bearer ${token}`
    // 	}
    // });

		// chatWs.on('init', ({ messages = [], announcements = [] }) => {
		// 	this.setState({ messages, announcements, ready: true });
		// 	this.getBannedUsers();
		// });

		// chatWs.on('message', (message) => {
		// 	this.setState({ messages: this.state.messages.concat(message) });
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

		// chatWs.on('bannedUsers', ({ bannedUsers }) => {
		// 	const bannedUsersUsernames = {};
		// 	Object.values(bannedUsers).forEach((username) => {
		// 		bannedUsersUsernames[username] = 1;
		// 	});
		// 	this.setState({ bannedUsers, bannedUsersUsernames });
		// });
	};

	addMessage = (message) => {
		const { chatWs } = this.state;
    chatWs.send(
      JSON.stringify({
        op: 'chat',
        args: [{
          action: 'addMessage',
          data: message,
        }]
      })
    )
	};

	deleteMessage = (idToDelete) => {
		const { chatWs } = this.state;
    chatWs.send(
      JSON.stringify({
        op: 'chat',
        args: [{
          action: 'deleteMessage',
          data: idToDelete,
        }]
      })
    )
	};

	getBannedUsers = () => {
		const { chatWs } = this.state;
    chatWs.send(
      JSON.stringify({
        op: 'chat',
        args: [{
          action: 'getBannedUsers',
        }]
      })
    );
	};

	banUser = (username) => {
		const { chatWs } = this.state;
    chatWs.send(
      JSON.stringify({
        op: 'chat',
        args: [{
          action: 'banUser',
          data: username,
        }]
      })
    )
	};

	unbanUser = (user_id) => {
		const { chatWs } = this.state;
    chatWs.send(
      JSON.stringify({
        op: 'chat',
        args: [{
          action: 'unbanUser',
          data: user_id,
        }]
      })
    )
	};

	disconnectFromChat = () => {
		const { chatWs } = this.state;
		if (chatWs) {
      chatWs.send(
        JSON.stringify({ op: 'unsubscribe', args: ['chat'] })
      );
			chatWs.close();
		}
	};

	render() {
		const {
			ready,
			messages,
			bannedUsers,
			bannedUsersUsernames
		} = this.state;

		return (
			<div className="app_container-content">
				{!ready ? (
					<Spin size="large" />
				) : (
					<div>
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
