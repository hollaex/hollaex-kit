import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import math from 'mathjs';

import { createOrder } from '../../actions/orderAction';
import BuyDetail from './BuyDetail'

const formatNumber = (fraction) => {
	return math.round(math.eval(math.format(fraction)), 4);
}

const divide = (a, b) => {
	return formatNumber(math.divide(math.fraction(a), math.fraction(b)))
}

const multiply = (a, b) => {
	return formatNumber(math.multiply(math.fraction(a), math.fraction(b)))
}

const DOLLARS_RATE = [ 100, 500, 1500, 2500 ];
const BITCOINS_RATE = [ 1, 10, 100 ];
const ACTIONS = [
	{ side: 'buy', text: 'I WANT TO BUY BITCOINS' },
	{ side: 'sell', text: 'I WANT TO SELL BITCOINS' },
];

class QuickBuy extends Component {
	state = {
		side: 'buy'
	}

	changeSide = (side = 'buy') => {
		this.setState({ side });
	}

	calculateAmount = (amount) => {
		if (this.state.side === 'buy') {
			return divide(amount, this.props.price)
		} else if (this.state.side === 'sell') {
			return multiply(amount, this.props.price)
		}
	}

	placeOrder = (size) => {
		if (this.state.side === 'buy') {
			this.props.buyBitcoins(size);
		} else if (this.state.side === 'sell') {
			this.props.sellBitcoins(size);
		}
	}

	renderSide = (symbol, side, fee, balances) => {
		const balance = balances[`${side === 'buy' ? 'fiat' : symbol}_balance`]
		const rates = side === 'buy' ? DOLLARS_RATE: BITCOINS_RATE;
		return rates.map((rate, index) => <BuyDetail
			key={index}
			rate={rate}
			amount={this.calculateAmount(rate)}
			fee={fee}
			buy={this.placeOrder}
			enabled={rate + fee <= balance}
			symbol={this.props.symbol}
			side={side}
		/>);
	}

	render() {
		const { price, symbol, fee, balance } = this.props;
		return (
			<div>
				<div className='row col-lg-10 offset-1 mt-5' style={{top:'4rem'}}>
					{ ACTIONS.map(({ side, text }, index) => (
							<div className='col-lg-6 text-right' key={index}>
								<div>
									<button
										style={{width:'40%',height:'2.5rem', fontSize:'0.8rem'}}
										className={side === this.state.side && 'boxButton'}
										onClick={() => this.changeSide(side)}
									>{text}</button>
								</div>
							</div>
						))
					}
				</div>
				<div className='ml-5 mr-5 mt-5 mb-5 boxBorder'>
					<div className='row ml-4 mr-3 mt-5 mb-5'>
						{this.renderSide(symbol, this.state.side, fee, balance)}
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

const mapStateToProps = (store, ownProps) => ({
	price: store.orderbook.price,
	balance: store.user.balance,
	symbol: store.orderbook.symbol,
	fee: store.user.fee,
});

const mapDispatchToProps = (dispatch) => ({
	buyBitcoins: (size) => dispatch(createOrder('buy', 'market', size)),
	sellBitcoins: (size) => dispatch(createOrder('sell', 'market', size)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickBuy);
