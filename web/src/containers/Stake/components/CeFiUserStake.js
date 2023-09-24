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
import '../CeFiStake.scss';

const TabPane = Tabs.TabPane;

const CeFiUserStake = ({ balance, coins }) => {
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
				const incrementUnit = coins[data.currency].increment_unit;
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
											: isUnstackable(data.stake, data.createdAt) < 0
											? true
											: false
										: false
								}
								onClick={async () => {
									try {
										const slashedEstimate = await getSlashEstimate(data.id);
										data.slashedAmount = slashedEstimate.slashedAmount;
										setSelectedStaker(data);
										setReviewUnstake(true);
									} catch (error) {
										message.error(error.response.data.message);
									}
								}}
								style={{ backgroundColor: '#5D63FF', color: 'white' }}
								className="ant-btn green-btn ant-tooltip-open ant-btn-primary"
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
		requestUserStakePools().then((res) => {
			setStakePools(res.data);
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

	const readBeforeActionModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
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
							<h1 style={{ color: 'white' }}>Staking 101</h1>
						</div>
						<div style={{ flex: 1 }}>
							<h4 style={{ color: 'white', fontWeight: 'bold' }}>
								Read Before You Agree and Earn
							</h4>
							<div>
								Locking up funds and participating in staking can indeed be a
								profitable way to earn rewards. However, it is essential to be
								aware that there might be penalties for early unstaking and
								potentially long lock up periods. Therefore, it is crucial to
								thoroughly understand the pool's rules before staking. By
								clicking "I agree and understand" below, you acknowledge that
								you will{' '}
								<span style={{ fontWeight: 'bold' }}>
									carefully read the terms in the steps to follow,
								</span>{' '}
								and you accept the potential risks and penalties associated with
								early unstaking. Proceeding with this understanding will ensure
								a more informed and secure staking experience.
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
							Back
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
							I UNDERSTAND
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
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
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
							<h3 style={{ color: 'white' }}>{selectedPool.name}</h3>
							<div>-</div>
							<div>APY: {selectedPool.apy}%</div>
						</div>
						<div style={{ width: '100%' }}>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									{selectedPool.currency.toUpperCase()} available:
								</span>{' '}
								{balance[`${selectedPool.currency}_available`]}
							</div>
							<div>
								<span style={{ fontWeight: 'bold' }}>Amount to stake:</span>
							</div>
							<div style={{ marginTop: 5 }}>
								<Input
									style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
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
							Back
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
							Next
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
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
					visible={duration}
					width={420}
					footer={null}
					onCancel={() => {
						setDuration(false);
					}}
				>
					<div>
						<h1 style={{ color: 'white' }}>Duration</h1>
						<div>
							Lock up duration: {`${selectedPool.duration} days` || 'Perpetual'}
							{/* 365 days (12/12/23) */}
						</div>
						<div>-</div>

						{selectedPool.slashing && (
							<>
								<h4 style={{ color: 'white' }}>Slashing</h4>
								<div>
									Penalty upon initial stake principle: -
									{selectedPool.slashing_principle_percentage}%{' '}
								</div>
								<div>
									Forfeiture of earnings: -
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
								<div>! Slashing rules are enforced in this pool</div>
								<div>
									Keep in mind that opting to withdraw your funds prior to the
									designated duration will incur a penalty, as outlined in the
									slashing rules mentioned above. Prior to committing to a
									staking period, it's crucial to assess your financial
									stability, as initiating an early unstaking process could lead
									to a decrease in the overall value of your initial stake.
								</div>
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
								<div>
									This pool allows you to unstake at anytime without
									consequence.
								</div>
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
								<div>
									This pool locks you in for the full duration. Please consider
									your financial sustainability before committing to the staking
									pool as unstaking before the term will not be possible.
								</div>
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
							Back
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
							Proceed
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
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
					visible={stakeDetails}
					width={450}
					footer={null}
					onCancel={() => {
						setStakeDetails(false);
					}}
				>
					<div>
						<h1 style={{ color: 'white' }}>Check stake details</h1>
						<div>Staking pool{selectedPool.name}</div>
						<div>Annual percentage yield: {selectedPool.apy}% APY</div>
						<div>Duration: {selectedPool.duration} days </div>
						<div>
							Penalty upon initial stake principle: -
							{selectedPool.slashing_principle_percentage}%
						</div>
						<div>
							Forfeiture of earnings: -
							{selectedPool.slashing_earning_percentage}%
						</div>

						<div style={{ marginTop: 20 }}>
							Stake amount: {stakerAmount} {selectedPool.currency.toUpperCase()}
						</div>
						<hr />

						<div style={{ marginTop: 30 }}>
							Disclaimer: Please note that for amounts valued in USD exceeding
							$1,000 will require completing ID verification. This value is
							inclusive of earnings, and the platform reserves the right to
							request additional user information.
						</div>
						<div>
							Settlement: A 24h settlement period will be applied upon
							unstaking.
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
							Back
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
							Proceed
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
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
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
							<h3 style={{ color: 'white' }}>
								Confirm {selectedPool.currency.toUpperCase()} Stake
							</h3>
						</div>
						<div style={{ width: '100%' }}>
							<div>
								<span style={{ fontWeight: 'bold', marginTop: 20 }}>
									Here we go!{' '}
								</span>
							</div>
							<div>
								As soon as you've staked you will be committed to the rules of
								the pool.
							</div>
							<div style={{ marginTop: 30 }}> Do you understand?</div>
							<div style={{ marginTop: 5 }}>
								<Input
									style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
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
							Back
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
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
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
							<h3 style={{ color: 'white' }}>
								{stakerAmount} {selectedPool.currency.toUpperCase()}
							</h3>
							<div>Successfully staked</div>
							<div style={{ marginTop: 30, marginBottom: 30 }}>-</div>
							<div style={{ fontSize: 12, fontWeight: 'bold' }}>
								Congratulations!
							</div>
							<div style={{ fontSize: 12 }}>
								Your stake will start earning rewards.
							</div>
							<div style={{ fontSize: 12 }}>
								{' '}
								You can review the progress of your stake on the Active Stakes
								page.
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
							Close
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
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
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
							<h3 style={{ color: 'white' }}>Review and unstake</h3>
							<div>
								<span style={{ fontWeight: 'bold' }}>Time remaining:</span>{' '}
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
									Penalty upon initial stake principle:
								</span>{' '}
								{/* -- {selectedStaker.currency} */}
								(-
								{selectedStaker?.stake?.slashing_principle_percentage
									? `${selectedStaker?.stake?.slashing_principle_percentage}%`
									: '-'}
								)
							</div>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									Forfeiture of earnings:
								</span>{' '}
								{/* -- {selectedStaker.currency} */}
								(-
								{selectedStaker?.stake?.slashing_earning_percentage
									? `${selectedStaker?.stake?.slashing_earning_percentage}%`
									: '-'}
								)
							</div>

							<div style={{ marginTop: 20 }}>
								<span style={{ fontWeight: 'bold' }}>Amount to receive:</span>{' '}
								{new BigNumber(selectedStaker.amount)
									.plus(
										new BigNumber(selectedStaker.reward).minus(
											new BigNumber(selectedStaker.slashedAmount)
										)
									)
									.toNumber()}{' '}
								{selectedStaker.currency.toUpperCase()}
							</div>
							<div>(Requires 24 hours to settle)</div>
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
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
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
							<h2 style={{ color: 'white' }}>
								You've successfully unstaked{' '}
								{selectedStaker.currency.toUpperCase()}
							</h2>
							<div style={{ marginTop: 20 }}>
								<span style={{ fontWeight: 'bold' }}>Amount to receive:</span>{' '}
								{new BigNumber(selectedStaker.amount)
									.plus(
										new BigNumber(selectedStaker.reward).minus(
											new BigNumber(selectedStaker.slashedAmount)
										)
									)
									.toNumber()}{' '}
								{(
									selectedStaker.reward_currency || selectedStaker.currency
								).toUpperCase()}
							</div>
							<div>(Requires 24 hours to settle)</div>
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
							CLOSE
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
							VISIT WALLET
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
				(m, { currency, reward, slashed }) =>
					m.set(currency, (m.get(currency) || 0) + (reward - slashed)),
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

			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
			>
				<TabPane tab="POOLS" key="0">
					<div
						style={{ backgroundColor: '#25262C', width: '100%', padding: 30 }}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 50,
							}}
						>
							<div style={{ flex: 1 }}>
								<div style={{ fontWeight: 'bold', color: 'white' }}>
									Local CeFi Staking Pools
								</div>
								<div style={{}}>
									Earn rewards on assets you have stored in your local exchange
									wallet. Simply, click 'STAKE', input the amount you'd like to
									stake and start earning.
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
									<div>Current staking value:</div>
									{/* <div>USDT 0: (VIEW)</div> */}
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
											style={{
												backgroundColor: '#2E2F35',
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
												<svg
													xmlns="http://www.w3.org/2000/svg"
													xmlnsXlink="http://www.w3.org/1999/xlink"
													width={32}
													height={32}
													viewBox="0 0 32 32"
												>
													<defs>
														<linearGradient
															id="c"
															x1="50%"
															x2="50%"
															y1="0%"
															y2="100%"
														>
															<stop
																offset="0%"
																stopColor="#FFF"
																stopOpacity={0.5}
															/>
															<stop offset="100%" stopOpacity={0.5} />
														</linearGradient>
														<filter
															id="a"
															width="111.7%"
															height="111.7%"
															x="-5.8%"
															y="-4.2%"
															filterUnits="objectBoundingBox"
														>
															<feOffset
																dy={0.5}
																in="SourceAlpha"
																result="shadowOffsetOuter1"
															/>
															<feGaussianBlur
																in="shadowOffsetOuter1"
																result="shadowBlurOuter1"
																stdDeviation={0.5}
															/>
															<feComposite
																in="shadowBlurOuter1"
																in2="SourceAlpha"
																operator="out"
																result="shadowBlurOuter1"
															/>
															<feColorMatrix
																in="shadowBlurOuter1"
																values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.199473505 0"
															/>
														</filter>
														<circle id="b" cx={15} cy={15} r={15} />
													</defs>
													<g fill="none">
														<g transform="translate(1)">
															<use
																xlinkHref="#b"
																fill="#000"
																filter="url(#a)"
															/>
															<use xlinkHref="#b" fill="#F19F13" />
															<use
																xlinkHref="#b"
																fill="url(#c)"
																style={{
																	mixBlendMode: 'soft-light',
																}}
															/>
															<circle
																cx={15}
																cy={15}
																r={14.5}
																stroke="#000"
																strokeLinejoin="square"
																strokeOpacity={0.097}
															/>
														</g>
														<path
															fill="#FFF"
															d="M22.77 12.95h4.87l.36-2h-4.71a4.78 4.78 0 0 0-2.59.86c-.28-1-3-.86-3-.86l.36-2H17l-.36 2h-1.11l.31-2h-1.15l-.42 2h-1.19l-.61 3.12-.81-3.06H9l-5 7.35h4.12l.42-1.95H7.7l2.4-3.51.9 3.53h-.9l-.39 1.93h3.06l-.25 1.34h1.2l.28-1.34h1l-.25 1.34H16l.25-1.34h1.56a3 3 0 0 0 1.87-.95 3.2 3.2 0 0 0 2.2.95h4.71l.31-1.95h-4.23c-2.91-.05-1.67-3.48.1-3.46zm-5.29 3.41h-3.12l.25-.95h3c.76.05.51.95-.13.95zm.47-2.56h-3.12l.25-.95h3c.76.05.48.99-.13.99v-.04z"
														/>
													</g>
												</svg>
											</div>
											<h3 style={{ color: 'white' }}>{pool.name}</h3>
											<div>
												{pool.duration ? (
													<>
														<span
															style={{ fontWeight: 'bold', color: 'white' }}
														>
															Duration:
														</span>{' '}
														{pool.duration} days
													</>
												) : (
													'Perpetual Staking'
												)}
											</div>
											<div>
												<span style={{ fontWeight: 'bold', color: 'white' }}>
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
												<div style={{ color: 'white' }}>
													Rewards will be paid in{' '}
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
						style={{ backgroundColor: '#25262C', width: '100%', padding: 30 }}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 50,
							}}
						>
							<div style={{ flex: 1 }}>
								<div style={{ fontWeight: 'bold', color: 'white' }}>
									All staking events
								</div>
								<div style={{}}>
									Monitor active stakes and their earnings coming from the
									staking pools.
								</div>
								<div style={{ marginTop: 20 }}>
									Use the filters to find all staking historical events. All
									earnings from completed stakes will be deposit to your wallet.
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
										<div>Estimated value of total staked</div>
										<div style={{ fontSize: 18 }}>
											{accumulateAmount(userStakeData).map((stake) => (
												<div>
													{stake.currency.toUpperCase()}: {stake.amount}
												</div>
											))}
										</div>
									</div>
									<div>
										<div>Estimated value of earnings</div>
										<div style={{ fontSize: 18 }}>
											{accumulateReward(userStakeData).map((stake) => {
												const incrementUnit =
													coins[stake.currency].increment_unit;
												const decimalPoint = new BigNumber(incrementUnit).dp();
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
		</div>
	);
};

export default CeFiUserStake;
