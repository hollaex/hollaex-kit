import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message, Table, Button, Spin, Modal, Input, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import {
	getTransactionLimits,
	updateTransactionLimits,
	deleteTransactionLimit,
} from './action';
import { requestTiers } from '../User/actions';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	setIsActiveCollectiveLimit,
	setIsActiveIndependentLimit,
	setTransactionLimits,
} from 'actions/appActions';
import { renderAsset } from '../Deposits/utils';
const { Option } = Select;

const TransactionLimits = ({
	coins,
	setLimits,
	isActiveIndependentLimit = false,
	isActiveCollectiveLimit = false,
	setIsActiveIndependentLimit = () => {},
	setIsActiveCollectiveLimit = () => {},
}) => {
	const [coinData, setCoinData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [queryValues] = useState();
	// eslint-disable-next-line
	const [editMode, setEditMode] = useState(false);
	const [userTiers, setTiers] = useState({});
	const [selectedData, setSelectedData] = useState({});
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
	const [displayIndependentModal, setDisplayIndependentModal] = useState(false);
	const [tierFilter, setTierFilter] = useState();

	const [displayDeleteModal, setDisplayDeleteModal] = useState(false);

	const getAccumulatedCoins = (tier) => {
		const tierLimits = coinData.filter((coin) => coin.tier === tier);

		let accumulatedCoins = Object.values(coins || {}).map((coin) =>
			coin?.symbol?.toUpperCase()
		);

		for (const limit of tierLimits) {
			if (limit.limit_currency !== 'default') {
				const index = accumulatedCoins.indexOf(
					limit?.limit_currency?.toUpperCase()
				);
				if (index > -1) {
					accumulatedCoins.splice(index, 1);
				}
			}
		}

		return accumulatedCoins.join(', ');
	};
	const columns = [
		// {
		// 	title: 'ID',
		// 	dataIndex: 'id',
		// 	key: 'id',
		// 	render: (user_id, data) => {
		// 		return (
		// 			<div className="d-flex">
		// 				<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
		// 					{data?.id}
		// 				</Button>
		// 				{/* <div className="ml-3">{data.User.email}</div> */}
		// 			</div>
		// 		);
		// 	},
		// },
		{
			title: 'Tier',
			dataIndex: 'tier',
			key: 'tier',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.tier}</div>;
			},
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data?.amount === 0
							? 'Unlimited'
							: data?.amount === -1
							? 'Disabled'
							: `${data?.amount} ${data?.currency?.toUpperCase()}`}
					</div>
				);
			},
		},
		{
			title: 'Monthly Amount',
			dataIndex: 'monthly_amount',
			key: 'monthly_amount',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<div className="d-flex">
							{data?.monthly_amount === 0 || data?.monthly_amount === null
								? 'Unlimited'
								: data?.monthly_amount === -1
								? 'Disabled'
								: `${data?.monthly_amount} ${data?.currency?.toUpperCase()}`}
						</div>
					</div>
				);
			},
		},
		{
			title: 'Currency',
			dataIndex: 'currency',
			key: 'currency',
			render: (user_id, data) => {
				return (
					<div className="d-flex" style={{ maxWidth: 400 }}>
						{data?.limit_currency === 'default'
							? getAccumulatedCoins(data?.tier)
							: data?.limit_currency?.toUpperCase()}
					</div>
				);
			},
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.type}</div>;
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
								setEditMode(true);
								setSelectedData(data);
								if (data?.limit_currency === 'default') {
									setDisplayCostumizationModal(true);
								} else {
									setDisplayIndependentModal(true);
								}
							}}
							style={{ backgroundColor: '#CB7300', color: 'white' }}
						>
							Edit
						</Button>
					</div>
				);
			},
		},
		{
			title: 'Delete',
			dataIndex: 'delete',
			key: 'delete',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button
							onClick={(e) => {
								e.stopPropagation();
								setSelectedData(data);
								setDisplayDeleteModal(true);
							}}
							style={{ backgroundColor: '#cc0000', color: 'white' }}
						>
							Delete
						</Button>
					</div>
				);
			},
		},
	];

	useEffect(() => {
		setIsLoading(true);
		requesTransactionLimits(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requesTransactionLimits(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	useEffect(() => {
		getTiers();
	}, []);
	const getTiers = () => {
		requestTiers()
			.then((res) => {
				setTiers(res);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		if (isActiveIndependentLimit) {
			setDisplayIndependentModal(true);
			setIsActiveIndependentLimit(false);
		} else if (isActiveCollectiveLimit) {
			setDisplayCostumizationModal(true);
			setIsActiveCollectiveLimit(false);
		}
		//eslint-disable-next-line
	}, [isActiveIndependentLimit, isActiveCollectiveLimit]);

	// const requestDownload = () => {
	// 	// return getExchangeSessionsCsv({ ...queryValues, format: 'csv' });
	// };

	const requesTransactionLimits = (page = 1, limit = 50) => {
		setIsLoading(true);
		// getTransactionLimits({ page, limit, ...queryValues })
		getTransactionLimits()
			.then((response) => {
				setCoinData(
					page === 1 ? response.data : [...coinData, ...response.data]
				);

				setQueryFilters({
					total: response.count,
					fetched: true,
					page,
					currentTablePage: page === 1 ? 1 : queryFilters.currentTablePage,
					isRemaining: response.count > page * limit,
				});
				setLimits(response.data);
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
	// 		requesTransactionLimits(page + 1, limit);
	// 	}
	// 	setQueryFilters({ ...queryFilters, currentTablePage: count });
	// };

	const handleCostumizationModal = () => {
		setDisplayCostumizationModal(false);
		setDisplayIndependentModal(false);
		setSelectedData({});
		setEditMode(false);
	};

	return (
		<div>
			<div style={{ color: '#ccc' }}>
				Below are details of transaction limits in the exchange. You can create
				or edit limits in your exchange.
			</div>
			<div>
				<div style={{ marginTop: 20 }}></div>
				<div className="mt-5">
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ position: 'relative', bottom: 16 }}>
							<div style={{ marginBottom: 3 }}>Tiers</div>

							<Select
								showSearch
								value={tierFilter}
								placeholder="Tiers"
								style={{ color: 'black', width: 150 }}
								notFoundContent={'Not Found'}
								onChange={(value) => {
									setTierFilter(value);
								}}
								className="select-tier"
								getPopupContainer={(trigger) => trigger?.parentNode}
							>
								<Option value={null}>All</Option>
								{Object.values(userTiers || {}).map((tier) => (
									<Option value={tier.id}>Tier {tier.id}</Option>
								))}
							</Select>
						</div>
					</div>

					<div className="mt-4" style={{}}>
						<Spin spinning={isLoading}>
							<div
								style={{
									marginBottom: 10,
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<div>
									<div style={{ fontSize: 20, marginBottom: 3 }}>
										Independent Limits
									</div>
									<div style={{ color: '#ccc' }}>
										Unique daily and monthly withdrawal limits in the asset's
										own currency.
									</div>
								</div>

								<div>
									<span>
										<Button
											onClick={() => {
												setDisplayIndependentModal(true);
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
											Create Independent Limit
										</Button>
									</span>
								</div>
							</div>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={(coinData || [])
									.sort((a, b) => Number(a.tier) - Number(b.tier))
									.filter((a) => a.type !== 'deposit')
									.filter((a) => a.limit_currency !== 'default')
									.filter((a) =>
										tierFilter != null ? a.tier === Number(tierFilter) : true
									)}
								// expandedRowRender={renderRowContent}
								// expandRowByClick={true}
								rowKey={(data) => {
									return data.id;
								}}
								// pagination={{
								// 	current: queryFilters.currentTablePage,
								// 	onChange: pageChange,
								// }}

								pagination={{ pageSize: 6 }}
							/>
						</Spin>
					</div>

					<div className="mt-4" style={{ marginBottom: 80 }}>
						<Spin spinning={isLoading}>
							<div
								style={{
									marginBottom: 10,
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<div>
									<div style={{ fontSize: 20, marginBottom: 3 }}>
										Collective Aggregation Limits
									</div>
									<div style={{ color: '#ccc' }}>
										Unified limit for multiple currencies. Shared standard
										combines withdrawal limits, ensuring consistency and
										simplification of withdrawal management.
									</div>
								</div>
								<div>
									<span>
										<Button
											onClick={() => {
												setDisplayCostumizationModal(true);
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
											Create Collective Limit
										</Button>
									</span>
								</div>
							</div>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={(coinData || [])
									.sort((a, b) => Number(a.tier) - Number(b.tier))
									.filter((a) => a.type !== 'deposit')
									.filter((a) => a.limit_currency === 'default')
									.filter((a) =>
										tierFilter != null ? a.tier === Number(tierFilter) : true
									)}
								// expandedRowRender={renderRowContent}
								// expandRowByClick={true}
								rowKey={(data) => {
									return data.id;
								}}
								// pagination={{
								// 	current: queryFilters.currentTablePage,
								// 	onChange: pageChange,
								// }}

								pagination={{ pageSize: 6 }}
							/>
						</Spin>
					</div>
				</div>

				{displayIndependentModal && (
					<Modal
						maskClosable={false}
						closeIcon={<CloseOutlined style={{ color: 'white' }} />}
						bodyStyle={{
							backgroundColor: '#27339D',
						}}
						visible={displayIndependentModal}
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
							Independent Withdrawal Limit
						</div>
						<div style={{ marginBottom: 30, color: '#ccc' }}>
							Unique daily and monthly withdrawal limits in the asset's own
							currency. Ensures autonomy and control over withdrawal rules for a
							single listed asset.
						</div>
						<div style={{ marginBottom: 20 }}>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Tier</div>
								<Select
									showSearch
									value={selectedData.tier !== null ? selectedData.tier : null}
									placeholder="Select Tier Level"
									disabled={editMode}
									style={{ color: 'black', width: '100%' }}
									notFoundContent={'Not Found'}
									onChange={(value) => {
										setSelectedData({
											...selectedData,
											tier: value,
										});
									}}
								>
									{Object.values(userTiers || {}).map((tier) => (
										<Option value={tier.id}>{tier.id}</Option>
									))}
								</Select>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Currency</div>
								<div style={{ color: '#ccc', marginBottom: 5, fontSize: 12 }}>
									Select currency asset to be withdrawn
								</div>
								<Select
									showSearch
									value={selectedData.currency || null}
									placeholder="Select currency"
									style={{ color: 'black', width: '100%' }}
									notFoundContent={'Not Found'}
									onChange={(value) => {
										setSelectedData({
											...selectedData,
											currency: value,
										});
									}}
								>
									{Object.values(coins || {}).map((coin) => (
										<Option value={coin.symbol}>{coin.symbol}</Option>
									))}
								</Select>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">
									Daily Amount{' '}
									<span style={{ fontSize: 12, color: '#ccc' }}>
										(Input 0 if you want it unlimited or -1 if you want to
										disable withdrawal for the tier.)
									</span>
								</div>
								<Input
									type="number"
									placeholder="Enter amount"
									value={selectedData.amount}
									onChange={(e) => {
										setSelectedData({
											...selectedData,
											amount: e.target.value,
										});
									}}
									suffix={renderAsset(selectedData?.currency)}
								/>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Monthly Amount</div>
								<Input
									type="number"
									placeholder="Enter monthly amount"
									value={selectedData.monthly_amount}
									onChange={(e) => {
										setSelectedData({
											...selectedData,
											monthly_amount: e.target.value,
										});
									}}
									suffix={renderAsset(selectedData?.currency)}
								/>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
								marginBottom: 20,
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
										if (
											selectedData.tier == null ||
											selectedData.amount == null ||
											!selectedData.currency
										) {
											message.error('Please input all the fields');
											return;
										}

										selectedData.limit_currency = selectedData.currency;
										selectedData.type = 'withdrawal';
										selectedData.amount = Number(selectedData.amount);
										if (selectedData.monthly_amount != null)
											selectedData.monthly_amount = Number(
												selectedData.monthly_amount
											);

										await updateTransactionLimits(selectedData);
										requesTransactionLimits();
										message.success('Changes saved.');
										handleCostumizationModal();
									} catch (error) {
										message.error(error.response.data.message);
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
							Create Collective Aggregation Withdrawal Limits
						</div>
						<div style={{ marginBottom: 30, color: '#ccc' }}>
							Unified limit for multiple currencies. Shared standard combines
							withdrawal limits, ensuring consistency and simplification of
							withdrawal management.
						</div>
						<div style={{ marginBottom: 20 }}>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Tier</div>
								<Select
									showSearch
									value={selectedData.tier !== null ? selectedData.tier : null}
									placeholder="Select Tier Level"
									style={{ color: 'black', width: '100%' }}
									notFoundContent={'Not Found'}
									disabled={editMode}
									onChange={(value) => {
										setSelectedData({
											...selectedData,
											tier: value,
										});
									}}
								>
									{Object.values(userTiers || {}).map((tier) => (
										<Option value={tier.id}>{tier.id}</Option>
									))}
								</Select>
							</div>

							<div style={{ marginBottom: 20, marginTop: 20 }}>
								Currency asset collection:{' '}
								{selectedData.tier != null
									? getAccumulatedCoins(selectedData.tier)
									: ''}
							</div>

							<div style={{ marginBottom: 30 }}>
								<div className="mb-1">
									Withdrawal value denominator currency
								</div>
								<div style={{ color: '#ccc', marginBottom: 5, fontSize: 12 }}>
									Select currency asset denomination for determining withdrawal
									value amounts
								</div>
								<Select
									showSearch
									value={selectedData.currency || null}
									placeholder="Select currency"
									style={{ color: 'black', width: '100%' }}
									notFoundContent={'Not Found'}
									onChange={(value) => {
										setSelectedData({
											...selectedData,
											currency: value,
										});
									}}
								>
									{Object.values(coins || {}).map((coin) => (
										<Option value={coin.symbol}>{coin.symbol}</Option>
									))}
								</Select>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">
									Daily Amount{' '}
									<span style={{ fontSize: 12, color: '#ccc' }}>
										(Input 0 if you want it unlimited or -1 if you want to
										disable withdrawal for the tier.)
									</span>
								</div>
								<Input
									type="number"
									placeholder="Enter amount"
									value={selectedData.amount}
									onChange={(e) => {
										setSelectedData({
											...selectedData,
											amount: e.target.value,
										});
									}}
									suffix={renderAsset(selectedData?.currency)}
								/>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Monthly Amount</div>
								<Input
									type="number"
									placeholder="Enter monthly amount"
									value={selectedData.monthly_amount}
									onChange={(e) => {
										setSelectedData({
											...selectedData,
											monthly_amount: e.target.value,
										});
									}}
									suffix={renderAsset(selectedData?.currency)}
								/>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
								marginBottom: 20,
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
										if (
											selectedData.tier == null ||
											selectedData.amount == null ||
											!selectedData.currency
										) {
											message.error('Please input all the fields');
											return;
										}

										selectedData.limit_currency = 'default';
										selectedData.type = 'withdrawal';
										selectedData.amount = Number(selectedData.amount);
										if (selectedData.monthly_amount != null)
											selectedData.monthly_amount = Number(
												selectedData.monthly_amount
											);

										await updateTransactionLimits(selectedData);
										requesTransactionLimits();
										message.success('Changes saved.');
										handleCostumizationModal();
									} catch (error) {
										message.error(error.response.data.message);
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

				{displayDeleteModal && (
					<Modal
						maskClosable={false}
						closeIcon={<CloseOutlined style={{ color: 'white' }} />}
						bodyStyle={{
							backgroundColor: '#27339D',
						}}
						visible={displayDeleteModal}
						footer={null}
						onCancel={() => {
							setDisplayDeleteModal(false);
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
							Delete Transaction Limit
						</div>
						<div style={{ marginBottom: 30, fontSize: 18 }}>
							Are you sure you want to delete this configuration?
						</div>

						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
								marginBottom: 20,
							}}
						>
							<Button
								onClick={() => {
									setDisplayDeleteModal(false);
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
										await deleteTransactionLimit({ id: selectedData.id });
										requesTransactionLimits();
										message.success('Changes saved.');
										setSelectedData({});
										setDisplayDeleteModal(false);
									} catch (error) {
										message.error(error.response.data.message);
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
								YES
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
	isActiveIndependentLimit: state.app.isActiveIndependentLimit,
	isActiveCollectiveLimit: state.app.isActiveCollectiveLimit,
});

const mapDispatchToProps = (dispatch) => ({
	setLimits: bindActionCreators(setTransactionLimits, dispatch),
	setIsActiveIndependentLimit: bindActionCreators(
		setIsActiveIndependentLimit,
		dispatch
	),
	setIsActiveCollectiveLimit: bindActionCreators(
		setIsActiveCollectiveLimit,
		dispatch
	),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(TransactionLimits));
