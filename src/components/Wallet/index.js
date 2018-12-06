import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Accordion } from '../';
import { CURRENCIES, BASE_CURRENCY } from '../../config/constants';
import { calculateBalancePrice,
	formatFiatAmount,
	calculatePrice,
	calculatePricePercentage,
	formatPercentage } from '../../utils/currency';
import WalletSection from './Section';
import { DonutChart } from '../../components';
import STRINGS from '../../config/localizedStrings';

class Wallet extends Component {
	state = {
		sections: [],
		totalAssets: 0,
		chartData: []
	};

	componentDidMount() {
		const { user_id, symbol, price } = this.props;
		if (user_id && symbol && price) {
			this.calculateSections(this.props);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.user_id !== this.props.user_id ||
			nextProps.price !== this.props.price ||
			nextProps.orders.length !== this.props.orders.length ||
			nextProps.balance.timestamp !== this.props.balance.timestamp ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.calculateSections(nextProps);
		}
	}

	generateSection = (symbol, price, balance, orders) => {
		const { currencySymbol, formatToCurrency } = CURRENCIES[symbol];
		const name = STRINGS[`${symbol.toUpperCase()}_NAME`];
		return {
			accordionClassName: 'wallet_section-wrapper',
			title: name,
			titleClassName: 'wallet_section-title',
			titleInformation: (
				<div className="wallet_section-title-amount">
					<span>{currencySymbol}</span>
					{formatToCurrency(balance[`${symbol}_balance`])}
				</div>
			),
			content: (
				<WalletSection
					symbol={symbol}
					balance={balance}
					orders={orders}
					price={price}
				/>
			)
		};
	};

	calculateSections = ({ price, balance, orders, prices }) => {
		const sections = [];
		const data = [];

		// TODO calculate right price
		const totalAssets = calculateBalancePrice(balance, prices);
		Object.keys(CURRENCIES).forEach((currency) => {
			const { symbol, formatToCurrency } = CURRENCIES[currency];
			const currencyBalance = calculatePrice(balance[`${symbol}_balance`], prices[currency]);
			const balancePercent = calculatePricePercentage(currencyBalance, totalAssets);
			data.push({
				...CURRENCIES[currency],
				balance: balancePercent,
				balanceFormat: formatToCurrency(currencyBalance),
				balancePercentage: formatPercentage(balancePercent),
			});
			sections.push(this.generateSection(symbol, price, balance, orders));
		});

		this.setState({ sections, chartData: data, totalAssets: formatFiatAmount(totalAssets) });
	};

	render() {
		const { sections, totalAssets, chartData } = this.state;

		if (Object.keys(this.props.balance).length === 0) {
			return <div />;
		}

		return (
			<div className="wallet-wrapper">
				<div className="donut-container">
					<DonutChart chartData={chartData} />
				</div>
				<Accordion sections={sections} />
				{BASE_CURRENCY && (
					<div className="wallet_section-wrapper wallet_section-total_asset d-flex flex-column">
						<div className="wallet_section-title">
							{STRINGS.WALLET.TOTAL_ASSETS}
						</div>
						<div className="wallet_section-total_asset d-flex justify-content-end">
							{STRINGS.FIAT_CURRENCY_SYMBOL}
							<span>{totalAssets}</span>
						</div>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	balance: state.user.balance,
	prices: state.orderbook.prices,
	symbol: state.orderbook.symbol,
	price: state.orderbook.price,
	orders: state.order.activeOrders,
	user_id: state.user.id,
	activeLanguage: state.app.language
});

export default connect(mapStateToProps)(Wallet);
