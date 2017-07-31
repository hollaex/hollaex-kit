import React, { Component } from 'react';
import saleHistory from './BuyHistory';

export default class SaleHistory extends Component {
	render() {
		return (
			<div>
				<h5 className='pt-1'>SALE HISTORY</h5>
				<div className="row" >
					<div className="col-lg-3 offset-1">
						<p>PRICE</p>
						{
							saleHistory.map((item,index)=>(
								<div key={index}>{item.price}</div>
							))
						}
					</div>
					<div className="col-lg-3">
						<p>AMOUNT</p>
						{
							saleHistory.map((item,index)=>(
								<div key={index}>{item.amount}</div>
							))
						}
					</div>
					<div className="col-lg-5">
						<p>TIME OF SALE</p>
						{
							saleHistory.map((item,index)=>(
								<div key={index}>{item.time}</div>
							))
						}
					</div>
				</div>
			</div>
		);
	}
}
