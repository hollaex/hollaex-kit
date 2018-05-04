import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { WS_URL } from '../../config/constants';

import { setAnnouncements } from '../../actions/appActions';
import { getToken } from '../../utils/token';

class Chat extends Component {
	state = {
		chatWs: null,
		messages: []
	};

	componentWillMount() {
		this.initializeChatWs(getToken());
	}

	initializeChatWs = (token = '') => {
		const chatWs = io(`${WS_URL}/chat`, {
			query: {
				token: `Bearer ${token}`
			}
		});
		this.setState({ chatWs });

		chatWs.on('init', ({ messages = [], announcements = [] }) => {
			this.setState({ messages });
			this.props.setAnnouncements(announcements);
		});

		chatWs.on('error', (error) => {
			console.log(error);
		});

		chatWs.on('message', (message) => {
			this.setState({ messages: this.state.messages.concat(message) });
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

	render() {
		return <div />;
	}
}
const mapStateToProps = (store) => ({});

const mapDispatchToProps = (dispatch) => ({
	setAnnouncements: bindActionCreators(setAnnouncements, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
