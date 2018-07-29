import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Accordion } from '../';
import { CURRENCIES, BASE_CURRENCY } from '../../config/constants';
import { calculateBalancePrice, formatFiatAmount } from '../../utils/currency';
import WalletSection from './Section';
import STRINGS from '../../config/localizedStrings';

class Wallet extends Component {
	state = {
		sections: [],
		totalAssets: 0
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

		// TODO calculate right price
		Object.keys(CURRENCIES).forEach((currency) => {
			const { symbol } = CURRENCIES[currency];
			sections.push(this.generateSection(symbol, price, balance, orders));
		});

		const totalAssets = formatFiatAmount(
			calculateBalancePrice(balance, prices)
		);
		this.setState({ sections, totalAssets });
	};

	render() {
		const { sections, totalAssets } = this.state;

		if (Object.keys(this.props.balance).length === 0) {
			return <div />;
		}

		return (
			<div className="wallet-wrapper">
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
