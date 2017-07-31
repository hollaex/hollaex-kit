import React, { Component } from 'react';
import { Link } from 'react-router'

export default class DepositBitcoin extends Component {
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