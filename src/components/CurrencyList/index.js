import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import MarketList from './MarketList';
import STRINGS from '../../config/localizedStrings';

class CurrencyList extends Component {
	state = {
		focusedSymbol: '',
		markets: {}
	};

	loadMarkets = (symbol = '', pair) => {
		const focusedSymbol = symbol.toUpperCase();
		this.removeFocus();

		this[
			`symbol-${STRINGS[`${focusedSymbol}_NAME`].toUpperCase()}`
		].classList.add('focused');
		if (focusedSymbol) {
			const markets = Object.entries(this.props.pairs).filter(
				([key, pair]) => pair.pair_base === symbol
			);
			this.setState({ focusedSymbol, markets });
		} else {
			this.setState({ focusedSymbol: '', markets: {} });
		}
	};

	setCurrencyRef = (el) => {
		if (el) {
			this[`symbol-${el.innerText}`] = el;
		}
	};

	removeFocus = () => {
		const currencyDomNodes = document.querySelectorAll('div.single-currency');
		currencyDomNodes.forEach((currencyNode) => {
			currencyNode.classList.remove('focused');
		});
	};

	onMouseLeave = () => {
		this.removeFocus();
		this.setState({ focusedSymbol: '' });
	};

	render() {
		const { className, pairs } = this.props;
		const { markets, focusedSymbol } = this.state;
		const obj = {};
		Object.entries(pairs).forEach(([key, pair]) => {
			obj[pair.pair_base] = '';
		});
		const symbols = Object.keys(obj).map((key) => key);

		return (
			<div
				className={classnames('currency-list f-0', className)}
				onMouseLeave={this.onMouseLeave}
			>
				{symbols.map((symbol, index) => (
					<div
						ref={this.setCurrencyRef}
						key={index}
						className="d-flex align-items-center single-currency"
						onMouseEnter={() => this.loadMarkets(symbol)}
						onClick={() => this.loadMarkets(symbol)}
					>
						{STRINGS[`${symbol.toUpperCase()}_NAME`].toUpperCase()}
					</div>
				))}
				{focusedSymbol && <MarketList markets={markets} />}
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	pairs: store.app.pairs
});

export default connect(mapStateToProps)(CurrencyList);
