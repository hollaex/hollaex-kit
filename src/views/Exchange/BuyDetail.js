import React, { Component } from 'react';
import numbro from 'numbro'

const formatNumber = (value) => numbro(value).format('0,0.[0000]');

export default class Buy extends Component {
	renderInformation = (side, rate, amount, symbol) => {
		return (
			<div>
				<h3>{`${side} ${side === 'buy' ? '$' : 'BTC'}${rate}`}</h3>
				and receive {formatNumber(amount)} {side === 'buy' ? 'BTC' : 'USD'}
			</div>
		)
	}

	renderActionButton = (side, amount, enabled, onClick) => {
		return (
			<div className='pb-2'>
				<button className='boxButton text-left' disabled={!enabled} onClick={onClick}>
					{`${side} ${side === 'buy' ? '$' : 'BTC'}${formatNumber(amount)} ${side === 'buy' ? 'worth of BITCOINS' : ''}`}
					<span className='ml-4 pl-2'>></span>
				</button>
			</div>
		)
	}

	render() {
		const { rate, amount, fee, enabled, buy, side, symbol } = this.props;
		return (
			<div className='boxBorder ml-2 boxWidth'>
				<div className='mr-4 ml-4'>
					{this.renderInformation(side, rate, amount, symbol)}
					{fee > 0 && <div className='pt-5 pb-2'>{`fee: $${fee}`}</div>}
					{this.renderActionButton(side, rate, enabled, () => buy(side === 'buy' ? amount : rate))}
				</div>
			</div>
		);
	}
}
