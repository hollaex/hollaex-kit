import React, { useState, useEffect } from 'react';
import { message, Table, Button, Spin, Modal, Input } from 'antd';

import { CloseOutlined } from '@ant-design/icons';
import withConfig from 'components/ConfigProvider/withConfig';
import { connect } from 'react-redux';
import { updateConstants } from '../General/action';
import { requestAdminData } from 'actions/appActions';
import { renderAsset } from '../Deposits/utils';

const CoinConfiguration = ({ coins, handleTabChange }) => {
	const [coinData, setCoinData] = useState([]);
	const [coinCustomizations, setCoinCustomizations] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [queryValues] = useState();
	// eslint-disable-next-line
	const [editMode, setEditMode] = useState(false);
	const [selectedCoin, setSelectedCoin] = useState(true);
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});

	const [displayCostumizationModal, setDisplayCostumizationModal] = useState(
		false
	);

	const columns = [
		{
			title: 'Symbol',
			dataIndex: 'symbol',
			key: 'symbol',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.symbol}</div>;
			},
		},
		{
			title: 'Name',
			dataIndex: 'fullname',
			key: 'fullname',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.fullname || '-'}</div>;
			},
		},
		{
			title: 'Witdrawal Fee Markup',
			dataIndex: 'fee_markup',
			key: 'fee_markup',
			render: (user_id, data) => {
				const markups = data?.fee_markups || {};
				return (
					<div className="d-flex">
						{Object.keys(markups)
							.map((key) => `${key}: ${markups[key]?.withdrawal?.value}`)
							.join(', ') || '-'}
					</div>
				);
			},
		},
		{
			title: 'Deposit Fee Markup',
			dataIndex: 'fee_markup',
			key: 'fee_markup',
			render: (user_id, data) => {
				const markups = data?.fee_markups || {};
				return (
					<div className="d-flex">
						{Object.keys(markups)
							.map((key) => `${key}: ${markups[key]?.deposit?.value}`)
							.join(', ') || '-'}
					</div>
				);
			},
		},
		{
			title: 'Edit',
			dataIndex: 'edit',
			key: 'edit',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button
							onClick={(e) => {
								e.stopPropagation();
								// setEditMode(true);
								// setSelectedCoin(data);
								// setDisplayCostumizationModal(true);
								handleTabChange('0', data);
							}}
							style={{ backgroundColor: '#CB7300', color: 'white' }}
						>
							Edit
						</Button>
					</div>
				);
			},
		},
	];

	useEffect(() => {
		// setIsLoading(true);
		requesCoinConfiguration(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// requesCoinConfiguration(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const requestDownload = () => {
		// return getExchangeSessionsCsv({ ...queryValues, format: 'csv' });
	};

	// const renderRowContent = (coin) => {
	// 	return (
	// 		<div>
	// 			<div>
	// 				<span style={{ fontWeight: 'bold' }}>Estimated Price:</span>{' '}
	// 				{coins[coin.symbol].estimated_price}
	// 			</div>
	// 			<div>
	// 				<span style={{ fontWeight: 'bold' }}>Network:</span>{' '}
	// 				{coins?.[coin.symbol]?.network?.toUpperCase()}
	// 			</div>
	// 			<div>
	// 				<span style={{ fontWeight: 'bold' }}>Verified:</span>{' '}
	// 				{coins[coin.symbol].verified ? 'Yes' : 'No'}
	// 			</div>
	// 		</div>
	// 	);
	// };

	const requesCoinConfiguration = (page = 1, limit = 50) => {
		setIsLoading(true);
		// getCoinConfiguration({ page, limit, ...queryValues })
		requestAdminData()
			.then((response) => {
				const data = response?.data?.kit?.coin_customizations || {};

				for (const coin of Object.values(coins)) {
					if (coin.type !== 'fiat') {
						data[coin.symbol] = {
							...(data[coin.symbol] || {
								symbol: coin.symbol,
								fee_markup: null,
							}),
							fullname: coin.fullname,
						};
					} else delete data[coin.symbol];
				}
				setCoinCustomizations(Object.values(data));
				setCoinData(data);

				setQueryFilters({
					total: response.count,
					fetched: true,
					page,
					currentTablePage: page === 1 ? 1 : queryFilters.currentTablePage,
					isRemaining: response.count > page * limit,
				});

				setIsLoading(false);
			})
			.catch((error) => {
				// const message = error.message;
				setIsLoading(false);
			});
	};

	// const pageChange = (count, pageSize) => {
	// 	const { page, limit, isRemaining } = queryFilters;
	// 	const pageCount = count % 5 === 0 ? 5 : count % 5;
	// 	const apiPageTemp = Math.floor(count / 5);
	// 	if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
	// 		requesCoinConfiguration(page + 1, limit);
	// 	}
	// 	setQueryFilters({ ...queryFilters, currentTablePage: count });
	// };

	const handleCostumizationModal = () => {
		setDisplayCostumizationModal(false);
		setSelectedCoin();
		setEditMode(false);
	};

	return (
		<div>
			<div style={{ color: '#ccc' }}>
				Add a markup fee on blockchain asset withdrawals for each coin listed on
				your exchange. This additional fee is charged on top of the standard
				withdrawal fees and can serve as an extra revenue stream for your
				exchange operations.
			</div>
			<div>
				<div style={{ marginTop: 20 }}></div>
				<div className="mt-5">
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span
							onClick={(e) => {
								requestDownload();
							}}
							className="mb-2 underline-text cursor-pointer"
							style={{ cursor: 'pointer' }}
						>
							{/* Download below CSV table */}
						</span>
						<div>
							<span>
								{/* <Button
									onClick={() => {
										setDisplayCostumizationModal(true)
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
									Create New Customization
								</Button> */}
							</span>
							{/* <span>Total: {queryFilters.total || '-'}</span> */}
						</div>
					</div>

					<div className="mt-4" style={{ marginBottom: 80 }}>
						<Spin spinning={isLoading}>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={
									coinCustomizations || [].sort((a, b) => a.symbol - b.symbol)
								}
								rowKey={(data) => {
									return data.id;
								}}
								// pagination={{
								// 	current: queryFilters.currentTablePage,
								// 	onChange: pageChange,
								// }}

								pagination={false}
							/>
						</Spin>
					</div>
				</div>

				{displayCostumizationModal && (
					<Modal
						maskClosable={false}
						closeIcon={<CloseOutlined style={{ color: 'white' }} />}
						bodyStyle={{
							backgroundColor: '#27339D',
						}}
						visible={displayCostumizationModal}
						footer={null}
						onCancel={() => {
							handleCostumizationModal();
						}}
					>
						<div
							style={{
								fontWeight: '600',
								color: 'white',
								fontSize: 18,
								marginBottom: 10,
							}}
						>
							Edit Coin Fee Markup
						</div>
						<div style={{ marginBottom: 30 }}>
							Set an additional withdrawal fee for this coin to generate extra
							revenue.
						</div>
						<div style={{ marginBottom: 20 }}>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Fee Markup</div>
								<Input
									type="number"
									placeholder="Enter Fee Markup"
									value={selectedCoin.fee_markup}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											fee_markup: e.target.value,
										});
									}}
									suffix={renderAsset(selectedCoin?.symbol)}
								/>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
							}}
						>
							<Button
								onClick={() => {
									handleCostumizationModal();
								}}
								style={{
									backgroundColor: '#288500',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								Back
							</Button>
							<Button
								onClick={async () => {
									try {
										if (selectedCoin.fee_markup) {
											selectedCoin.fee_markup = Number(selectedCoin.fee_markup);
										}

										await updateConstants({
											kit: {
												coin_customizations: {
													...coinData,
													[selectedCoin.symbol]: {
														symbol: selectedCoin.symbol,
														fee_markup: selectedCoin.fee_markup,
														fee_markups: selectedCoin?.fee_markups,
													},
												},
											},
										});

										requesCoinConfiguration();
										message.success('Changes saved.');
										handleCostumizationModal();
									} catch (error) {
										message.error(error.data.message);
									}
								}}
								style={{
									backgroundColor: '#288500',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								PROCEED
							</Button>
						</div>
					</Modal>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(withConfig(CoinConfiguration));
