import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { ClockCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Table, Button, Spin, Input, Modal, message, Select } from 'antd';
import { requestDisputes, editDispute } from './actions';
import moment from 'moment';
// import BigNumber from 'bignumber.js';
// import { ExclamationCircleFilled } from '@ant-design/icons';

const P2PDisputes = ({ coins }) => {
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
	const [resolution, setResolution] = useState();
	const [displayAdjudicate, setDisplayAdjudicate] = useState(false);
	const [selectedDispute, setSelectedDispute] = useState();
	const statuses = {
		staking: 2,
		unstaking: 1,
		closed: 3,
	};
	const [selectOption, setSelectOption] = useState('all');

	const columns = [
		{
			title: 'Initiator Id',
			dataIndex: 'initiator_id',
			key: 'initiator_id',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							<Link to={`/admin/user?id=${data?.initiator_id}`}>
								{data?.initiator_id}
							</Link>
						</Button>
					</div>
				);
			},
		},
		{
			title: 'Defendant Id',
			dataIndex: 'defendant_id',
			key: 'defendant_id',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							<Link to={`/admin/user?id=${data?.defendant_id}`}>
								{data?.defendant_id}
							</Link>
						</Button>
					</div>
				);
			},
		},
		{
			title: 'Transaction Id',
			dataIndex: 'transaction_id',
			key: 'transaction_id',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							{data?.transaction_id}
						</Button>
					</div>
				);
			},
		},
		{
			title: 'Reason',
			dataIndex: 'reason',
			key: 'reason',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data?.reason?.toUpperCase() || 'No reason specified'}
					</div>
				);
			},
		},
		{
			title: 'Resolution',
			dataIndex: 'resolution',
			key: 'resolution',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data?.resolution?.toUpperCase() || (
							<span>
								<span>Not adjudicated</span>
								<ClockCircleOutlined className="important-text ml-2 mt-2" />
							</span>
						)}
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

		{
			title: 'Action',
			dataIndex: '',
			key: '',
			render: (user_id, data) => {
				return !data.status ? (
					<div className="d-flex">Closed</div>
				) : (
					<div className="d-flex">
						<Button
							disabled={!data.status}
							style={{
								backgroundColor: '#288500',
								color: 'white',
							}}
							onClick={() => {
								setSelectedDispute(data);
								setDisplayAdjudicate(true);
							}}
						>
							Adjudicate
						</Button>
					</div>
				);
			},
		},
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
		requestDisputes({ page, limit, ...queryValues })
			.then((response) => {
				setUserData(
					page === 1 ? response.data : [...userData, ...response.data]
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

	const pageChange = (count, pageSize) => {
		const { page, limit, isRemaining } = queryFilters;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requestExchangeStakers(page + 1, limit);
		}
		setQueryFilters({ ...queryFilters, currentTablePage: count });
	};
	const filteredUserData = userData.filter((data) =>
		selectOption === 'resolved'
			? data?.resolution
			: selectOption === 'unresolved'
			? !data?.resolution
			: true
	);

	return (
		<div className="p2p-dispute-details-wrapper">
			<Modal
				maskClosable={false}
				closeIcon={<CloseOutlined style={{ color: 'white' }} />}
				bodyStyle={{
					backgroundColor: '#27339D',
					marginTop: 60,
				}}
				visible={displayAdjudicate}
				width={450}
				footer={null}
				onCancel={() => {
					setDisplayAdjudicate(false);
				}}
			>
				<h1 style={{ fontWeight: '600', color: 'white' }}>
					Resolve the dispute
				</h1>
				<div>Input resolution</div>
				<Input
					value={resolution}
					onChange={(e) => {
						setResolution(e.target.value);
					}}
					width={400}
				/>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 15,
						justifyContent: 'space-between',
						marginTop: 30,
					}}
				>
					<Button
						onClick={() => {
							setDisplayAdjudicate(false);
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
								await editDispute({
									id: selectedDispute.id,
									status: false,
									resolution,
								});
								requestExchangeStakers(queryFilters.page, queryFilters.limit);
								setDisplayAdjudicate(false);
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
						disabled={false}
					>
						OKAY
					</Button>
				</div>
			</Modal>
			<div style={{ color: 'white', fontWeight: 'bold' }}>P2p Disputes</div>
			<div style={{ color: '#ccc' }}>
				Track the users that have active disputes
			</div>

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
								<div>Search user</div>
								<div
									style={{ display: 'flex', gap: 10 }}
									className="align-items-center"
								>
									<Input
										style={{}}
										placeholder="Search User ID"
										className="resolution-filter-select"
										onChange={(e) => {
											setUserQuery({
												...(userQuery?.status && { status: userQuery.status }),
												...(e.target.value && { user_id: e.target.value }),
											});
										}}
										value={userQuery.user_id}
									/>
									<Select
										dropdownClassName="blue-admin-select-dropdown"
										getPopupContainer={(trigger) => trigger.parentNode}
										placeholder="Resolution"
										className="resolution-filter-select"
										value={selectOption}
										onChange={(e) => setSelectOption(e)}
									>
										<Select.Option value="all">All</Select.Option>
										<Select.Option value="resolved">Resolved</Select.Option>
										<Select.Option value="unresolved">Unresolved</Select.Option>
									</Select>
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
								<span style={{ fontWeight: 'bold' }}>Total disputes:</span>{' '}
								{queryFilters.total}
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
								dataSource={filteredUserData
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
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(P2PDisputes);
