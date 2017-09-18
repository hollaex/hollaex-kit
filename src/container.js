import React, { Component } from 'react';
import { connect } from 'react-redux'
import io from 'socket.io-client';
import { setOrderbook, setTrades, addTrades } from './actions/orderbookAction'
import { WS_URL } from './config/constants'
import { checkUserSessionExpired } from './utils/utils';
import { logout } from './actions/authAction';

class Container extends Component {
	constructor() {
		super()
		this.state = {
			trades: true // first load for trades,
		}
	}

	componentWillMount() {
		if (checkUserSessionExpired(localStorage.getItem('time'))) {
			this.props.logout();
		} else {
			this.setPublicWS()
		}
	}

	setPublicWS = () => {
		const { symbol } = this.props;
		const publicSocket = io(`${WS_URL}/realtime`, {
			query: {
				symbol,
			}
		})
		publicSocket.on('orderbook', (data) => {
			console.log('orderbook', data)
			this.props.setOrderbook(data[symbol])
		});
		publicSocket.on('trades', (data) => {
			console.log('trades', data[symbol])
			if(this.state.trades) {
				this.setState({
					trades: false
				})
				console.log('trades', data[symbol])
				this.props.setTrades(data[symbol])
			} else { // new updated trade which should be added to the list
				this.props.addTrades(this.props.orderbook.trades, data[symbol])
			}

		});
	}

	render() {
		return (
			<div className='col'>
				{this.props.children}
			</div>
		);
	}
}

const mapStateToProps = (store, ownProps) => ({
	orderbook: store.orderbook,
  symbol: store.orderbook.symbol,
})

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
		setTrades: (trades) => dispatch(setTrades(trades)),
		addTrades: (oldTrades, newTrades) => dispatch(addTrades(oldTrades, newTrades)),
		setOrderbook: (orderbook) => dispatch(setOrderbook(orderbook))
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
