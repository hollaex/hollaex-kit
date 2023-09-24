import React, { useState, useEffect } from 'react';
import { Table, Button, Spin, Input } from 'antd';
import { requestStakersByAdmin } from './actions';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { ExclamationCircleFilled } from '@ant-design/icons';

const UserStaking = ({ coins }) => {
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

	const [userQuery, setUserQuery] = useState({ user_id: null });

	const statuses = {
		staking: 2,
		unstaking: 1,
		closed: 3,
	};

	const columns = [
		{
			title: 'User Id',
			dataIndex: 'user_id',
			key: 'user_id',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							{data?.user_id}
						</Button>
						{/* <div className="ml-3">{data.User.email}</div> */}
					</div>
				);
			},
		},
		{
			title: 'Asset',
			dataIndex: 'currency',
			key: 'currency',
			render: (user_id, data) => {
				return (
					<div className="d-flex">{data?.stake?.currency.toUpperCase()}</div>
				);
			},
		},
		{
			title: 'Pool name',
			dataIndex: 'name',
			key: 'name',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.stake?.name}</div>;
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
			title: 'End date / maturity',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data?.closing ? formatDate(data?.closing) : 'Perpetual'}
					</div>
				);
			},
		},
		{
			title: 'Slash',
			dataIndex: 'slash',
			key: 'slash',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data?.stake?.slashing ? <span>Active</span> : <span>NA</span>}
					</div>
				);
			},
		},
		{
			title: 'Principle',
			dataIndex: 'amount',
			key: 'amount',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data?.amount} {data?.stake?.currency?.toUpperCase()}{' '}
					</div>
				);
			},
		},
		{
			title: 'Earnings',
			dataIndex: 'reward',
			key: 'reward',
			render: (user_id, data) => {
				const incrementUnit = coins[data.currency].increment_unit;
				const decimalPoint = new BigNumber(incrementUnit).dp();
				const sourceAmount =
					data?.reward &&
					new BigNumber(data?.reward - data?.slashed)
						.decimalPlaces(decimalPoint)
						.toNumber();

				return (
					<div className="d-flex">
						{sourceAmount} {data?.stake?.currency?.toUpperCase()}
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
					<div className="d-flex">
						{data?.status === 'unstaking' ? (
							<span>
								<ExclamationCircleFilled style={{ color: 'red' }} />{' '}
								Unstaking...
							</span>
						) : data?.status === 'staking' ? (
							<span>Active</span>
						) : (
							<span>Closed</span>
						)}
					</div>
				);
			},
		},
	];

	useEffect(() => {
		// setIsLoading(true);
		requestExchangeStakers(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requestExchangeStakers(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const formatDate = (date) => {
		return moment(date).format('DD/MMM/YYYY, hh:mmA ').toUpperCase();
	};

	const requestExchangeStakers = (page = 1, limit = 50) => {
		setIsLoading(true);
		requestStakersByAdmin({ page, limit, ...queryValues })
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

	const accumulateStakeValue = (stakes) => {
		const res = Array.from(
			stakes.reduce(
				//eslint-disable-next-line
				(m, { currency, amount }) =>
					m.set(currency, (m.get(currency) || 0) + amount),
				new Map()
			),
			([currency, amount]) => ({ currency, amount })
		);

		return res;
	};

	const accumulateUnstakeValue = (stakes) => {
		const res = Array.from(
			stakes
				.filter((stake) => stake.status === 'unstaking')
				.reduce(
					//eslint-disable-next-line
					(m, { currency, amount }) =>
						m.set(currency, (m.get(currency) || 0) + amount),
					new Map()
				),
			([currency, amount]) => ({ currency, amount })
		);

		return res;
	};

	return (
		<div>
			<div style={{ color: 'white', fontWeight: 'bold' }}>
				User active stakes
			</div>
			<div style={{ color: '#ccc' }}>
				Track the users that are staking, and when their stake is maturing.
			</div>

			<div style={{ color: '#ccc', marginTop: 20 }}>
				<span style={{ fontWeight: 'bold', color: 'white' }}>Note:</span>{' '}
				Unstaking requires 1 day to settle. (an email will be sent to notify of
				any unstaking events) After settlement the user will automatically
				receive their initial stake amount (principle) and their earnings.
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
						<span>
							<div>Search user</div>
							<div style={{ display: 'flex', gap: 10 }}>
								<Input
									style={{}}
									placeholder="Search User ID"
									onChange={(e) => setUserQuery({ user_id: e.target.value })}
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
										marginRight: 10,
									}}
									type="default"
								>
									Refresh
								</Button>
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
								<span style={{ fontWeight: 'bold' }}>Total stakers:</span>{' '}
								{queryFilters.total} users
							</div>
							<div style={{ display: 'flex' }}>
								Appox. stake value:{' '}
								{accumulateStakeValue(userData).map((stake) => (
									<div>
										<span style={{ fontWeight: 'bold' }}></span> {stake.amount}{' '}
										{stake.currency.toUpperCase()}
									</div>
								))}
							</div>
							<div>-</div>
							<div>
								<div style={{ display: 'flex' }}>
									Value unstaking:{' '}
									{accumulateUnstakeValue(userData).map((stake) => (
										<div>
											<span style={{ fontWeight: 'bold' }}></span>{' '}
											{stake.amount}{' '}
											{(stake.reward_currency || stake.currency).toUpperCase()}
										</div>
									))}
								</div>
							</div>
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

					<div className="mt-4 ">
						<Spin spinning={isLoading}>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={userData.sort((a, b) => {
									return statuses[a.status] - statuses[b.status];
								})}
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

export default UserStaking;
