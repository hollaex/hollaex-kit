import React, { Component } from 'react';
import { connect } from 'react-redux'
import io from 'socket.io-client';
import { setOrderbook, setTrades, addTrades } from './actions/orderbookAction'
import constants from './config/constants'

class Container extends Component {
	constructor() {
		super()
		this.state = {
			trades: true // first load for trades
		}
	}
	componentWillMount() {
		const { symbol } = this.props;

		const publicSocket = io(`${constants.WS_URL}/realtime`, {
			query: {
				symbol,
			}
		})
		publicSocket.on('orderbook', (data) => {
			console.log('orderbook', data)
			this.props.dispatch(setOrderbook(data[symbol]))
		});
		publicSocket.on('trades', (data) => {
			console.log('trades', data[symbol])
			if(this.state.trades) {
				this.setState({
					trades: false
				})
				console.log('trades', data[symbol])
				this.props.dispatch(setTrades(data[symbol]))
			} else { // new updated trade which should be added to the list
				this.props.dispatch(addTrades(this.props.orderbook.trades, data[symbol]))
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

export default connect(mapStateToProps)(Container);
