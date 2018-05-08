import React, { Component } from 'react';
import classnames from 'classnames';
import MarketList from './MarketList';

class CurrencyList extends Component {
	state = {
		focusedCurrency: '',
		markets: []
	};

	loadMarkets = (focusedCurrency) => {
		this.removeFocus();
		this[`currency-${focusedCurrency}`].classList.add('focused');
		switch (focusedCurrency) {
			case 'EUR':
				this.setState({
					focusedCurrency,
					markets: ['ADA', 'AAA', 'BBB', 'CCC', 'DDD', 'JJJ', 'PPP', 'PPT']
				});
				break;
			case 'USD':
				this.setState({
					focusedCurrency,
					markets: ['JJJ', 'JJJ', 'JJJ', 'CCC', 'DDD', 'JJJ', 'PPP', 'TTP']
				});
				break;
			case 'ETH':
				this.setState({
					focusedCurrency,
					markets: ['OOO', 'OOO', 'BBB', 'CCC', 'OOO', 'JJJ', 'OOO', 'MMM']
				});
				break;
			case 'BTC':
				this.setState({
					focusedCurrency,
					markets: ['ZZZ', 'AAA', 'ZZZ', 'CCC', 'ZZZ', 'JJJ', 'PPP', 'ZZZ']
				});
				break;
			default:
				this.setState({ focusedCurrency: '', markets: [] });
				break;
		}
	};

	setCurrencyRef = (el) => {
		if (el) {
			this[`currency-${el.innerText}`] = el;
		}
	};

	removeFocus = () => {
		const currencyDomNodes = document.querySelectorAll('div.single-currency');
		currencyDomNodes.forEach((currencyNode) => {
			currencyNode.classList.remove('focused');
		});
	};

	render() {
		const { currencies, className } = this.props;
		const { markets, focusedCurrency } = this.state;
		return (
			<div className={classnames('currency-list', className)}>
				{currencies.map((currency, index) => (
					<div
						ref={this.setCurrencyRef}
						key={index}
						className="d-flex align-items-center single-currency"
						onMouseEnter={() => this.loadMarkets(currency)}
						onClick={() => this.loadMarkets(currency)}
					>
						{currency}
					</div>
				))}
				{focusedCurrency && (
					<MarketList
						markets={markets}
						unFocus={() => {
							this.removeFocus();
							this.setState({ focusedCurrency: '' });
						}}
					/>
				)}
			</div>
		);
	}
}

export default CurrencyList;
