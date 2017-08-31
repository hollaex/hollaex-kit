import React, { Component } from 'react';
import { connect } from 'react-redux'
import io from 'socket.io-client';
import { setOrderbook, setTrades, addTrades } from './actions/orderbookAction'

class Container extends Component {
	constructor() {
		super()
		this.state = {
			trades: true // first load for trades 
		}
	}
	componentWillMount() {
		// const publicSocket = io('http://35.158.234.195/realtime')
		// publicSocket.on('orderbook', (data) => {
		// 	console.log('orderbook', data)
		// 	this.props.dispatch(setOrderbook(data))
		// });
		// publicSocket.on('trades', (data) => {
		// 	console.log('trades', data)
		// 	if(this.state.trades) {
		// 		this.setState({
		// 			trades: false
		// 		})
		// 		this.props.dispatch(setTrades(data))
		// 	} else { // new updated trade which should be added to the list
		// 		this.props.dispatch(addTrades(this.props.orderbook.trades, data))
		// 	}
		//
		// });	
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
	orderbook: store.orderbook
})

export default connect(mapStateToProps)(Container);