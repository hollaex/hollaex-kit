import React, { Component } from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SaleHistory from './SaleHistory';
import DepositBitcoin from './DepositBitcoin'

class Trade extends Component {
	render() {
		var img = require('./images/trade.png');

		return (
			<div className='ml-5 mr-4 mt-5 trade'>
				<div className="row" >
					<div className='col-lg-9  row mr-2'>
						 <img src={img} width="760" height="280"/> 
					</div>
					<div className='col-lg-3 row tradeBorder'>
					 	<SaleHistory />
					</div>
				</div>
				<div className="mt-2" >
				 	<div className="row ">
						 <div className="col-lg-4 row ">
							 <div className="tradeBorder scroll" style={{width:'48%',height:'18rem'}}>	
							 	<div className="row">
							 		<h5 className="ml-4 mt-1">BUY</h5>
							 		<p className="mt-1 ml-3">Deposit Dollars</p>
							 	</div>
							 	<div className="row">
							 		<div className="col-12">
								 		<table className="table">
											<thead>
												<th>PRICE</th>
												<th>AMOUNT</th>
											</thead>
											<tbody>
											{(this.props.orderbook.bids)
												?
												(this.props.orderbook.bids.map((bid,i) => {
													return(
											            <tr key={i}>
											               <td>{bid[0]}</td>
											               <td>{bid[1]}</td>
											            </tr>
													)
												}))
												:
												null
											}
											</tbody>
										</table>
									</div>
							 	</div>
							 </div>
							<div className="ml-2 tradeBorder scroll" style={{width:'49%',height:'18rem'}}>	
							 	<div className="row">
							 		<h5 className="ml-4 mt-1">SELL</h5>
							 		<p className="mt-1 ml-3">Deposit BTC</p>
							 	</div>
							 	<div className="row">
							 		<div className="col-12">
								 		<table className="table">
											<thead>
												<th>PRICE</th>
												<th>AMOUNT</th>
											</thead>
											<tbody>
											{(this.props.orderbook.asks)
												?
												(this.props.orderbook.asks.map((ask,i) => {
													return(
											            <tr key={i}>
											               <td>{ask[0]}</td>
											               <td>{ask[1]}</td>
											            </tr>
													)
												}))
												:
												null
											}
											</tbody>
										</table>
									</div>
							 	</div>
							 </div>
						 </div>
						 <div className="col-lg-8 ml-2">
						 	<div className="row " style={{height:'48%'}}>
						 		<div style={{width:'49%'}} className="tradeBorder">
						 		 	<DepositBitcoin
						 		 		form="BUY"
						 		 		head="BUY" 
						 		 		link="DOLLARS" 
						 		 		balance="500" 
						 		 		totalAmount="4,090.52"  
						 		 		total="Spend"
						 		 		btc="BUY"/> 	 
						 		</div>
						 		<div className="ml-2 tradeBorder" style={{width:'49.5%'}}>
						 		 	<DepositBitcoin
						 		 		form="SELL" 
						 		 		head="SELL" 
						 		 		link="BTC" 
						 		 		balance="0.04 BTC" 
						 		 		totalAmount="26.53" 
						 		 		total="Receive"
						 		 		btc="SELL"/> 	
						 		</div>
						 	</div>
							<div className="row mt-2" style={{height:'48%'}}>
							 	 <div style={{width:'49%'}} className="tradeBorder">
							 	 	<div className="ml-1 mt-1"><h5>My Open Orders</h5></div>
							 	 </div>
						 		 <div className="ml-2 tradeBorder" style={{width:'49.5%'}}>
						 		 	<div className="ml-1 mt-1"><h5>My Trading History</h5></div>
						 		 </div>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Trade);