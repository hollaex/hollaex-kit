import React, { useState, useEffect } from 'react';
import { message, Table, Button, Spin, Modal, Input, Select } from 'antd';
import {
	getTransactionLimits,
	updateTransactionLimits,
	deleteTransactionLimit,
} from './action';
import { requestTiers } from '../User/actions';
import { CloseOutlined } from '@ant-design/icons';
import withConfig from 'components/ConfigProvider/withConfig';
import { connect } from 'react-redux';

const { Option } = Select;

const TransactionLimits = ({ coins }) => {
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
	const [tierFilter, setTierFilter] = useState();

	const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							{data?.id}
						</Button>
						{/* <div className="ml-3">{data.User.email}</div> */}
					</div>
				);
			},
		},
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
				return <div className="d-flex">{data?.amount}</div>;
			},
		},
		{
			title: 'Monthly Amount',
			dataIndex: 'monthly_amount',
			key: 'monthly_amount',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data?.monthly_amount != null ? data?.monthly_amount : '-'}
					</div>
				);
			},
		},
		{
			title: 'Currency',
			dataIndex: 'currency',
			key: 'currency',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.currency}</div>;
			},
		},
		{
			title: 'Limit Currency',
			dataIndex: 'limit_currency',
			key: 'limit_currency',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.limit_currency}</div>;
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
								setDisplayCostumizationModal(true);
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
							<div style={{ marginBottom: 3 }}>Search Tier</div>
							<Input
								value={tierFilter}
								onChange={(e) => {
									setTierFilter(e.target.value);
								}}
								style={{ width: 200 }}
								placeholder={'Enter tier'}
							/>
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
									Create New Transaction Limit
								</Button>
							</span>
							{/* <span>Total: {queryFilters.total || '-'}</span> */}
						</div>
					</div>

					<div className="mt-4" style={{ marginBottom: 80 }}>
						<Spin spinning={isLoading}>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={(coinData || [])
									.sort((a, b) => Number(a.tier) - Number(b.tier))
									.filter((a) => a.type !== 'deposit')
									.filter((a) =>
										tierFilter?.length > 0
											? a.tier === Number(tierFilter)
											: true
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
							{editMode ? 'Edit' : 'Create'} Transaction Limit
						</div>
						<div style={{ marginBottom: 30 }}>
							Congifure transaction attributes
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
								/>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Currency</div>
								<div style={{ color: '#ccc', marginBottom: 5, fontSize: 12 }}>
									Currency of the amount
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
								<div className="mb-1">Limit Currency</div>
								<div style={{ color: '#ccc', marginBottom: 5, fontSize: 12 }}>
									Currency of the accumulated amount for the limit check
								</div>
								<Select
									showSearch
									value={selectedData.limit_currency || null}
									placeholder="Select limit currency"
									style={{ color: 'black', width: '100%' }}
									notFoundContent={'Not Found'}
									onChange={(value) => {
										setSelectedData({
											...selectedData,
											limit_currency: value,
										});
									}}
								>
									<Option value={'default'}>
										Aggregated (all coins in the exchange)
									</Option>
									{Object.values(coins || {}).map((coin) => (
										<Option value={coin.symbol}>{coin.symbol}</Option>
									))}
								</Select>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Type</div>
								<Select
									showSearch
									value={selectedData.type || null}
									placeholder="Select Type"
									style={{ color: 'black', width: '100%' }}
									notFoundContent={'Not Found'}
									onChange={(value) => {
										setSelectedData({
											...selectedData,
											type: value,
										});
									}}
								>
									<Option value={'withdrawal'}>Withdrawal</Option>
									{/* <Option value={'deposit'}>Deposit</Option> */}
								</Select>
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
											!selectedData.tier ||
											!selectedData.amount ||
											!selectedData.currency ||
											!selectedData.limit_currency ||
											!selectedData.type
										) {
											message.error('Please input all the fields');
											return;
										}

										selectedData.amount = Number(selectedData.amount);
										if (selectedData.monthly_amount)
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
});

export default connect(mapStateToProps)(withConfig(TransactionLimits));
