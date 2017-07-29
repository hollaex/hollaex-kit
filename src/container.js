import React, { Component } from 'react';
import { connect } from 'react-redux'
import io from 'socket.io-client';
import { setOrderbook, setTrades } from './actions/orderbookAction'

class Container extends Component {
	componentWillMount() {
		const publicSocket = io('http://35.158.6.83/realtime')
		publicSocket.on('orderbook', (data) => {
			this.props.dispatch(setOrderbook(data))
		});
		publicSocket.on('trades', (data) => {
			this.props.dispatch(setTrades(data))
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

export default connect()(Container);