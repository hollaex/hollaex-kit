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
		this.removeFocus();

		if (symbol) {
			const markets = Object.entries(this.props.pairs).filter(
				([key, pair]) => pair.pair_base === symbol || pair.pair_2 === symbol
			);
			this.setState({ focusedSymbol: symbol, markets });
		}
	};

	removeFocus = () => {
		this.setState({
			focusedSymbol: '',
			markets: {}
		});
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
				onMouseLeave={this.removeFocus}
			>
				{symbols.map((symbol, index) => (
					<div
						key={index}
						className={classnames(
							'd-flex align-items-center single-currency',
							focusedSymbol === symbol && 'focused'
						)}
						onMouseEnter={() => this.loadMarkets(symbol)}
						onClick={() => this.loadMarkets(symbol)}
					>
						{STRINGS[`${symbol.toUpperCase()}_NAME`].toUpperCase()}
					</div>
				))}
				{focusedSymbol && <MarketList markets={markets}  />}
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	pairs: store.app.pairs
});

export default connect(mapStateToProps)(CurrencyList);
