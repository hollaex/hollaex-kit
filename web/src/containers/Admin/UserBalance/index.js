import React, { Component } from 'react';
import { Spin, Table } from 'antd';
import { SubmissionError } from 'redux-form';
import { ReactSVG } from 'react-svg';
import Moment from 'react-moment';

import { DonutChart, CurrencyBall } from '../../../components';
import { requestUserBalance } from './actions';
import { getPrices, generateChartData } from '../../../actions/assetActions';
import { isSupport } from '../../../utils/token';
import { calculateBalancePrice } from '../../../utils/currency';
import { STATIC_ICONS } from 'config/icons';

const INITIAL_STATE = {
	userBalance: {},
	loading: true,
	tableData: [],
	chartData: [],
	userInformation: {},
};

class UserBalance extends Component {
	state = INITIAL_STATE;

	componentWillMount = () => {
		const isSupportUser = isSupport();
		if (this.props.userData) {
			this.handleBalance(this.props.userData, isSupportUser);
		}
	};

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevState.userBalance) !==
				JSON.stringify(this.state.userBalance) ||
			JSON.stringify(prevProps.coins) !== JSON.stringify(this.props.coins) ||
			JSON.stringify(prevState.userInformation) !==
				JSON.stringify(this.state.userInformation)
		) {
			this.handleChartData();
			const crypto_wallet = this.state.userInformation.crypto_wallet || {};
			const tableData = Object.entries(this.props.coins).map(([key, value]) => {
				return {
					...value,
					address: crypto_wallet[key],
					balance: this.state.userBalance[`${key}_balance`],
					balance_available: this.state.userBalance[`${key}_available`],
				};
			});
			this.setState({ tableData });
		}
	}

	getBalanceColumn = () => {
		return [
			{
				title: 'Assets',
				dataIndex: 'symbol',
				key: 'symbol',
				render: (symbol, data) => {
					return (
						<div className="d-flex align-items-center">
							<CurrencyBall symbol={symbol} name={symbol} size="l" />
							<div className="ml-2">{data.fullname}</div>
						</div>
					);
				},
			},
			{ title: 'Address', dataIndex: 'address', key: 'address' },
			{
				title: 'Last generated',
				dataIndex: 'updated_at',
				key: 'updated_at',
				render: (updated) => (
					<Moment format="YYYY/MM/DD HH:mm">{updated}</Moment>
				),
			},
			{
				title: 'Available',
				dataIndex: 'balance_available',
				key: 'balance_available',
			},
			{ title: 'Balance', dataIndex: 'balance', key: 'balance' },
		];
	};

	handleChartData = async () => {
		const { coins } = this.props;
		const { userBalance } = this.state;
		const prices = await getPrices({ coins });
		const totalAsset = calculateBalancePrice(userBalance, prices, coins);
		const chartData = generateChartData(userBalance, prices, coins, totalAsset);
		this.setState({ chartData });
	};

	handleBalance = (userData, isSupportUser) => {
		if (!isSupportUser) {
			requestUserBalance(userData.id)
				.then((res) => {
					if (res) {
						this.setState({
							isSupportUser: isSupportUser,
							userBalance: res,
							loading: false,
							userInformation: userData,
						});
					}
				})
				.catch((err) => {
					if (err.status === 403) {
						this.setState({ loading: false });
					}
					throw new SubmissionError({ _error: err.data.message });
				});
		} else {
			const error = new Error('Not found');
			error.data = userData;
			throw error;
		}
	};

	render() {
		const { loading, tableData, chartData } = this.state;
		const { coins } = this.props;
		const BALANCE_COLUMN = this.getBalanceColumn();

		if (loading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return (
			<div className="f-1 admin-user-container">
				<div className="d-flex align-items-center mb-4">
					<div>
						<ReactSVG
							src={STATIC_ICONS['USER_SECTION_WALLET']}
							className="admin-wallet-icon"
						/>
					</div>
					<div>
						<h3>User balances</h3>
						<div>
							Below are all the balances of the assets owned by this user
						</div>
					</div>
				</div>
				<Table
					columns={BALANCE_COLUMN}
					rowKey={(data) => {
						return data.id;
					}}
					dataSource={tableData}
				/>
				<div className="user-donut-chart-wrapper">
					<div>Percentage balance breakdown</div>
					<DonutChart
						chartData={chartData}
						coins={coins}
						showOpenWallet={false}
					/>
				</div>
			</div>
		);
	}
}

export default UserBalance;
