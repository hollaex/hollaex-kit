import React, { Component } from 'react';
import { connect } from 'react-redux'
import io from 'socket.io-client';
import { setOrderbook, addTrades } from './actions/orderbookAction'
import { WS_URL } from './config/constants'
import { checkUserSessionExpired } from './utils/utils';
import { logout } from './actions/authAction';

import { AppBar } from './components';

class Container extends Component {

	componentWillMount() {
		if (checkUserSessionExpired(localStorage.getItem('time'))) {
			this.props.logout();
		} else {
			this.setPublicWS();
		}
	}

	setPublicWS = () => {
		const { symbol } = this.props;
		const publicSocket = io(`${WS_URL}/realtime`, {
			query: {
				symbol,
			}
		});

		publicSocket.on('orderbook', (data) => {
			console.log('orderbook', data)
			this.props.setOrderbook(data[symbol])
		});

		publicSocket.on('trades', (data) => {
			console.log('trades', data[symbol])
			if (data[symbol].length > 0) {
				this.props.addTrades(data[symbol]);
			}
		});
	}

	logout = () => this.props.logout();
	render() {
		return (
			<div>
				<AppBar user={this.props.user} logout={this.logout} />
				{this.props.children}
			</div>
		);
	}
}

const mapStateToProps = (store, ownProps) => ({
	orderbook: store.orderbook,
  symbol: store.orderbook.symbol,
	user: store.user,
})

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
		addTrades: (trades) => dispatch(addTrades(trades)),
		setOrderbook: (orderbook) => dispatch(setOrderbook(orderbook))
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
