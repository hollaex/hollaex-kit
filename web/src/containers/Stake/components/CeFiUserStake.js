import React, { useState, useEffect } from 'react';

import {
	Button as AntBtn,
	Tabs,
	Modal,
	Input,
	Spin,
	Table,
	message,
	Progress,
} from 'antd';

import { CloseOutlined } from '@ant-design/icons';
import {
	requestUserStakePools,
	createStaker,
	requestStakers,
	deleteStaker,
	getSlashEstimate,
} from 'containers/Admin/Stakes/actions';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router';
import STRINGS from 'config/localizedStrings';
import '../CeFiStake.scss';
import { NotLoggedIn } from 'components';

const TabPane = Tabs.TabPane;

const CeFiUserStake = ({ balance, coins, theme }) => {
	const [activeTab, setActiveTab] = useState('0');

	const [readBeforeAction, setReadBeforeAction] = useState(false);
	const [stakeAmount, setStakeAmount] = useState(false);
	const [duration, setDuration] = useState(false);
	const [stakeDetails, setStakeDetails] = useState(false);
	const [confirmStake, setConfirmStake] = useState(false);
	const [confirmation, setConfirmation] = useState(false);
	const [reviewUnstake, setReviewUnstake] = useState(false);
	const [unstakeConfirm, setUnstakeConfirm] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [userStakeData, setUserStakeData] = useState([]);
	const [stakePools, setStakePools] = useState([]);
	const [selectedPool, setSelectedPool] = useState();
	const [confirmText, setConfirmText] = useState();
	const [stakerAmount, setStakerAmount] = useState();
	const [selectedStaker, setSelectedStaker] = useState();
	const [queryValues] = useState();
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});

	const columns = [
		{
			title: 'POOL',
			dataIndex: 'name',
			key: 'name',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.stake?.name}</div>;
			},
		},
		{
			title: 'AMOUNT',
			dataIndex: 'amount',
			key: 'amount',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data?.amount} {data?.currency.toUpperCase()}
					</div>
				);
			},
		},
		{
			title: 'RATE',
			dataIndex: 'apy',
			key: 'apy',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.stake?.apy}%</div>;
			},
		},
		{
			title: 'DURATION',
			dataIndex: 'duration',
			key: 'duration',
			render: (_user_id, data) => {
				return (
					<div className="d-flex">
						{data?.stake?.duration ? (
							<span
								style={{
									display: 'flex',
									flexDirection: 'row',
									width: 120,
									gap: 10,
								}}
							>
								<div style={{ flex: 1 }}>
									<Progress
										percent={
											((data?.stake?.duration -
												calculateRemainingDays(
													data?.stake?.duration,
													data?.created_at
												)) *
												100) /
											data?.stake?.duration
										}
										showInfo={false}
									/>
								</div>
								<div style={{ flex: 1 }}>{data?.stake?.duration} days</div>
							</span>
						) : (
							'∞ Perpetual'
						)}{' '}
					</div>
				);
			},
		},
		{
			title: 'STARTED',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (_user_id, data) => {
				return <div className="d-flex">{formatDate(data?.created_at)}</div>;
			},
		},
		{
			title: 'END',
			dataIndex: 'expiry_date',
			key: 'expiry_date',
			render: (_user_id, data) => {
				return (
					<div className="d-flex">
						{data?.closing ? formatDate(data?.closing) : '∞ Perpetual'}
					</div>
				);
			},
		},
		{
			title: 'EARNT',
			dataIndex: 'earnt',
			key: 'earnt',
			render: (_user_id, data) => {
				const incrementUnit =
					coins[data.reward_currency || data.currency].increment_unit;
				const decimalPoint = new BigNumber(incrementUnit).dp();
				const sourceAmount =
					data?.reward &&
					new BigNumber(data?.reward - data?.slashed)
						.decimalPlaces(decimalPoint)
						.toNumber();

				return (
					<div className="d-flex">
						{sourceAmount}{' '}
						{(data?.reward_currency || data?.currency).toUpperCase()}
					</div>
				);
			},
		},
		{
			title: 'Stake',
			dataIndex: 'status',
			key: 'status',
			render: (_user_id, data) => {
				return (
					<div className="d-flex" style={{ gap: 20 }}>
						{data.status === 'unstaking' ? (
							<span style={{ color: '#FF9900', fontWeight: 'bold' }}>
								UNSTAKING...
							</span>
						) : data.status === 'closed' ? (
							'UNSTAKED'
						) : (
							<AntBtn
								disabled={
									data.stake.duration
										? data.stake.early_unstake
											? false
											: isUnstackable(data.stake, data.created_at) < 0
											? true
											: false
										: false
								}
								onClick={async () => {
									try {
										const slashedEstimate = await getSlashEstimate(data.id);
										data.slashedValues = slashedEstimate;
										setSelectedStaker(data);
										setReviewUnstake(true);
									} catch (error) {
										message.error(error.response.data.message);
									}
								}}
								style={{
									backgroundColor: '#5D63FF',
								}}
								className="ant-btn green-btn ant-tooltip-open ant-btn-primary stake_theme"
							>
								{data.stake.early_unstake &&
								calculateRemainingDays(data?.stake?.duration, data.created_at)
									? 'UNSTAKE EARLY'
									: 'UNSTAKE'}
							</AntBtn>
						)}
					</div>
				);
			},
		},
	];

	useEffect(() => {
		requestUserStakePools()
			.then((res) => {
				setStakePools(res.data);
			})
			.catch((err) => {
				return err;
			});

		requestExchangeStakers();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requestExchangeStakers(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const requestExchangeStakers = (page = 1, limit = 50) => {
		setIsLoading(true);
		// requestStakers({ page, limit, ...queryValues })
		requestStakers({ ...queryValues })
			.then((response) => {
				setUserStakeData(
					page === 1 ? response.data : [...userStakeData, ...response.data]
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
	// 		requestExchangeStakers(page + 1, limit);
	// 	}
	// 	setQueryFilters({ ...queryFilters, currentTablePage: count });
	// };

	const formatDate = (date) => {
		return moment(date).format('DD/MMM/YYYY').toUpperCase();
	};

	const isUnstackable = (stakePool, createdAt) => {
		const startingDate = moment(createdAt);
		const now = moment();
		const numberOfDaysPassed = now.diff(startingDate, 'days');

		const isUnstacklable = numberOfDaysPassed - stakePool.duration;
		return isUnstacklable;
	};

	const roundToIncrementUnit = (number, currency) => {
		const incrementUnit = coins[currency].increment_unit;
		const decimalPoint = new BigNumber(incrementUnit).dp();

		return new BigNumber(number).decimalPlaces(decimalPoint).toNumber();
	};

	const readBeforeActionModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={readBeforeAction}
					width={800}
					footer={null}
					onCancel={() => {
						setReadBeforeAction(false);
					}}
				>
					<div style={{ display: 'flex', gap: 30 }}>
						<div
							style={{
								flex: 1,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								backgroundImage: 'url(/assets/images/staking_3.png)',
								backgroundSize: 'cover',
							}}
						>
							<h1 className="stake_theme">Staking 101</h1>
						</div>
						<div style={{ flex: 1 }}>
							<h4
								className="stake_theme"
								style={{
									fontWeight: 'bold',
								}}
							>
								{STRINGS['CEFI_STAKE.READ_BEFORE_AGREE_AND_EARN']}
							</h4>
							<div className="stake_theme">
								{STRINGS['CEFI_STAKE.AGREEMENT_INTRODUCTION_1']}{' '}
								<span style={{ fontWeight: 'bold' }}>
									{STRINGS['CEFI_STAKE.AGREEMENT_INTRODUCTION_2']}
								</span>{' '}
								{STRINGS['CEFI_STAKE.AGREEMENT_INTRODUCTION_3']}
							</div>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<AntBtn
							onClick={() => {
								setReadBeforeAction(false);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.BACK_BUTTON']}
						</AntBtn>
						<AntBtn
							onClick={async () => {
								setReadBeforeAction(false);
								setStakeAmount(true);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.I_UNDERSTAND_BUTTON']}
						</AntBtn>
					</div>
				</Modal>
			</>
		);
	};

	const stakeAmountModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={stakeAmount}
					width={400}
					footer={null}
					onCancel={() => {
						setStakeAmount(false);
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div
							className="stake_theme"
							style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
								alignItems: 'center',
								height: 200,
								backgroundImage: 'url(/assets/images/staking_2.png)',
								backgroundSize: 'cover',
								width: '100%',
								marginBottom: 10,
							}}
						>
							<h3 className="stake_theme">{selectedPool.name}</h3>
							<div>-</div>
							<div>APY: {selectedPool.apy}%</div>
						</div>
						<div
							className="stake_theme"
							style={{
								width: '100%',
							}}
						>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									{selectedPool.currency.toUpperCase()} available:
								</span>{' '}
								{balance[`${selectedPool.currency}_available`]}
							</div>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									{STRINGS['CEFI_STAKE.AMOUNT_TO_STAKE_LABEL']}:
								</span>
							</div>
							<div style={{ marginTop: 5 }}>
								<Input
									className="stake_theme"
									style={{
										backgroundColor: 'rgba(0,0,0,0.1)',
									}}
									placeholder="Input amount"
									onChange={(e) => {
										setStakerAmount(e.target.value);
									}}
									value={stakerAmount}
								/>
							</div>
							{/* <div style={{ color: '#FF0000', marginTop: 10 }}>
								Staking pool's maximum amount allowed is 1,000 ABC
							</div> */}
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<AntBtn
							onClick={() => {
								setReadBeforeAction(true);
								setStakeAmount(false);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.BACK_BUTTON']}
						</AntBtn>
						<AntBtn
							onClick={async () => {
								if (stakerAmount < selectedPool.min_amount) {
									message.error(
										`Staking pool's minimum amount allowed is ${
											selectedPool.min_amount
										} ${selectedPool.currency.toUpperCase()}`
									);
									return;
								}

								if (stakerAmount > selectedPool.max_amount) {
									message.error(
										`Staking pool's maximum amount allowed is ${
											selectedPool.max_amount
										} ${selectedPool.currency.toUpperCase()} `
									);
									return;
								}

								setStakeAmount(false);
								setDuration(true);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
							disabled={!stakerAmount}
						>
							{STRINGS['CEFI_STAKE.NEXT_BUTTON']}
						</AntBtn>
					</div>
				</Modal>
			</>
		);
	};

	const durationModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={duration}
					width={420}
					footer={null}
					onCancel={() => {
						setDuration(false);
					}}
				>
					<div>
						<h1 className="stake_theme">
							{STRINGS['CEFI_STAKE.DURATION_LABEL']}
						</h1>
						<div>
							{STRINGS['CEFI_STAKE.LOCKUP_DURATION_LABEL']}:{' '}
							{selectedPool.duration
								? `${selectedPool.duration} days`
								: 'Perpetual'}
						</div>
						<div>-</div>

						{selectedPool.slashing && (
							<>
								<h4 className="stake_theme">Slashing</h4>
								<div>
									{
										STRINGS[
											'CEFI_STAKE.PENALTY_UPON_INITIAL_STAKE_PRINCIPLE_LABEL'
										]
									}
									: -{selectedPool.slashing_principle_percentage}%{' '}
								</div>
								<div>
									{STRINGS['CEFI_STAKE.FORFEITURE_OF_EARNINGS_LABEL']}: -
									{selectedPool.slashing_earning_percentage}%
								</div>
							</>
						)}

						{selectedPool.slashing && (
							<div
								style={{
									padding: 20,
									backgroundColor: '#FF0000',
									marginTop: 20,
									fontSize: 12,
								}}
							>
								<div>{STRINGS['CEFI_STAKE.SLASHING_RULES_ENFORCED_LABEL']}</div>
								<div>{STRINGS['CEFI_STAKE.SLASHING_RULES_NOTICE']}</div>
							</div>
						)}

						{!selectedPool.duration && (
							<div
								style={{
									padding: 20,
									backgroundColor: '#388200',
									marginTop: 20,
									fontSize: 12,
								}}
							>
								<div>{STRINGS['CEFI_STAKE.UNSTAKE_ANYTIME_LABEL']}</div>
							</div>
						)}

						{selectedPool.duration && !selectedPool.early_unstake ? (
							<div
								style={{
									padding: 20,
									backgroundColor: '#FF6F00',
									marginTop: 20,
									fontSize: 12,
								}}
							>
								<div>{STRINGS['CEFI_STAKE.FULL_DURATION_LOCK_LABEL']}</div>
							</div>
						) : (
							<></>
						)}
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<AntBtn
							onClick={() => {
								setStakeAmount(true);
								setDuration(false);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.BACK_BUTTON']}
						</AntBtn>
						<AntBtn
							onClick={async () => {
								setDuration(false);
								setStakeDetails(true);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.PROCEED_BUTTON']}
						</AntBtn>
					</div>
				</Modal>
			</>
		);
	};

	const stakeDetailsModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={stakeDetails}
					width={450}
					footer={null}
					onCancel={() => {
						setStakeDetails(false);
					}}
				>
					<div>
						<h1 className="stake_theme">
							{STRINGS['CEFI_STAKE.CHECK_STAKE_DETAILS_BUTTON']}
						</h1>
						<div>
							{STRINGS['CEFI_STAKE.STAKING_POOL_LABEL']}: {selectedPool.name}
						</div>
						<div>
							{STRINGS['CEFI_STAKE.ANNUAL_PERCENTAGE_YIELD_LABEL']}:{' '}
							{selectedPool.apy}% APY
						</div>
						<div>
							{STRINGS['CEFI_STAKE.DURATION_LABEL']}: {selectedPool.duration}{' '}
							days{' '}
						</div>
						<div>
							{STRINGS['CEFI_STAKE.PENALTY_UPON_INITIAL_STAKE_PRINCIPLE_LABEL']}
							: -{selectedPool.slashing_principle_percentage}%
						</div>
						<div>
							{STRINGS['CEFI_STAKE.FORFEITURE_OF_EARNINGS_DETAILS_LABEL']}: -
							{selectedPool.slashing_earning_percentage}%
						</div>

						<div style={{ marginTop: 20 }}>
							{STRINGS['CEFI_STAKE.STAKE_AMOUNT_LABEL']}: {stakerAmount}{' '}
							{selectedPool.currency.toUpperCase()}
						</div>
						<hr />

						<div style={{ marginTop: 20, marginBottom: 10 }}>
							{selectedPool.disclaimer}
						</div>
						<div>{STRINGS['CEFI_STAKE.SETTLEMENT_NOTICE']}</div>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<AntBtn
							onClick={() => {
								setDuration(true);
								setStakeDetails(false);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.BACK_BUTTON']}
						</AntBtn>
						<AntBtn
							onClick={async () => {
								setStakeDetails(false);
								setConfirmStake(true);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.PROCEED_BUTTON']}
						</AntBtn>
					</div>
				</Modal>
			</>
		);
	};

	const confirmStakeModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={confirmStake}
					width={400}
					footer={null}
					onCancel={() => {
						setConfirmStake(false);
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
								alignItems: 'center',
								height: 200,
								backgroundImage: 'url(/assets/images/staking_1.png)',
								backgroundSize: 'cover',
								width: '100%',
								marginBottom: 20,
							}}
						>
							<h3 className="stake_theme">
								{STRINGS['CEFI_STAKE.CONFIRM_BUTTON']}{' '}
								{selectedPool.currency.toUpperCase()} Stake
							</h3>
						</div>
						<div style={{ width: '100%' }}>
							<div>
								<span style={{ fontWeight: 'bold', marginTop: 20 }}>
									Here we go!{' '}
								</span>
							</div>
							<div>{STRINGS['CEFI_STAKE.STAKE_RULES_NOTICE']}</div>
							<div style={{ marginTop: 30 }}> Do you understand?</div>
							<div style={{ marginTop: 5 }}>
								<Input
									className="stake_theme"
									style={{
										backgroundColor: 'rgba(0,0,0,0.1)',
									}}
									placeholder="Type 'I UNDERSTAND'"
									onChange={(e) => setConfirmText(e.target.value)}
									value={confirmText}
								/>
							</div>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<AntBtn
							onClick={() => {
								setStakeDetails(true);
								setConfirmStake(false);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.BACK_BUTTON']}
						</AntBtn>
						<AntBtn
							onClick={async () => {
								try {
									await createStaker({
										stake_id: selectedPool.id,
										amount: Number(stakerAmount),
									});
									message.success(`Successfuly staked in ${selectedPool.name}`);
								} catch (error) {
									message.error(error.response.data.message);
									return;
								}

								const stakes = await requestUserStakePools();
								setStakePools(stakes.data);

								requestExchangeStakers();
								setConfirmText();
								setStakerAmount();
								setConfirmStake(false);

								setConfirmation(false);
								setStakeDetails(false);
								setDuration(false);
								setStakeAmount(false);
								setReadBeforeAction(false);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
								opacity: confirmText !== 'I UNDERSTAND' ? 0.4 : 1,
							}}
							disabled={confirmText !== 'I UNDERSTAND'}
							type="default"
						>
							I UNDERSTAND, STAKE
						</AntBtn>
					</div>
				</Modal>
			</>
		);
	};

	const confirmationModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={confirmation}
					width={450}
					footer={null}
					onCancel={() => {
						setConfirmation(false);
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<h3 className="stake_theme">
								{stakerAmount} {selectedPool.currency.toUpperCase()}
							</h3>
							<div>Successfully staked</div>
							<div style={{ marginTop: 30, marginBottom: 30 }}>-</div>
							<div style={{ fontSize: 12, fontWeight: 'bold' }}>
								{STRINGS['CEFI_STAKE.CONGRATULATIONS_NOTICE']}
							</div>
							<div style={{ fontSize: 12 }}>
								{STRINGS['CEFI_STAKE.EARNINGS_START_NOTICE']}
							</div>
							<div style={{ fontSize: 12 }}>
								{' '}
								{STRINGS['CEFI_STAKE.REVIEW_PROGRESS_LABEL']}
							</div>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<AntBtn
							onClick={() => {
								setConfirmation(false);
								setStakerAmount();
								setSelectedPool();
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.CLOSE_BUTTON']}
						</AntBtn>
						<AntBtn
							onClick={async () => {
								setConfirmation(false);
								handleTabChange('1');
								setStakerAmount();
								setSelectedPool();
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							VIEW ACTIVE STAKES
						</AntBtn>
					</div>
				</Modal>
			</>
		);
	};

	const reviewUnstakeModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={reviewUnstake}
					width={400}
					footer={null}
					onCancel={() => {
						setReviewUnstake(false);
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
								height: 200,
							}}
						>
							<h3 className="stake_theme">Review and unstake</h3>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									{STRINGS['CEFI_STAKE.TIME_REMAINING_LABEL']}:
								</span>{' '}
								{selectedStaker?.stake?.duration ? (
									<>
										{calculateRemainingDays(
											selectedStaker?.stake?.duration,
											selectedStaker.created_at
										)}{' '}
										days (
										{selectedStaker?.stake?.duration &&
											formatDate(selectedStaker?.closing)}
										)
									</>
								) : (
									'Perpetual'
								)}
							</div>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									{STRINGS['CEFI_STAKE.PENALTY_UPON_INITIAL_STAKE_PRINCIPLE']}:
								</span>{' '}
								{roundToIncrementUnit(
									selectedStaker.slashedValues.slashingPrinciple,
									selectedStaker.currency
								)}{' '}
								{selectedStaker.currency.toUpperCase()} (-
								{selectedStaker?.stake?.slashing_principle_percentage
									? `${selectedStaker?.stake?.slashing_principle_percentage}%`
									: '-'}
								)
							</div>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									{STRINGS['CEFI_STAKE.FORFEITURE_OF_EARNINGS_LABEL']}:
								</span>{' '}
								{roundToIncrementUnit(
									selectedStaker.slashedValues.slashingEarning,
									selectedStaker.reward_currency || selectedStaker.currency
								)}{' '}
								{(
									selectedStaker.reward_currency || selectedStaker.currency
								).toUpperCase()}{' '}
								(-
								{selectedStaker?.stake?.slashing_earning_percentage
									? `${selectedStaker?.stake?.slashing_earning_percentage}%`
									: '-'}
								)
							</div>

							<div style={{ marginTop: 20 }}>
								<span style={{ fontWeight: 'bold' }}>
									{selectedStaker.reward_currency && 'Reward'}{' '}
									{STRINGS['CEFI_STAKE.AMOUNT_TO_RECEIVE_LABEL']}:
								</span>{' '}
								{selectedStaker.reward_currency
									? selectedStaker.reward > 0
										? `${roundToIncrementUnit(
												new BigNumber(selectedStaker.reward)
													.minus(
														new BigNumber(
															selectedStaker.slashedValues.slashingEarning
														)
													)
													.toNumber(),
												selectedStaker.reward_currency
										  )} ${selectedStaker.reward_currency.toUpperCase()}`
										: 'No reward amount to receive'
									: `${new BigNumber(selectedStaker.amount)
											.minus(
												new BigNumber(
													selectedStaker.slashedValues.slashingPrinciple
												)
											)
											.plus(
												new BigNumber(selectedStaker.reward).minus(
													new BigNumber(
														selectedStaker.slashedValues.slashingEarning
													)
												)
											)
											.toNumber()} ${selectedStaker.currency.toUpperCase()}`}
							</div>
							<div>({STRINGS['CEFI_STAKE.REQUIRES_24H_TO_SETTLE_NOTICE']})</div>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<AntBtn
							onClick={() => {
								setReviewUnstake(false);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Cancel
						</AntBtn>
						<AntBtn
							onClick={async () => {
								try {
									await deleteStaker({ id: selectedStaker.id });

									requestExchangeStakers();

									const stakes = await requestUserStakePools();
									setStakePools(stakes.data);

									// message.success(
									// 	`Successfuly unstaked in ${selectedStaker.id}`
									// );
								} catch (error) {
									message.error(error.response.data.message);
									return;
								}

								setReviewUnstake(false);
								setUnstakeConfirm(true);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							UNSTAKE
						</AntBtn>
					</div>
				</Modal>
			</>
		);
	};

	const unstakeConfirmModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={unstakeConfirm}
					width={400}
					footer={null}
					onCancel={() => {
						setUnstakeConfirm(false);
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
								height: 200,
							}}
						>
							<h2 className="stake_theme">
								You've successfully unstaked{' '}
								{selectedStaker.currency.toUpperCase()}
							</h2>
							<div style={{ marginTop: 20 }}>
								<span style={{ fontWeight: 'bold' }}>
									{selectedStaker.reward_currency && 'Reward'}{' '}
									{STRINGS['CEFI_STAKE.AMOUNT_TO_RECEIVE_LABEL']}:
								</span>{' '}
								{selectedStaker.reward_currency
									? selectedStaker.reward > 0
										? `${roundToIncrementUnit(
												new BigNumber(selectedStaker.reward)
													.minus(
														new BigNumber(
															selectedStaker.slashedValues.slashingEarning
														)
													)
													.toNumber(),
												selectedStaker.reward_currency
										  )} ${selectedStaker.reward_currency.toUpperCase()}`
										: 'No reward amount to receive'
									: `${new BigNumber(selectedStaker.amount)
											.minus(
												new BigNumber(
													selectedStaker.slashedValues.slashingPrinciple
												)
											)
											.plus(
												new BigNumber(selectedStaker.reward).minus(
													new BigNumber(
														selectedStaker.slashedValues.slashingEarning
													)
												)
											)
											.toNumber()} ${selectedStaker.currency.toUpperCase()}`}
							</div>
							<div>({STRINGS['CEFI_STAKE.REQUIRES_24H_TO_SETTLE_NOTICE']})</div>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<AntBtn
							onClick={() => {
								setUnstakeConfirm(false);
								setSelectedStaker();
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.CLOSE_BUTTON']}
						</AntBtn>
						<AntBtn
							onClick={async () => {
								setUnstakeConfirm(false);
								setSelectedStaker();
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							<Link to="/wallet">
								{STRINGS['CEFI_STAKE.VISIT_WALLET_BUTTON']}
							</Link>
						</AntBtn>
					</div>
				</Modal>
			</>
		);
	};

	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	const accumulateAmount = (stakes) => {
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

	const accumulateReward = (stakes) => {
		const res = Array.from(
			stakes.reduce(
				//eslint-disable-next-line
				(m, { currency, reward_currency, reward, slashed }) =>
					m.set(
						reward_currency || currency,
						(m.get(reward_currency || currency) || 0) + (reward - slashed)
					),
				new Map()
			),
			([currency, reward]) => ({ currency, reward })
		);

		return res;
	};

	const calculateRemainingDays = (duration, createdAt) => {
		const startingDate = moment(createdAt);
		const stakinDays = moment().diff(startingDate, 'days');
		const remaininDays = duration - stakinDays;

		return remaininDays;
	};

	return (
		<div>
			{readBeforeAction && readBeforeActionModel()}
			{stakeAmount && stakeAmountModel()}
			{duration && durationModel()}
			{stakeDetails && stakeDetailsModel()}
			{confirmStake && confirmStakeModel()}
			{confirmation && confirmationModel()}
			{reviewUnstake && reviewUnstakeModel()}
			{unstakeConfirm && unstakeConfirmModel()}

			<NotLoggedIn>
				<Tabs
					defaultActiveKey="0"
					activeKey={activeTab}
					onChange={handleTabChange}
				>
					<TabPane tab="POOLS" key="0">
						<div
							className="stake_table_theme"
							style={{
								width: '100%',
								padding: 30,
							}}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									marginBottom: 50,
								}}
							>
								<div style={{ flex: 1 }}>
									<div
										className="stake_theme"
										style={{
											fontWeight: 'bold',
										}}
									>
										{STRINGS['CEFI_STAKE.STAKE_POOL_TITLE']}
									</div>
									<div style={{}}>{STRINGS['CEFI_STAKE.INTRODUCTION_1']}</div>
								</div>
								<div
									style={{
										flex: 1,
										display: 'flex',
										justifyContent: 'flex-end',
									}}
								>
									<div>
										{userStakeData?.length > 0 && (
											<div>{STRINGS['CEFI_STAKE.CURRENT_STAKING_VALUE']}:</div>
										)}
										<div>
											{accumulateAmount(userStakeData).map((stake) => (
												<div>
													{stake.currency.toUpperCase()}: {stake.amount}
												</div>
											))}
										</div>
									</div>
								</div>
							</div>

							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									gap: 15,
									flexWrap: 'wrap',
								}}
							>
								{stakePools
									.filter((pool) => pool.status === 'active' && pool.onboarding)
									.map((pool) => {
										// const alreadyStaked =
										// 	(userStakeData || [])?.filter(
										// 		(staker) =>
										// 			staker.stake_id == pool.id && staker.status !== 'closed'
										// 	)?.length > 0;

										const alreadyStaked = false;

										return (
											<div
												className="stakepool_card"
												style={{
													width: 330,
													height: 300,
													padding: 20,
													display: 'flex',
													justifyContent: 'center',
													flexDirection: 'column',
													alignItems: 'center',
													borderTop: '1px solid #E19F23',
												}}
											>
												<div style={{ position: 'relative', bottom: 40 }}>
													<img
														src={coins?.[pool?.currency]?.logo}
														width={30}
														height={30}
														alt=""
													/>
												</div>
												<h3 className="stake_theme" style={{}}>
													{pool.name}
												</h3>
												<div>
													{pool.duration ? (
														<>
															<span
																className="stake_theme"
																style={{
																	fontWeight: 'bold',
																}}
															>
																{STRINGS['CEFI_STAKE.DURATION_LABEL']}:
															</span>{' '}
															{pool.duration} days
														</>
													) : (
														'Perpetual Staking'
													)}
												</div>
												<div>
													<span
														className="stake_theme"
														style={{
															fontWeight: 'bold',
														}}
													>
														APY:
													</span>{' '}
													{pool.apy}%
												</div>
												<div>-</div>
												<div>
													<span style={{ fontWeight: 'bold' }}>Min:</span>{' '}
													{pool.min_amount} {pool.currency.toUpperCase()}
												</div>
												<div>
													<span style={{ fontWeight: 'bold' }}>Max:</span>{' '}
													{pool.max_amount} {pool.currency.toUpperCase()}
												</div>
												{pool?.reward_currency && (
													<div className="stake_theme" style={{}}>
														{STRINGS['CEFI_STAKE.REWARDS_IN_LABEL']}{' '}
														<span style={{ fontWeight: 'bold' }}>
															{pool.reward_currency.toUpperCase()}
														</span>
													</div>
												)}
												<div>
													<AntBtn
														onClick={() => {
															setReadBeforeAction(true);
															setSelectedPool(pool);
														}}
														disabled={alreadyStaked}
														style={{
															marginTop: 30,
															backgroundColor: '#5D63FF',
															padding: 20,
															borderRadius: 20,
															width: 160,
															color: 'white',
															textAlign: 'center',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
															opacity: alreadyStaked ? 0.4 : 1,
														}}
													>
														{' '}
														{alreadyStaked ? 'STAKED' : 'STAKE'}{' '}
													</AntBtn>
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</TabPane>
					<TabPane tab="MY STAKES" key="1">
						<div
							className="stake_table_theme"
							style={{
								width: '100%',
								padding: 30,
							}}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									marginBottom: 50,
								}}
							>
								<div style={{ flex: 1 }}>
									<div
										className="stake_theme"
										style={{
											fontWeight: 'bold',
										}}
									>
										{STRINGS['CEFI_STAKE.ALL_STAKING_EVENTS']}
									</div>
									<div style={{}}>
										{STRINGS['CEFI_STAKE.MONITOR_ACTIVE_STAKES']}
									</div>
									<div style={{ marginTop: 20 }}>
										{STRINGS['CEFI_STAKE.USE_FILTERS_FOR_HISTORICAL_EVENTS']}
									</div>
								</div>
								<div
									style={{
										flex: 1,
										display: 'flex',
										justifyContent: 'flex-end',
									}}
								>
									<div>
										<div style={{ marginBottom: 20 }}>
											{userStakeData?.length > 0 && (
												<div>
													{STRINGS['CEFI_STAKE.ESTIMATED_TOTAL_STAKED']}
												</div>
											)}
											<div style={{ fontSize: 18 }}>
												{accumulateAmount(userStakeData).map((stake) => (
													<div>
														{stake.currency.toUpperCase()}: {stake.amount}
													</div>
												))}
											</div>
										</div>
										<div>
											{userStakeData?.length > 0 && (
												<div>
													{STRINGS['CEFI_STAKE.ESTIMATED_EARNINGS_VALUE']}
												</div>
											)}
											<div style={{ fontSize: 18 }}>
												{accumulateReward(userStakeData).map((stake) => {
													const incrementUnit =
														coins[stake.currency].increment_unit;
													const decimalPoint = new BigNumber(
														incrementUnit
													).dp();
													const sourceAmount =
														stake?.reward &&
														new BigNumber(stake?.reward)
															.decimalPlaces(decimalPoint)
															.toNumber();

													return (
														<div>
															{(
																stake.reward_currency || stake.currency
															).toUpperCase()}
															: {sourceAmount}
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-4">
								<Spin spinning={isLoading}>
									<Table
										className="cefi_stake"
										columns={columns}
										dataSource={userStakeData}
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
					</TabPane>
				</Tabs>
			</NotLoggedIn>
		</div>
	);
};

export default CeFiUserStake;
