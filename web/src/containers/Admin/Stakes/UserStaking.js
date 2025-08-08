import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { Table, Button, Spin, Input, Select } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import BigNumber from 'bignumber.js';

import { Coin } from 'components';
import {
	requestStakersByAdmin,
	requestStakePools,
	getStakingAnalytics,
} from './actions';
import { DEFAULT_COIN_DATA } from 'config/constants';

const UserStaking = ({
	coins,
	isUserProfileStakeTab = false,
	router,
	selectedUserId = null,
}) => {
	const [userData, setUserData] = useState([]);
	const [stakePools, setStakePools] = useState([{ id: '0', name: 'All' }]);
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

	const [stakingAnayltics, setStakingAnalytics] = useState({});

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
						<Button className="ant-btn green-btn no-border ant-tooltip-open ant-btn-primary">
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
				const { icon_id } = coins[data?.stake?.currency] || DEFAULT_COIN_DATA;
				return (
					<div className="d-flex">
						{icon_id && (
							<span className="mr-2">
								<Coin iconId={icon_id} type="CS7" />
							</span>
						)}
						{data?.stake?.currency?.toUpperCase()}
					</div>
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
				const incrementUnit =
					coins[data?.reward_currency || data?.currency]?.increment_unit;
				const decimalPoint = new BigNumber(incrementUnit)?.dp();
				const sourceAmount =
					data?.reward &&
					new BigNumber(data?.reward - data?.slashed)
						?.decimalPlaces(decimalPoint)
						?.toNumber();

				return (
					<div className="d-flex">
						{sourceAmount}{' '}
						{(
							data?.stake?.reward_currency || data?.stake?.currency
						)?.toUpperCase()}
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
								<ExclamationCircleFilled className="stake-warning-icon" />{' '}
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
		// requestExchangeStakers(queryFilters.page, queryFilters.limit);
		requestStakePools()
			.then((res) => {
				setStakePools((prev) => [...prev, ...(res?.data || [])]);
				if (res?.data?.length > 0) {
					setQueryValues({ ...queryValues, stake_id: stakePools[0]?.id });
				}
			})
			.catch((err) => err);
		getStakingAnalytics().then((res) => {
			setStakingAnalytics(res?.data);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requestExchangeStakers(queryFilters?.page, queryFilters?.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const formatDate = (date) => {
		return moment(date).format('DD/MMM/YYYY, hh:mmA ').toUpperCase();
	};

	const requestExchangeStakers = (page = 1, limit = 50) => {
		let requestQueryValues = {};
		if (!queryValues?.user_id && !queryValues?.stake_id) return;
		setIsLoading(true);
		if (isUserProfileStakeTab && selectedUserId) {
			requestQueryValues = {
				user_id: String(selectedUserId),
				...(queryValues?.stake_id !== '0' && queryValues),
			};
		} else {
			const { stake_id, user_id } = queryValues || {};
			if (stake_id === '0') {
				requestQueryValues = user_id ? { user_id } : {};
			} else {
				requestQueryValues = user_id === '' ? { stake_id } : { ...queryValues };
			}
		}
		requestStakersByAdmin({ page, limit, ...requestQueryValues })
			.then((response) => {
				setUserData(
					page === 1 ? response?.data : [...userData, ...response?.data]
				);

				setQueryFilters({
					total: response?.count,
					fetched: true,
					page,
					currentTablePage: page === 1 ? 1 : queryFilters?.currentTablePage,
					isRemaining: response?.count > page * limit,
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

	// const accumulateStakeValue = (stakes) => {
	// 	const res = Array.from(
	// 		stakes.reduce(
	// 			//eslint-disable-next-line
	// 			(m, { currency, amount }) =>
	// 				m.set(currency, (m.get(currency) || 0) + amount),
	// 			new Map()
	// 		),
	// 		([currency, amount]) => ({ currency, amount })
	// 	);

	// 	return res;
	// };

	// const accumulateUnstakeValue = (stakes) => {
	// 	const res = Array.from(
	// 		stakes
	// 			.filter((stake) => stake.status === 'unstaking')
	// 			.reduce(
	// 				//eslint-disable-next-line
	// 				(m, { currency, amount }) =>
	// 					m.set(currency, (m.get(currency) || 0) + amount),
	// 				new Map()
	// 			),
	// 		([currency, amount]) => ({ currency, amount })
	// 	);

	// 	return res;
	// };

	return (
		<div className="admin-users-stake-wrapper">
			{!isUserProfileStakeTab && (
				<>
					<div className="bold">User active stakes</div>
					<div className="stake-section-description">
						Track the users that are staking, and when their stake is maturing.
					</div>

					<div className="stake-guideline mt-4">
						<span className="bold text-white">Note:</span> Unstaking requires 1
						day to settle. (an email will be sent to notify of any unstaking
						events) After settlement the user will automatically receive their
						initial stake amount (principle) and their earnings.
					</div>
				</>
			)}
			<div>
				<div>
					{/* <SessionFilters
						applyFilters={(filters) => {
							setQueryValues(filters);
						}}
						fieldKeyValue={fieldKeyValue}
						defaultFilters={defaultFilters}
					/> */}
				</div>
				<div className={`${!isUserProfileStakeTab && 'mt-5'}`}>
					<div className="stake-filter-wrapper d-flex justify-content-between">
						{/* <span
							onClick={(e) => {
								requestDownload();
							}}
							className="mb-2 underline-text cursor-pointer"
							style={{ cursor: 'pointer' }}
						>
							Search user
						</span> */}
						<span className="stake-filter-container d-flex flex-row">
							{!isUserProfileStakeTab && (
								<div>
									<div>Search user</div>
									<div className="pt-2 user-search-field d-flex">
										<Input
											placeholder="Search User ID"
											onChange={(e) => {
												setUserQuery({
													...(userQuery?.status && {
														status: userQuery?.status,
													}),
													...{ user_id: e.target?.value },
												});
											}}
											value={userQuery?.user_id?.trim()}
											className="no-border"
										/>
										<Button
											onClick={() => {
												setQueryValues((prev) => ({
													...prev,
													...(userQuery || {}),
												}));
											}}
											type="default"
											className="apply-btn no-border"
										>
											Apply
										</Button>
									</div>
								</div>
							)}
							<div
								className={`${
									isUserProfileStakeTab
										? 'd-flex flex-column staking-pool-filter-container'
										: 'staking-pool-filter-container'
								}`}
							>
								{isUserProfileStakeTab && (
									<div className="d-flex flex-column stake-summary-message">
										<span className="bold">Active/closed stakes</span>
										<span>Below are the user's active and closes stakes.</span>
										<span>
											To view all pools and user view the main{' '}
											<span
												className="underline-text pointer"
												onClick={() => router.push(`admin/stakes?user-staking`)}
											>
												Stakes page.
											</span>
										</span>
									</div>
								)}
								<span>
									<div>Filter by Staking Pools</div>
									<div className="pt-2">
										<Select
											showSearch
											className="select-box"
											dropdownClassName="stake-pool-filter-dropdown"
											value={queryValues?.stake_id}
											placeholder="Select Staking Pool"
											onChange={(e) => {
												setQueryValues((prev) => ({
													...(prev?.user_id !== '' && prev),
													stake_id: e,
												}));
											}}
											filterOption={(input, option) =>
												option?.props?.children
													?.toLowerCase()
													?.includes(input?.toLowerCase())
											}
											getPopupContainer={(triggerNode) =>
												triggerNode.parentNode
											}
										>
											{stakePools.map((stakePool) => (
												<Select.Option
													key={stakePool?.name}
													value={stakePool?.id}
												>
													{stakePool?.name}
												</Select.Option>
											))}
										</Select>
									</div>
								</span>
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
								<span className="bold">Total stakes:</span>{' '}
								{queryFilters?.total} stakes
							</div>
							<div className="d-flex flex-column">
								Appox. stake value:{' '}
								{stakingAnayltics?.stakingAmount?.map((stake) => {
									const incrementUnit = coins[stake?.currency]?.increment_unit;
									const decimalPoint = new BigNumber(incrementUnit)?.dp();
									const sourceAmount = new BigNumber(stake?.total_amount)
										?.decimalPlaces(decimalPoint)
										?.toNumber();

									return (
										<div>
											<span className="bold"></span> {sourceAmount}{' '}
											{stake?.currency?.toUpperCase()}
										</div>
									);
								})}
							</div>
							<div>-</div>
							<div>
								<div className="d-flex flex-column">
									Value unstaking:{' '}
									{stakingAnayltics?.unstakingAmount?.map((stake) => {
										const incrementUnit =
											coins[stake?.currency]?.increment_unit;
										const decimalPoint = new BigNumber(incrementUnit)?.dp();
										const sourceAmount = new BigNumber(stake?.total_amount)
											?.decimalPlaces(decimalPoint)
											?.toNumber();
										return (
											<div>
												<span className="bold"></span> {sourceAmount}{' '}
												{stake?.currency?.toUpperCase()}
											</div>
										);
									})}
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

					<div className="mt-4 session-table">
						<Spin spinning={isLoading}>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={
									userData.sort((a, b) => {
										return statuses[a?.status] - statuses[b?.status];
									})
									// .filter((x) =>
									// 	userQuery?.status === 'closed'
									// 		? x.status === 'closed'
									// 		: x.status !== 'closed'
									// )
								}
								// expandedRowRender={renderRowContent}
								expandRowByClick={true}
								rowKey={(data) => {
									return data?.id;
								}}
								pagination={{
									current: queryFilters?.currentTablePage,
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

export default withRouter(UserStaking);
