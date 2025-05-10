/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Table, Button, Spin, Input } from 'antd';
import { requestDeals } from './actions';
import BigNumber from 'bignumber.js';
import moment from 'moment';

const P2PDeals = ({ coins, coinSymbols }) => {
	const [userData, setUserData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [queryValues, setQueryValues] = useState();
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});

	const [userQuery, setUserQuery] = useState({});

	const statuses = {
		staking: 2,
		unstaking: 1,
		closed: 3,
	};

	const columns = [
		{
			title: 'Vendor ID',
			dataIndex: 'merchant_id',
			key: 'merchant_id',
			render: (user_id, data) => {
				return (
					<div
						className="d-flex"
						onClick={() =>
							browserHistory?.push(`admin/user?id=${data?.merchant_id}`)
						}
					>
						<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							{data?.merchant_id}
						</Button>
					</div>
				);
			},
		},
		{
			title: 'Side',
			dataIndex: 'side',
			key: 'side',
			render: (user_id, data) => {
				return (
					<div
						className="d-flex justify-content-center"
						style={{
							padding: '2% 10%',
							backgroundColor:
								data?.side === 'sell'
									? 'var(--trading_selling-related-elements)'
									: 'var(--specials_checks-okay-done)',
						}}
					>
						{data?.side?.toUpperCase()}
					</div>
				);
			},
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			render: (user_id, data) => {
				if (coinSymbols?.[data.spending_asset]) {
					const incrementUnit =
						coinSymbols?.[data.spending_asset]?.increment_unit;
					const decimalPoint = new BigNumber(incrementUnit).dp();
					const sourceAmount = new BigNumber(
						data.exchange_rate * (1 + Number(data.spread || 0))
					)
						.decimalPlaces(decimalPoint)
						.toNumber();
					return (
						<div className="d-flex">
							{sourceAmount} {data.spending_asset.toUpperCase()}
						</div>
					);
				} else {
					return (
						<div className="d-flex">{data.spending_asset.toUpperCase()}</div>
					);
				}
			},
		},
		{
			title: 'Limit/Available',
			dataIndex: 'limit',
			key: 'limit',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<div>
							Available: {data.total_order_amount}{' '}
							{data.buying_asset.toUpperCase()}
							{','}
						</div>
						<div style={{ marginLeft: 5 }}>
							Limit: {data.min_order_value} - {data.max_order_value}{' '}
							{data.spending_asset.toUpperCase()}
						</div>
					</div>
				);
			},
		},
		{
			title: 'Methods',
			dataIndex: 'methods',
			key: 'methods',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data.payment_methods
							.map((method) => method.system_name)
							.join(', ')}
					</div>
				);
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (user_id, data) => {
				return (
					<div className="d-flex">{data?.status ? 'Active' : 'Inactive'}</div>
				);
			},
		},
		{
			title: 'Start date',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (user_id, data) => {
				return <div className="d-flex">{formatDate(data?.created_at)}</div>;
			},
		},
		// {
		// 	title: 'Edit',
		// 	dataIndex: 'edit',
		// 	key: 'edit',
		// 	render: (user_id, data) => {
		// 		return (
		// 			<div className="d-flex">
		// 				<Button
		// 					onClick={(e) => {
		// 						e.stopPropagation();
		// 						// setEditMode(true);
		// 						// setSelectedCoin(data);
		// 						// setDisplayCostumizationModal(true);
		// 					}}
		// 					style={{ backgroundColor: '#CB7300', color: 'white' }}
		// 				>
		// 					Edit
		// 				</Button>
		// 			</div>
		// 		);
		// 	},
		// },

		// {
		// 	title: 'Action',
		// 	dataIndex: '',
		// 	key: '',
		// 	render: (user_id, data) => {
		// 		return (
		// 			<div className="d-flex">
		// 				<Button
		// 					style={{
		// 						backgroundColor: '#288500',
		// 						color: 'white',
		// 					}}
		// 				>
		// 					Edit
		// 				</Button>

		// 			</div>
		// 		);
		// 	},
		// },
	];

	useEffect(() => {
		requestExchangeStakers(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const formatDate = (date) => {
		return moment(date).format('DD/MMM/YYYY, hh:mmA ').toUpperCase();
	};

	const requestExchangeStakers = (page = 1, limit = 50) => {
		setIsLoading(true);
		requestDeals({ page, limit, ...queryValues })
			.then((response) => {
				let buyCount = 0;
				let sellCount = 0;

				response?.data?.map((item) => {
					if (item.side === 'buy') {
						buyCount++;
					} else if (item.side === 'sell') {
						sellCount++;
					}
				});

				setUserData(
					page === 1 ? response.data : [...userData, ...response.data]
				);

				setQueryFilters({
					total: response.count,
					fetched: true,
					page,
					currentTablePage: page === 1 ? 1 : queryFilters.currentTablePage,
					isRemaining: response.count > page * limit,
					buyCount,
					sellCount,
				});

				setIsLoading(false);
			})
			.catch((error) => {
				// const message = error.message;
				setIsLoading(false);
			});
	};

	const pageChange = (count, pageSize) => {
		const { page, limit, isRemaining } = queryFilters;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requestExchangeStakers(page + 1, limit);
		}
		setQueryFilters({ ...queryFilters, currentTablePage: count });
	};

	return (
		<div>
			<div style={{ color: 'white', fontWeight: 'bold' }}>P2p Deals</div>
			<div style={{ color: '#ccc' }}>Track p2p deals on the exchange</div>

			<div>
				<div style={{ marginTop: 20 }}>
					{/* <SessionFilters
						applyFilters={(filters) => {
							setQueryValues(filters);
						}}
						fieldKeyValue={fieldKeyValue}
						defaultFilters={defaultFilters}
					/> */}
				</div>
				<div className="mt-5">
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						{/* <span
							onClick={(e) => {
								requestDownload();
							}}
							className="mb-2 underline-text cursor-pointer"
							style={{ cursor: 'pointer' }}
						>
							Search user
						</span> */}
						<span style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
							<div>
								<div>Search vendor</div>
								<div style={{ display: 'flex', gap: 10 }}>
									<Input
										style={{}}
										placeholder="Search User ID"
										onChange={(e) => {
											setUserQuery({
												...(userQuery?.status && { status: userQuery.status }),
												...(e.target.value && { user_id: e.target.value }),
											});
										}}
										value={userQuery.user_id}
									/>
									<Button
										onClick={() => {
											setQueryValues(userQuery);
										}}
										style={{
											backgroundColor: '#288500',
											color: 'white',
											flex: 1,
											height: 35,
											marginRight: 5,
										}}
										type="default"
									>
										Apply
									</Button>
								</div>
							</div>
						</span>

						<div>
							{/* <span>
								<Button
									onClick={() => {
										requestSessions(queryFilters.page, queryFilters.limit);
									}}
									style={{
										backgroundColor: '#288500',
										color: 'white',
										flex: 1,
										height: 35,
										marginRight: 10,
									}}
									type="default"
								>
									Refresh
								</Button>
							</span> */}
							{/* <span>Total: {queryFilters.total || '-'}</span> */}
							<div>
								<span className="font-weight-bold">Total Public Deals:</span>{' '}
								{queryFilters.total}
								<div className="d-flex font-weight-bold justify-content-end">
									<div
										style={{
											color: 'var(--specials_checks-okay-done)',
										}}
									>
										<span>Buy:</span>
										<span className="ml-1">{queryFilters?.buyCount}</span>
									</div>
									<div
										className="ml-2"
										style={{
											color: 'var(--trading_selling-related-elements)',
										}}
									>
										<span>Sell:</span>
										<span className="ml-1">{queryFilters?.sellCount}</span>
									</div>
								</div>
							</div>

							<div>-</div>
						</div>
					</div>

					{/* <div
						style={{
							padding: 10,
							backgroundColor: '#FF0000',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginTop: 20,
						}}
					>
						<span>
							Insufficient funds to settle! Fill the source ABC wallet account:
							User 1 (operator@account.com)
						</span>
						<span>
							<Button
								onClick={() => {}}
								style={{
									backgroundColor: '#FF0000',
									color: 'white',
									flex: 1,
									marginRight: 10,
								}}
								type="default"
							>
								VIEW SOURCE WALLET
							</Button>
						</span>
					</div> */}

					<div className="mt-4 session-table">
						<Spin spinning={isLoading}>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={userData
									.sort((a, b) => {
										return statuses[a.status] - statuses[b.status];
									})
									.filter((x) =>
										userQuery?.status === 'closed'
											? x.status === 'closed'
											: x.status !== 'closed'
									)}
								// expandedRowRender={renderRowContent}
								expandRowByClick={true}
								rowKey={(data) => {
									return data.id;
								}}
								pagination={{
									current: queryFilters.currentTablePage,
									onChange: pageChange,
								}}
							/>
						</Spin>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	exchange: state.asset && state.asset.exchange,
	coins: state.asset.allCoins,
	pairs: state.asset.allPairs,
	user: state.user,
	quicktrade: state.app.allContracts.quicktrade,
	networkQuickTrades: state.app.allContracts.networkQuickTrades,
	coinObjects: state.app.allContracts.coins,
	broker: state.app.broker,
	features: state.app.constants.features,
	coinSymbols: state.app.coins,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(P2PDeals);
