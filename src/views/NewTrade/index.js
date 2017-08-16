import React, { Component } from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SaleHistory from './SaleHistory';
import DepositBitcoin from './DepositBitcoin'

class NewTrade extends Component {
	render() {
		var img = require('./images/trade.png');

		return (
			<div className=' mr-4 mt-5 trade'>
				<div className="row ml-3" >
					<div className='col-lg-9  col-12 row mr-4 backgroundImg' style={{height:'18rem'}}>
					  
					</div>
					<div className='col-lg-3 row tradeBorder'>
						<div className='col-12'><h5 className='pt-1'>SALE HISTORY</h5></div>
					 	<SaleHistory />
					</div>
				</div>
				<div className="" >
				 	<div className="row">
						<div className="col-lg-4 d-flex col-12 mt-2">
							<div className="tradeBorder scrollY col-lg-6" style={{width:'50%',height:'18rem'}}>	
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
							<div className="ml-2 tradeBorder scrollY col-lg-6" style={{width:'50%',height:'18rem'}}>	
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
						 <div className="col-lg-8 col-md-12" >
						 	<div className='row' >
							 	 <div  className="col-lg-6 mt-2 col-md-6">
							 	 	<div className="tradeBorder" style={{maxheight:'13rem'}}>
						 	 			<DepositBitcoin
							 		 		form="BUY"
							 		 		head="BUY" 
							 		 		link="DOLLARS" 
							 		 		balance="500" 
							 		 		totalAmount="4,090.52"  
							 		 		total="Spend"
							 		 		btc="BUY"/> 
							 	 	</div>

							 	 </div>
						 		 <div className="col-lg-6 mt-2 col-md-6" style={{ }}>
						 		 	<div className="tradeBorder" style={{maxheight:'13rem'}}>
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
						 	</div>
						 	<div className='row' >
							 	 <div  className="col-lg-6 mt-2 col-md-6">
							 	 	<div className="tradeBorder" style={{height:'9rem'}}><h5>My Open Orders</h5></div>
							 	 </div>
						 		 <div className="col-lg-6 mt-2 col-md-6" style={{ }}>
						 		 	<div className="tradeBorder" style={{height:'9rem'}}><h5>My Trading History</h5></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewTrade);