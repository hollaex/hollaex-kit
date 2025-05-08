import React, { useState, useEffect } from 'react';
import { message, Table, Button, Spin, Modal } from 'antd';
import {
	getExchangeSessions,
	getExchangeSessionsCsv,
	revokeSession,
} from './actions';
import { formatDate } from 'utils';
import { CloseOutlined } from '@ant-design/icons';
import SessionFilters from './SessionFilters';
import { COUNTRIES_OPTIONS } from '../../../utils/countries';

const SessionTable = () => {
	const [userData, setUserData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [queryValues, setQueryValues] = useState({ last_seen: '1h' });
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});

	const [displayRevokeModal, setDisplayRevokeModal] = useState(false);

	const [selectedSession, setSelectedSession] = useState();
	const columns = [
		{
			title: 'User Id',
			dataIndex: 'user_id',
			key: 'user_id',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							{data?.login?.user_id}
						</Button>
						{/* <div className="ml-3">{data.User.email}</div> */}
					</div>
				);
			},
		},
		{
			title: 'Last seen (Most recent first)',
			dataIndex: 'last_seen',
			key: 'last_seen',
			render: (user_id, data) => {
				return <div className="d-flex">{formatDate(data?.last_seen)}</div>;
			},
		},
		{
			title: 'Session started',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (user_id, data) => {
				return <div className="d-flex">{formatDate(data?.created_at)}</div>;
			},
		},
		{
			title: 'Session Expiry',
			dataIndex: 'expiry_date',
			key: 'expiry_date',
			render: (user_id, data) => {
				return <div className="d-flex">{formatDate(data?.expiry_date)}</div>;
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (user_id, data) => {
				let revokeStatus =
					new Date().getTime() < new Date(data?.expiry_date).getTime();
				if (data.status === false) revokeStatus = false;

				return (
					<div className="d-flex" style={{ gap: 20 }}>
						<div style={{ position: 'relative', top: 6, color: '#ccc' }}>
							{' '}
							{revokeStatus ? 'Active' : 'Expired'}
						</div>
						{revokeStatus && (
							<Button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedSession(data);
									setDisplayRevokeModal(true);
								}}
								className="ant-btn green-btn ant-tooltip-open ant-btn-primary"
							>
								Revoke
							</Button>
						)}
					</div>
				);
			},
		},
	];

	const fieldKeyValue = {
		last_seen: {
			type: 'dropdown',
			label: 'Time seen within',
			options: [
				{ label: 'None', value: -1 },
				{ label: 'Last 1 hour', value: '1h' },
				{ label: 'Last 24 hours', value: '24h' },
			],
		},
		status: {
			type: 'dropdown',
			label: 'Status',
			options: [
				{ label: 'None', value: -1 },
				{ label: 'Active', value: true },
				{ label: 'Expired', value: false },
			],
		},
	};

	const defaultFilters = [
		{
			field: 'status',
			type: 'dropdown',
			label: 'Status',
			value: null,
			options: [
				{ label: 'None', value: -1 },
				{ label: 'Active', value: true },
				{ label: 'Expired', value: false },
			],
		},
		{
			field: 'last_seen',
			type: 'dropdown',
			label: 'Time seen within',
			value: '1h',
			options: [
				{ label: 'None', value: -1 },
				{ label: 'Last 1 hour', value: '1h' },
				{ label: 'Last 24 hours', value: '24h' },
			],
		},
	];

	useEffect(() => {
		setIsLoading(true);
		requestSessions(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requestSessions(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const requestDownload = () => {
		return getExchangeSessionsCsv({ ...queryValues, format: 'csv' });
	};

	const renderRowContent = ({ login }) => {
		const filteredCountry = COUNTRIES_OPTIONS.find(
			(country) =>
				country?.value?.toLowerCase() === login?.country?.toLowerCase()
		);
		return (
			<div>
				<div className="d-flex">
					<span style={{ fontWeight: 'bold' }}>Country:</span>{' '}
					<span className="d-flex align-items-center ml-1">
						{filteredCountry && filteredCountry?.icon}
						<span className="ml-1">{filteredCountry?.label || '-'}</span>
					</span>
				</div>
				<div>
					<span style={{ fontWeight: 'bold' }}>IP Address:</span> {login?.ip}
				</div>
				<div>
					<span style={{ fontWeight: 'bold' }}>Device:</span> {login?.device}
				</div>
			</div>
		);
	};

	const requestSessions = (page = 1, limit = 50) => {
		setIsLoading(true);
		getExchangeSessions({ page, limit, ...queryValues })
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
			requestSessions(page + 1, limit);
		}
		setQueryFilters({ ...queryFilters, currentTablePage: count });
	};

	const handleSessionModal = () => {
		setDisplayRevokeModal(false);
		setSelectedSession();
	};

	return (
		<div>
			<div style={{ color: '#ccc' }}>
				Below are details of currently active user sessions. Revoking a session
				will log the user out from their account.
			</div>
			<div>
				<div style={{ marginTop: 20 }}>
					<SessionFilters
						applyFilters={(filters) => {
							setQueryValues(filters);
						}}
						fieldKeyValue={fieldKeyValue}
						defaultFilters={defaultFilters}
					/>
				</div>
				<div className="mt-5">
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span
							onClick={(e) => {
								requestDownload();
							}}
							className="mb-2 underline-text cursor-pointer"
							style={{ cursor: 'pointer' }}
						>
							Download below CSV table
						</span>
						<div>
							<span>
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
							</span>
							<span>Total: {queryFilters.total || '-'}</span>
						</div>
					</div>

					<div className="mt-4 ">
						<Spin spinning={isLoading}>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={userData}
								expandedRowRender={renderRowContent}
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

				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
					}}
					visible={displayRevokeModal}
					footer={null}
					onCancel={() => {
						handleSessionModal();
					}}
				>
					<div
						style={{
							fontWeight: '600',
							color: 'white',
							fontSize: 18,
							marginBottom: 20,
						}}
					>
						Revoke session
					</div>
					<div style={{ marginBottom: 30 }}>
						Are you sure you want to revoke this session?
					</div>
					<div style={{ marginBottom: 20 }}>This will log the user out.</div>
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
								handleSessionModal();
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
									const res = await revokeSession(selectedSession.id);
									setUserData((prevState) => {
										const newState = [...prevState];
										const Index = newState.findIndex(
											(session) => session.id === res.data.id
										);
										if (Index > 0) {
											newState[Index].status = false;
										}

										return newState;
									});
									message.success('Session revoked.');
									handleSessionModal();
								} catch (error) {
									message.error(error.message);
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
							Confirm
						</Button>
					</div>
				</Modal>
			</div>
		</div>
	);
};

export default SessionTable;
