import React, { Component } from 'react';

export default class Buy extends Component {
	render() {
		return (
			<div className='boxBorder ml-2 boxWidth'>
				<div className='mr-4 ml-4'>
					<div className='pt-2'><h3>{`Buy $${this.props.dollarRate}`}</h3></div>
					<div>and</div>
					<div>{`received ${this.props.bitCoin} bitcoins`}</div>
					<div className='pt-5 pb-2'>{`fee:$${this.props.fee}`}</div>
					<div className='pb-2'>
						<button className='boxButton text-left'>
							BUY $100 WORTH OF BITCOINS  
							<span className='ml-4 pl-2'>></span>
						</button>
					</div>
				</div>
			</div>
		);
	}
}
