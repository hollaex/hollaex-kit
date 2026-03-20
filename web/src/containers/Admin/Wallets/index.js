import React, { Component } from 'react';
import { Spin, Alert, Table } from 'antd';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { STATIC_ICONS } from 'config/icons';
import { requestTotalBalance, requestConstants } from './actions';
import {
	formatCurrencyByIncrementalUnit,
	calculateOraclePrice,
} from 'utils/currency';
import { Coin } from 'components';
import { DEFAULT_COIN_DATA } from 'config/constants';
import './index.scss';
import { WS_QUOTE_CURRENCY } from 'actions/assetActions';
class Wallets extends Component {
	state = {
		users: [],
		fetched: false,
		loading: false,
		error: '',
		showSweep: null,
		walletNum: null,
		constants: {},
		wsPriceData: {},
	};

	UNSAFE_componentWillMount() {
		this.requestTotalBalance();
		this.requestConstants();
		this.setState({ showSweep: false });
		this.fetchPrices();
	}

	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(prevProps.coins) !== JSON.stringify(this.props.coins) ||
			JSON.stringify(prevProps.wsPriceData) !==
				JSON.stringify(this.props.wsPriceData)
		) {
			this.fetchPrices();
		}
	}

	fetchPrices = () => {
		const { coins, wsPriceData } = this.props;
		if (!coins || !Object.keys(coins)?.length) return;
		if (wsPriceData && Object.keys(wsPriceData)?.length > 0) {
			this.setState({ wsPriceData: wsPriceData });
		}
	};

	requestConstants = () => {
		this.setState({
			loading: true,
			error: '',
		});
		requestConstants()
			.then((res) => {
				this.setState({ loading: false, constants: res.kit });
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message,
				});
			});
	};

	requestTotalBalance = () => {
		this.setState({
			loading: true,
			error: '',
		});

		requestTotalBalance()
			.then((res) => {
				this.setState({
					balance: res,
					loading: false,
					fetched: true,
				});
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message,
				});
			});
	};

	goToVault = () => {
		this.props.router.push('/admin/plugins/vault');
	};

	render() {
		const { balance, loading, error, wsPriceData } = this.state;
		const { coins, oraclePrices } = this.props;
		const sortedCoins = Object.keys(coins).sort();

		const data = [];
		const columns = [
			{
				key: 'assets',
				title: 'Assets',
				dataIndex: 'assets',
				render: (_, row) => {
					const symbol = row?.symbol || '';
					const coinData = coins[symbol] || DEFAULT_COIN_DATA;
					return (
						<div className="d-flex align-items-center">
							<Coin iconId={coinData.icon_id} />
							<div className="ml-2">
								{coinData.fullname || symbol.toUpperCase()}
							</div>
						</div>
					);
				},
			},
			{
				key: 'total',
				title: 'Total',
				dataIndex: 'total',
			},
			{
				key: 'available',
				title: 'Available',
				dataIndex: 'available',
			},
			{
				key: 'estimated',
				title: 'Estimated',
				dataIndex: 'estimated_display',
			},
		];

		sortedCoins.forEach((coin) => {
			if (balance && balance[`${coin}_balance`]) {
				const inc_unit = coins[coin]?.increment_unit;
				const baseCoin =
					coins[localStorage.getItem('base_currnecy')] || WS_QUOTE_CURRENCY;
				const price = wsPriceData?.[coin];
				const oraclePrice = oraclePrices?.[coin];
				const base_currency =
					localStorage.getItem('base_currnecy') || WS_QUOTE_CURRENCY;
				const est = wsPriceData[base_currency]
					? calculateOraclePrice(balance[`${coin}_balance`], price) /
					  wsPriceData[base_currency]
					: calculateOraclePrice(balance[`${coin}_balance`], oraclePrice);

				let asset = {
					symbol: coin,
					assets: coin.toUpperCase(),
					total: formatCurrencyByIncrementalUnit(
						balance[`${coin}_balance`],
						inc_unit
					),
					available: formatCurrencyByIncrementalUnit(
						balance[`${coin}_available`],
						inc_unit
					),
					estimated: Number(est || 0),
					estimated_display: `${formatCurrencyByIncrementalUnit(
						est,
						baseCoin.increment_unit
					)} ${baseCoin.display_name || ''}`,
				};
				data.push(asset);
			}
		});

		// Sort by estimated desc if prices available
		if (Object.keys(wsPriceData)?.length) {
			data.sort((a, b) => Number(b.estimated || 0) - Number(a.estimated || 0));
		}

		return (
			<div className="app_container-content">
				{error && (
					<Alert
						message="Error"
						className="m-top"
						description={error}
						type="error"
						showIcon
					/>
				)}
				{loading ? (
					<Spin size="large" />
				) : (
					<div style={{ width: '60%' }} className="admin-user-container">
						{error && <p>-{error}-</p>}
						<div className="d-flex align-items-center justify-content-between">
							<div className="d-flex align-items-center">
								<ReactSVG
									src={STATIC_ICONS['USER_SECTION_WALLET']}
									className="admin-wallet-icon"
								/>
								<h1>USER WALLETS</h1>
							</div>
						</div>
						<p>Total balance of users wallet</p>
						<Table
							columns={columns}
							rowKey={(data, index) => index}
							dataSource={data}
							loading={data.length === 0}
							size="small"
							pagination={false}
						/>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	constants: state.app.constants,
	coins: state.app.coins,
	wsPriceData: state.asset.wsPriceData,
	oraclePrices: state.asset.oraclePrices,
});

export default connect(mapStateToProps)(Wallets);
