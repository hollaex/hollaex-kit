import React, { Component } from 'react';
import { Link } from 'react-router'
import { createOrder } from '../../actions/orderAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class DepositBitcoin extends Component {
	_createOrder() {
		let side = "buy" // buy or sell depending on the box
		let type = "limit" // TODO select between limit or market
		let amount = 100000 // TODO the amount in the box
		let price = 1000 // TODO the price in the box
		this.props.dispatch(createOrder(side, type, Number(amount), price))
	}

	render() {

		return (
			<div>
				<div className="row ml-2 mt-1">
	 		 		<h5 className="mr-3">{this.props.head}</h5>
	 		 		<div className="ml-5 pl-5 pt-1">
	 		 			<Link to="#">{`DEPOSIT ${this.props.link}`}</Link>
	 		 		</div>
	 		 	</div>
	 		 	<div className="row">
	 		 		<div className="ml-4">
	 		 			<div>Balance:</div>
				 		<div className="mt-1">OrderType:</div>
				 		<div className="mt-1">Amount:</div>
				 		<div className="mt-1">Price:</div>
				 		<div className="mt-2">{`${this.props.total} total:`}</div>
	 		 		</div>	
	 		 		<div>
				 		<div>{this.props.balance}</div>
				 		<div className="mt-1">
				 			<label>Limit </label>
				 			<span> Market</span>
				 		</div>
				 		<div style={{position:'relative',top:'-0.4rem'}}>
				 			<input type="text" placeholder="BTC" style={{height:'1rem'}}/>
				 			<span>Spend All</span>
				 		</div>
				 		<div  style={{position:'relative',top:'-0.3rem'}}>
				 			<input type="text" placeholder="AUD" style={{height:'1rem'}}/>
				 			<span>Best Sell Price</span>
				 		</div>
					 	<div className="row mt-1">
				 			<div className="ml-4 mr-1" style={{fontWeight:'bold',fontSize:'0.75rem'}}>
				 				{`$${this.props.totalAmount}`}
				 			</div>
				 			<span> inc 0.7% Fee (inc GST)</span>
				 			<div  style={{position:'relative',top:'-0.4rem'}}>
				 				<button className='boxButton ml-2'>{`${this.props.btc} BTC >`}</button>
				 			</div>
				 		</div>
				 	</div>
	 		 	</div>
			</div>
		);
	}
}
const mapStateToProps = (store, ownProps) => ({
    order: store.order,
    orderbook: store.orderbook
})
const mapDispatchToProps = dispatch => ({
	createOrder: bindActionCreators(createOrder, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(DepositBitcoin);