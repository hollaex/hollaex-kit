import React, { useState, useEffect } from 'react';
import { message, Table, Button, Spin, Modal, Input, InputNumber } from 'antd';
import { getCoinConfiguration, updateCoinConfiguration } from './action';

import { CloseOutlined } from '@ant-design/icons';
import withConfig from 'components/ConfigProvider/withConfig';
import { connect } from 'react-redux';

const CoinConfiguration = ({ coins }) => {
	const [coinData, setCoinData] = useState([]);
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
				return <div className="d-flex">{data?.fullname}</div>;
			},
		},
		{
			title: 'Logo',
			dataIndex: 'logo',
			key: 'logo',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<img src={data?.logo} alt={'-'} />
					</div>
				);
			},
		},
		{
			title: 'Increment Unit',
			dataIndex: 'increment_unit',
			key: 'increment_unit',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.increment_unit}</div>;
			},
		},
		{
			title: 'Withdrawal Fee',
			dataIndex: 'withdrawal_fee',
			key: 'withdrawal_fee',
			render: (user_id, data) => {
				return (
					<div>
						<div>Default: {data?.withdrawal_fee}</div>
						<div>
							{data?.withdrawal_fees &&
								Object.values(data?.withdrawal_fees).map((fee) => (
									<div>
										{fee.symbol}: {fee.value}
									</div>
								))}
						</div>
					</div>
				);
			},
		},
		{
			title: 'Deposit Fee',
			dataIndex: 'deposit_fees',
			key: 'deposit_fees',
			render: (user_id, data) => {
				return (
					<div>
						<div>
							{data?.deposit_fees
								? Object.values(data?.deposit_fees).map((fee) => (
										<div>
											{fee.symbol}: {fee.value}
										</div>
								  ))
								: '-'}
						</div>
					</div>
				);
			},
		},
		{
			title: 'Withdrawal Limit',
			dataIndex: 'withdrawal_limit',
			key: 'withdrawal_limit',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.withdrawal_limit || '-'}</div>;
			},
		},
		{
			title: 'Deposit Limit',
			dataIndex: 'deposit_limit',
			key: 'deposit_limit',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.deposit_limit || '-'}</div>;
			},
		},
		{
			title: 'Mounthly Withdrawal Limit',
			dataIndex: 'mounthly_withdrawal_limit',
			key: 'mounthly_withdrawal_limit',
			render: (user_id, data) => {
				return (
					<div className="d-flex">{data?.mounthly_withdrawal_limit || '-'}</div>
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
								setEditMode(true);
								setSelectedCoin(data);
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
	];

	useEffect(() => {
		setIsLoading(true);
		requesCoinConfiguration(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requesCoinConfiguration(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const requestDownload = () => {
		// return getExchangeSessionsCsv({ ...queryValues, format: 'csv' });
	};

	const renderRowContent = (coin) => {
		return (
			<div>
				<div>
					<span style={{ fontWeight: 'bold' }}>Estimated Price:</span>{' '}
					{coins[coin.symbol].estimated_price}
				</div>
				<div>
					<span style={{ fontWeight: 'bold' }}>Network:</span>{' '}
					{coins?.[coin.symbol]?.network?.toUpperCase()}
				</div>
				<div>
					<span style={{ fontWeight: 'bold' }}>Verified:</span>{' '}
					{coins[coin.symbol].verified ? 'Yes' : 'No'}
				</div>
			</div>
		);
	};

	const requesCoinConfiguration = (page = 1, limit = 50) => {
		setIsLoading(true);
		// getCoinConfiguration({ page, limit, ...queryValues })
		getCoinConfiguration()
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
				Below are details of active coins in the exchange. You can customize
				each coin in your exchange.
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

					<div className="mt-4 ">
						<Spin spinning={isLoading}>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={coinData.sort((a, b) => a.id - b.id)}
								expandedRowRender={renderRowContent}
								expandRowByClick={true}
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
							Edit Coin Customization
						</div>
						<div style={{ marginBottom: 30 }}>Congifure coin attributes</div>
						<div style={{ marginBottom: 20 }}>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Symbol</div>
								<Input
									placeholder="Enter symbol"
									value={selectedCoin.symbol}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											symbol: e.target.value,
										});
									}}
								/>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Name</div>
								<Input
									placeholder="Enter name"
									value={selectedCoin.fullname}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											fullname: e.target.value,
										});
									}}
								/>
							</div>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Logo(url string)</div>
								<Input
									placeholder="Enter logo string"
									value={selectedCoin.logo}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											logo: e.target.value,
										});
									}}
								/>
							</div>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Increment Unit</div>
								<Input
									type="number"
									placeholder="Enter increment Unit"
									value={selectedCoin.increment_unit}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											increment_unit: e.target.value,
										});
									}}
								/>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Default Withdrawal Fee</div>
								<Input
									type="number"
									placeholder="Enter Default withdrawal fee"
									value={selectedCoin.withdrawal_fee}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											withdrawal_fee: e.target.value,
										});
									}}
								/>
							</div>

							{Object.keys(selectedCoin.withdrawal_fees || {}).map(
								(network) => {
									return (
										<div style={{ marginBottom: 10 }}>
											<div className="mb-1">
												Withdrawal Fee for {network.toUpperCase()} Network
											</div>
											<InputNumber
												placeholder="Enter withdrawal fee for network"
												value={selectedCoin.withdrawal_fees[network].value}
												onChange={(value) => {
													const newSelectedCoin = JSON.parse(
														JSON.stringify(selectedCoin)
													);
													newSelectedCoin.withdrawal_fees[
														network
													].value = value;
													setSelectedCoin({
														...newSelectedCoin,
													});
												}}
												style={{ width: '70%' }}
											/>
										</div>
									);
								}
							)}

							{Object.keys(selectedCoin.deposit_fees || {}).map((network) => {
								return (
									<div style={{ marginBottom: 10 }}>
										<div className="mb-1">
											Deposit Fee for {network.toUpperCase()} Network
										</div>
										<InputNumber
											placeholder="Enter deposit fee for network"
											value={selectedCoin.deposit_fees[network].value}
											onChange={(value) => {
												const newSelectedCoin = JSON.parse(
													JSON.stringify(selectedCoin)
												);
												newSelectedCoin.deposit_fees[network].value = value;
												setSelectedCoin({
													...newSelectedCoin,
												});
											}}
											style={{ width: '70%' }}
										/>
									</div>
								);
							})}

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Withdrawal Limit</div>
								<Input
									type="number"
									placeholder="Enter withdrawal limit"
									value={selectedCoin.withdrawal_limit}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											withdrawal_limit: e.target.value,
										});
									}}
								/>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Deposit Limit</div>
								<Input
									type="number"
									placeholder="Enter deposit limit"
									value={selectedCoin.deposit_limit}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											deposit_limit: e.target.value,
										});
									}}
								/>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Mounthly Withdrawal Limit</div>
								<Input
									type="number"
									placeholder="Enter mounthly withdrawal limit"
									value={selectedCoin.mounthly_withdrawal_limit}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											mounthly_withdrawal_limit: e.target.value,
										});
									}}
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
										selectedCoin.increment_unit = Number(
											selectedCoin.increment_unit
										);
										selectedCoin.withdrawal_fee = Number(
											selectedCoin.withdrawal_fee
										);
										selectedCoin.withdrawal_limit = Number(
											selectedCoin.withdrawal_limit
										);
										selectedCoin.deposit_limit = Number(
											selectedCoin.deposit_limit
										);
										selectedCoin.mounthly_withdrawal_limit = Number(
											selectedCoin.mounthly_withdrawal_limit
										);

										await updateCoinConfiguration(selectedCoin);
										requesCoinConfiguration();
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
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(withConfig(CoinConfiguration));
