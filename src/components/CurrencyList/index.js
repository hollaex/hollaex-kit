import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import MarketList from './MarketList';
import STRINGS from '../../config/localizedStrings';
import  { ICONS } from '../../config/constants';
import { CURRENCIES } from '../../config/constants';

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
		const { className, pairs, orderBookData, activeTheme, pair } = this.props;
		const { markets, focusedSymbol } = this.state;
		const { formatToCurrency } = CURRENCIES.fiat;
		const obj = {};
		Object.entries(pairs).forEach(([key, pair]) => {
			obj[pair.pair_base] = '';
		});
		const symbols = Object.keys(obj).map((key) => key);
		let marketPrice = {};
		Object.keys(orderBookData).forEach(order => {
			const symbol = order.split('-')[0];
			if(orderBookData[order].length && order.includes(STRINGS.FIAT_SHORTNAME.toLowerCase())) marketPrice[symbol] = orderBookData[order][0].price;
		});
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
							focusedSymbol === symbol && 'focused',
							pair.split('-')[0] === symbol && 'selected_currency-tab'
						)}
						onMouseEnter={() => this.loadMarkets(symbol)}
						onClick={() => this.loadMarkets(symbol)}
					>
						<ReactSVG path={ICONS[`${symbol.toUpperCase()}_ICON${activeTheme === 'dark' ? '_DARK':''}`]} wrapperClassName="app_bar_currency-icon" />
						{STRINGS[`${symbol.toUpperCase()}_NAME`]}:
						<div className="ml-1">{`${STRINGS.FIAT_CURRENCY_SYMBOL}`}</div>
						<div className="ml-1">
							{STRINGS.formatString(
								STRINGS.FIAT_PRICE_FORMAT,
								formatToCurrency(marketPrice[symbol]),
								''
							)}
						</div>
					</div>
				))}
				{focusedSymbol && <MarketList markets={markets}  />}
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	pairs: store.app.pairs,
	orderBookData: store.orderbook.pairsTrades,
	activeTheme: store.app.theme,
	pair: store.app.pair
});

export default connect(mapStateToProps)(CurrencyList);
