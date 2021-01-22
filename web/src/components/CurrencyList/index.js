import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
import MarketList from './MarketList';
import STRINGS from '../../config/localizedStrings';
import {
	BASE_CURRENCY,
	ICONS,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from '../../config/constants';
import { getClasesForLanguage } from '../../utils/string';
import { formatToCurrency } from '../../utils/currency';

// FIXME: DEAD COMPONENT
class CurrencyList extends Component {
	state = {
		focusedSymbol: '',
		markets: {},
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
			markets: {},
		});
	};

	render() {
		const {
			className,
			pairs,
			orderBookData,
			pair,
			activeLanguage,
			coins,
		} = this.props;
		const { markets, focusedSymbol } = this.state;
		const { min, symbol = '' } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const obj = {};
		Object.entries(pairs).forEach(([key, pair]) => {
			obj[pair.pair_base] = '';
		});
		const symbols = Object.keys(obj).map((key) => key);
		let marketPrice = {};
		Object.keys(orderBookData).forEach((order) => {
			const currency = order.split('-')[0];
			if (orderBookData[order].length && order.includes(symbol.toLowerCase())) {
				marketPrice[currency] = orderBookData[order][0].price;
			}
		});
		return (
			<div
				className={classnames(
					'currency-list f-0',
					className,
					getClasesForLanguage(activeLanguage)
				)}
				onMouseLeave={this.removeFocus}
			>
				{symbols.map((coin, index) => {
					let icon = ICONS[`${coin.toUpperCase()}_ICON}`];
					if (coin === 'bch') {
						icon = ICONS[`${coin.toUpperCase()}_NAV_ICON`];
					}
					const { fullname } = coins[coin] || DEFAULT_COIN_DATA;
					return (
						<div
							key={index}
							className={classnames(
								'd-flex align-items-center single-currency',
								focusedSymbol === coin && 'focused',
								pair.split('-')[0] === coin && 'selected_currency-tab'
							)}
							onMouseEnter={() => this.loadMarkets(coin)}
							onClick={() => this.loadMarkets(coin)}
						>
							<ReactSVG
								src={icon}
								className="app_bar_currency-icon ml-2 mr-2"
							/>
							{fullname}:
							<div className="ml-1">
								{STRINGS.formatString(
									CURRENCY_PRICE_FORMAT,
									formatToCurrency(marketPrice[coin], min),
									''
								)}
							</div>
							<div className="ml-1 mr-1">{symbol.toUpperCase()}</div>
						</div>
					);
				})}
				{focusedSymbol && <MarketList markets={markets} />}
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	pairs: store.app.pairs,
	coins: store.app.coins,
	orderBookData: store.orderbook.pairsTrades,
	activeTheme: store.app.theme,
	pair: store.app.pair,
	activeLanguage: store.app.language,
});

export default connect(mapStateToProps)(CurrencyList);
