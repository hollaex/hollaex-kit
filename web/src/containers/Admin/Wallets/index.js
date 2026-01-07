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
import { getPrices } from 'actions/assetActions';
import { Coin } from 'components';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import './index.scss';
class Wallets extends Component {
	state = {
		users: [],
		fetched: false,
		loading: false,
		error: '',
		showSweep: null,
		walletNum: null,
		constants: {},
		oraclePrices: {},
	};

	UNSAFE_componentWillMount() {
		this.requestTotalBalance();
		this.requestConstants();
		this.setState({ showSweep: false });
		this.fetchPrices();
	}

	componentDidUpdate(prevProps) {
		if (JSON.stringify(prevProps.coins) !== JSON.stringify(this.props.coins)) {
			this.fetchPrices();
		}
	}

	fetchPrices = async () => {
		try {
			const { coins } = this.props;
			if (!coins || !Object.keys(coins).length) return;
			const prices = await getPrices({ coins });
			this.setState({ oraclePrices: prices });
		} catch (e) {
			// ignore price fetch errors for summary display
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
		const { balance, loading, error, oraclePrices } = this.state;
		const { coins } = this.props;
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
				const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
				const price = oraclePrices?.[coin] || 0;
				const est = calculateOraclePrice(balance[`${coin}_balance`], price);
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
		if (Object.keys(oraclePrices).length) {
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
});

export default connect(mapStateToProps)(Wallets);
