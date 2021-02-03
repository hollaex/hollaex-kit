import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Accordion, ControlledScrollbar } from 'components';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../config/constants';
import { formatToCurrency } from '../../utils/currency';
import WalletSection from './Section';
import { DonutChart } from '../../components';
import STRINGS from '../../config/localizedStrings';

class Wallet extends Component {
	state = {
		sections: [],
	};

	componentDidMount() {
		const { user_id, symbol, prices } = this.props;
		if (user_id && symbol && prices) {
			this.calculateSections(this.props);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			nextProps.user_id !== this.props.user_id ||
			nextProps.price !== this.props.price ||
			nextProps.orders.length !== this.props.orders.length ||
			nextProps.balance.timestamp !== this.props.balance.timestamp ||
			nextProps.totalAsset !== this.props.totalAsset ||
			JSON.stringify(this.props.prices) !== JSON.stringify(nextProps.prices) ||
			JSON.stringify(this.props.chartData) !==
				JSON.stringify(nextProps.chartData) ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.calculateSections(nextProps);
		}
	}

	generateSection = (symbol, price, balance, orders, coins) => {
		const { min, fullname, ...rest } = coins[symbol] || DEFAULT_COIN_DATA;
		return {
			accordionClassName: 'wallet_section-wrapper',
			title: fullname,
			titleClassName: 'wallet_section-title',
			titleInformation: (
				<div className="wallet_section-title-amount">
					{formatToCurrency(balance[`${symbol}_balance`], min)}
					<span className="mx-1">{rest.symbol.toUpperCase()}</span>
				</div>
			),
			content: (
				<WalletSection
					symbol={symbol}
					balance={balance}
					orders={orders}
					price={price}
					coins={coins}
				/>
			),
		};
	};

	calculateSections = ({ price, balance, orders, coins, chartData }) => {
		const sections = [];

		chartData.forEach(({ symbol, balance: balancePercent }) => {
			if (balancePercent !== 0) {
				sections.push(
					this.generateSection(symbol, price, balance, orders, coins)
				);
			}
		});

		this.setState({
			sections,
		});
	};

	render() {
		const { sections } = this.state;
		const {
			fetching,
			balance,
			coins,
			prices,
			totalAsset,
			chartData,
		} = this.props;

		if (Object.keys(balance).length === 0) {
			return <div />;
		}

		const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const { symbol = '' } = coins[BASE_CURRENCY] || {};
		const hasScrollbar = sections.length > 7;

		return (
			<div className="wallet-wrapper">
				<div className="donut-container">
					{!Object.keys(balance).length ||
					!Object.keys(coins).length ||
					!Object.keys(prices).length ||
					!chartData.length ||
					fetching ? (
						<div className="text-center mt-3">
							{STRINGS['WALLET.LOADING_ASSETS']}
						</div>
					) : (
						<DonutChart
							id="side-bar-donut"
							coins={coins}
							chartData={chartData}
						/>
					)}
				</div>
				<ControlledScrollbar
					autoHideArrows={true}
					autoHeight={true}
					autoHeightMax={hasScrollbar ? 245 : 350}
				>
					<Accordion sections={sections} />
					<div className="d-flex justify-content-center wallet_link blue-link">
						<Link to="/wallet">{`view all`}</Link>
					</div>
				</ControlledScrollbar>
				{BASE_CURRENCY ? (
					<div className="wallet_section-wrapper wallet_section-total_asset d-flex flex-column">
						<div className="wallet_section-title">
							{STRINGS['WALLET.TOTAL_ASSETS']}
						</div>
						<div className="wallet_section-total_asset d-flex justify-content-end">
							<span>{formatToCurrency(totalAsset, baseCoin.min)}</span>
							{symbol.toUpperCase()}
						</div>
					</div>
				) : null}
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
	chartData: state.asset.chartData,
	totalAsset: state.asset.totalAsset,
	activeLanguage: state.app.language,
	coins: state.app.coins,
	fetching: state.auth.fetching,
});

export default connect(mapStateToProps)(Wallet);
