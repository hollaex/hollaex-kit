import React, { Component } from 'react';
import { Link } from 'react-router'

import BuyDetail from './BuyDetail'
import Navbar from './Navbar'

export default class QuickBuy extends Component {
	render() {
		return (
			<div>
				<div className='row col-lg-10 offset-1 mt-5' style={{top:'4rem'}}>
					<div className='col-lg-6 text-right'>
						<div>
							<button style={{width:'40%',height:'2.5rem',fontSize:'0.8rem'}} className='boxButton'>
								I WANT TO BUY BITCOINS
							</button>
						</div>
					</div>
					<div className='col-lg-6'>
						<div>
							<button style={{width:'40%',height:'2.5rem'}}>
								I WANT TO SELL BITCOINS
							</button>
						</div>
					</div>
				</div>
				<div className='ml-5 mr-5 mt-5 mb-5 boxBorder'>
					<div className='row ml-4 mr-3 mt-5 mb-5'>
						<BuyDetail dollarRate="100" bitCoin="0.1" fee="1"/>
						<BuyDetail dollarRate="500" bitCoin="0.3" fee="5"/>
						<BuyDetail dollarRate="1,500" bitCoin="0.6" fee="8"/>
						<BuyDetail dollarRate="2,500" bitCoin="0.8" fee="15"/>
					</div>
					<div className='text-center pb-5'>
						<button className='customButton'>
							Buy a custom amount >
						</button>
					</div>
				</div>
			</div>
		);
	}
}