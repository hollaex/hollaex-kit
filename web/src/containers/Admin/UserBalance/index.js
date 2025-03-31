import React, { Component } from 'react';
import { Button, message, Modal, Spin, Table } from 'antd';
import { SubmissionError } from 'redux-form';
import { ReactSVG } from 'react-svg';

import { DonutChart, CurrencyBall } from '../../../components';
import { generateCryptoAddress, requestUserBalance } from './actions';
import { requestUserData } from '../User/actions';
import { getPrices, generateChartData } from '../../../actions/assetActions';
import { isSupport } from '../../../utils/token';
import {
	calculateBalancePrice,
	formatCurrencyByIncrementalUnit,
} from '../../../utils/currency';
import { STATIC_ICONS } from 'config/icons';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';

const INITIAL_STATE = {
	userBalance: {},
	loading: true,
	tableData: [],
	chartData: [],
	userInformation: {},
	showGenerateWalletAddress: false,
	generateWalletStep: 'step-1',
	generateAddressParams: {},
	totalAvaliableAsset: 0,
};

class UserBalance extends Component {
	state = INITIAL_STATE;

	UNSAFE_componentWillMount = () => {
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
			const wallet = this.state.userInformation.wallet || [];

			const tableData = Object.entries(this.props.coins)
				.sort()
				.map(([key, value]) => {
					let addressData = {};
					let networks = value.network ? value.network.split(',') : [];
					if (networks.length) {
						networks.map((networkKey) => {
							let temp =
								wallet.filter(
									(data) =>
										data.network === networkKey &&
										data.currency === value.symbol
								)[0] || {};
							return (addressData[`${networkKey}_address`] = temp.address);
						});
					} else {
						let temp = wallet.filter((data) => data.currency === key)[0] || {};
						addressData.address = temp.address;
					}
					return {
						...value,
						...addressData,
						balance: this.state.userBalance[`${key}_balance`],
						balance_available: this.state.userBalance[`${key}_available`],
					};
				});
			this.setState({ tableData });
		}
	}

	onHandleParams = (data, network) => {
		let params = {};
		if (network) {
			params = { ...data, network };
		} else {
			params = { ...data };
		}
		this.setState({
			showGenerateWalletAddress: true,
			generateAddressParams: params,
		});
	};

	renderAddress = ({ network, address, symbol, ...rest }) => {
		let params = { user_id: this.state.userInformation.id, crypto: symbol };
		const networks = network ? network.split(',') : [];
		if (networks.length) {
			return (
				<div>
					address
					{networks.map((data, index) => {
						return (
							<div key={index}>
								{data}:{' '}
								{rest[`${data}_address`]
									? rest[`${data}_address`]
									: 'Not generated'}{' '}
								{!rest[`${data}_address`] && (
									<span
										onClick={() => this.onHandleParams(params, data)}
										className="generate-link"
									>
										(Generate)
									</span>
								)}
							</div>
						);
					})}
				</div>
			);
		} else if (address) {
			return <div>address: {address}</div>;
		} else {
			return (
				<div>
					address: Not generated{' '}
					<span
						onClick={() => this.onHandleParams(params)}
						className="generate-link"
					>
						(Generate)
					</span>
				</div>
			);
		}
	};
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
			// {
			// 	title: 'Address',
			// 	key: 'address',
			// 	render: ({ network, address, ...rest }) => {
			// 		const networks = network ? network.split(',') : [];
			// 		if (networks.length) {
			// 			return (
			// 				<div>
			// 					{networks.map((data, index) => {
			// 						return (
			// 							<div key={index}>{data}: {rest[`${data}_address`] ? rest[`${data}_address`] : 'Not generated'} </div>
			// 						)
			// 					})}
			// 				</div>
			// 			)
			// 		} else if (address) {
			// 			return <div>{address}</div>
			// 		} else {
			// 			return <div>Not generated</div>
			// 		}
			// 	}
			// },
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
		this.setState({ chartData, totalAvaliableAsset: totalAsset });
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
					throw new SubmissionError({
						_error: err.data ? err.data.message : err.message,
					});
				});
		} else {
			const error = new Error('Not found');
			error.data = userData;
			throw error;
		}
	};

	onHandleGenerate = async (params) => {
		this.setState({ showGenerateWalletAddress: false });
		try {
			let res = await generateCryptoAddress({
				body: JSON.stringify(params),
				method: 'POST',
			});
			if (res) {
				requestUserData({ id: params.user_id }).then((res) => {
					if (res && res.data && res.data[0]) {
						this.setState({ userInformation: res.data[0] });
					}
				});
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	GenerateWalletAddress = (key) => {
		const { generateAddressParams } = this.state;
		switch (key) {
			case 'step-2':
				return (
					<div className="step-2-container">
						<div className="title">Generate wallet address</div>
						<div className="middle-container pt-3">
							<fieldset style={{ border: '1px solid' }}>
								<legend style={{ width: 'auto' }} className="ml-3">
									Check and confirm
								</legend>
								<div>
									<div className="d-flex mt-3 pl-3">
										<div className="width-6">User:</div>{' '}
										{generateAddressParams.user_id}
									</div>
									<div className="d-flex mt-3 pl-3">
										<div className="width-6">Assets:</div>{' '}
										{generateAddressParams.crypto}
									</div>
									{generateAddressParams.network && (
										<div className="d-flex mt-3 pl-3 pb-5">
											<div className="width-6">Network:</div>
											{generateAddressParams.network}
										</div>
									)}
								</div>
							</fieldset>
						</div>
						<div className="btn-container">
							<Button
								className="green-btn"
								onClick={() =>
									this.setState({ showGenerateWalletAddress: false })
								}
							>
								Cancel
							</Button>
							<Button
								className="green-btn"
								onClick={() => this.onHandleGenerate(generateAddressParams)}
							>
								Generate
							</Button>
						</div>
					</div>
				);
			default:
			case 'step-1':
				return (
					<div className="step-1-container">
						<div className="title">Generate wallet address</div>
						<div className="info mt-3">
							This will generate crypto address for this assets.
						</div>
						<div className="info mt-3">Are you sure you want to proceed?</div>
						<div className="btn-container">
							<Button
								onClick={() =>
									this.setState({ showGenerateWalletAddress: false })
								}
								className="green-btn"
							>
								Cancel
							</Button>
							<Button
								onClick={() => this.setState({ generateWalletStep: 'step-2' })}
								className="green-btn"
							>
								Next
							</Button>
						</div>
					</div>
				);
		}
	};

	render() {
		const {
			loading,
			tableData,
			chartData,
			generateWalletStep,
			showGenerateWalletAddress,
			userInformation,
			totalAvaliableAsset,
		} = this.state;
		const { coins } = this.props;
		const BALANCE_COLUMN = this.getBalanceColumn();
		const { increment_unit, display_name } =
			coins[
				userInformation?.settings?.interface?.display_currency || BASE_CURRENCY
			] || DEFAULT_COIN_DATA;

		if (loading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return (
			<div className="f-1 admin-user-container">
				<Modal
					visible={showGenerateWalletAddress}
					className="admin-user-modal"
					footer={false}
					onCancel={() => this.setState({ showGenerateWalletAddress: false })}
					afterClose={() => this.setState({ generateWalletStep: 'step-1' })}
				>
					{this.GenerateWalletAddress(generateWalletStep)}
				</Modal>
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
						<div>
							<span>
								Total:{' '}
								{formatCurrencyByIncrementalUnit(
									totalAvaliableAsset,
									increment_unit
								)}{' '}
								{display_name && display_name}
							</span>
						</div>
					</div>
				</div>
				<Table
					columns={BALANCE_COLUMN}
					rowKey={(data) => {
						return data.id;
					}}
					expandedRowRender={this.renderAddress}
					dataSource={tableData}
					className="blue-admin-table"
					pagination={false}
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
