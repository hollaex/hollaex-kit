import React, { Component } from 'react';
import { Link } from 'react-router'

import SaleHistory from './SaleHistory';
import saleHistory from './BuyHistory';
import DepositBitcoin from './DepositBitcoin'

export default class Trade extends Component {
	render() {
		var amount= saleHistory.map((item,index)=>(
			  <div key={index}>{item.amount}</div>
		))
		var price= saleHistory.map((item,index)=>(
			  <div key={index}>{item.price}</div>
		))
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
							 <div className="tradeBorder" style={{width:'48%'}}>	
							 	<div className="row">
							 		<h5 className="ml-4 mt-1">BUY</h5>
							 		<p className="mt-1 ml-3">Deposit Dollars</p>
							 	</div>
							 	<div className="row">
							 		<div className="col-lg-7 text-right">
							 		 	<p>AMOUNT</p>
							 		 	<div>{amount}</div>
							 		</div>
							 		<div className="col-lg-5">
							 		 	<p>PRICE</p>
							 		 	<div>{price}</div>
							 		</div>
							 	</div>
							 </div>
							<div className="ml-2 tradeBorder" style={{width:'49%'}}>	
							 	<div className="row">
							 		<h5 className="ml-4 mt-1">SELL</h5>
							 		<p className="mt-1 ml-3">Deposit BTC</p>
							 	</div>
							 	<div className="row">
							 		<div className="col-lg-4 pl-4"> 	
										<p>PRICE</p>
							 		 	<div>{price}</div>
							 		</div>
							 		<div className="col-lg-8">
							 		 	<p>AMOUNT</p>
							 		 	<div>{amount}</div>
							 		</div>
							 	</div>
							 </div>
						 </div>
						 <div className="col-lg-8 ml-2">
						 	<div className="row " style={{height:'48%'}}>
						 		<div style={{width:'49%'}} className="tradeBorder">
						 		 	<DepositBitcoin
						 		 		head="BUY BITCOINS" 
						 		 		link="DOLLARS" 
						 		 		balance="500" 
						 		 		totalAmount="4,090.52"  
						 		 		total="Spend"
						 		 		btc="BUY"/> 	 
						 		</div>
						 		<div className="ml-2 tradeBorder" style={{width:'49.5%'}}>
						 		 	<DepositBitcoin 
						 		 		head="SELL BITCOINS" 
						 		 		link="BTC" 
						 		 		balance="0.04 BTC" 
						 		 		totalAmount="26.53" 
						 		 		total="Receive"
						 		 		btc="CELL"/> 	
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