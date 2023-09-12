import React, { useState, useEffect, Fragment, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import mathjs from 'mathjs';
import classnames from 'classnames';
import { ClockCircleOutlined } from '@ant-design/icons';
import {
	Button as AntBtn,
	Switch,
	Tabs,
	Modal,
	Input,
	InputNumber,
	Spin,
	Table,
	message,
} from 'antd';

import {
	CloseOutlined,
	ExclamationCircleOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';
import { formatDate } from 'utils';
import {
	requestStakePools,
	createStaker,
} from 'containers/Admin/Stakes/actions';

const TabPane = Tabs.TabPane;

const CeFiUserStake = () => {
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

	const [userStakeData, setUserStakeData] = useState(false);
	const [stakePools, setStakePools] = useState([]);
	const [selectedPool, setSelectedPool] = useState();

	const [stakerAmount, setStakerAmount] = useState();

	const columns = [
		{
			title: 'POOL',
			dataIndex: 'name',
			key: 'name',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.name}</div>;
			},
		},
		{
			title: 'AMOUNT',
			dataIndex: 'amount',
			key: 'amount',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.amount}</div>;
			},
		},
		{
			title: 'STARTED',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (user_id, data) => {
				return <div className="d-flex">{formatDate(data?.created_at)}</div>;
			},
		},
		{
			title: 'END',
			dataIndex: 'expiry_date',
			key: 'expiry_date',
			render: (user_id, data) => {
				return <div className="d-flex">{formatDate(data?.expiry_date)}</div>;
			},
		},
		{
			title: 'EARNT',
			dataIndex: 'earnt',
			key: 'earnt',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.amount}</div>;
			},
		},
		{
			title: 'Stake',
			dataIndex: 'status',
			key: 'status',
			render: (user_id, data) => {
				return (
					<div className="d-flex" style={{ gap: 20 }}>
						<AntBtn className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							STAKE
						</AntBtn>
					</div>
				);
			},
		},
	];

	useEffect(() => {
		requestStakePools().then((res) => {
			setStakePools(res.data);
		});
	}, []);

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
					<div style={{ display: 'flex' }}>
						<div
							style={{
								flex: 1,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
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
							}}
						>
							<h3 style={{ color: 'white' }}>ABC Flexible Yield Stake Plan</h3>
							<div>-</div>
							<div>APY: 4.5%</div>
						</div>
						<div style={{ width: '100%' }}>
							<div>
								<span style={{ fontWeight: 'bold' }}>ABC available:</span> 1,000
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
							<div style={{ color: '#FF0000', marginTop: 10 }}>
								Staking pool's maximum amount allowed is 1,000 ABC
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
						<div>Lock up duration: 365 days (12/12/23)</div>
						<div>-</div>

						<h4 style={{ color: 'white' }}>Slashing</h4>
						<div>Penalty upon initial stake principle: -10% </div>
						<div>Forfeiture of earnings: -10%</div>

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
								slashing rules mentioned above. Prior to committing to a staking
								period, it's crucial to assess your financial stability, as
								initiating an early unstaking process could lead to a decrease
								in the overall value of your initial stake.
							</div>
						</div>

						<div
							style={{
								padding: 20,
								backgroundColor: '#388200',
								marginTop: 20,
								fontSize: 12,
							}}
						>
							<div>
								This pool allows you to unstake at anytime without consequence.
							</div>
						</div>

						<div
							style={{
								padding: 20,
								backgroundColor: '#FF6F00',
								marginTop: 20,
								fontSize: 12,
							}}
						>
							<div>
								This pool allows you to unstake at anytime without consequence.
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
						<div>Staking pool: ABC Flexible Yield Stake Plan</div>
						<div>Annual percentage yield: 1% APY</div>
						<div>Duration: 365 days (12/12/23) </div>
						<div>Penalty upon initial stake principle: -10%</div>
						<div>Forfeiture of earnings: -10%</div>

						<div style={{ marginTop: 20 }}>Stake amount: 1,000 ABC</div>
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
							}}
						>
							<h3 style={{ color: 'white' }}>Confirm ABC Stake</h3>
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
									onChange={(e) => {}}
									// value={}
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
								setConfirmStake(false);
								setConfirmation(true);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
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
							<h3 style={{ color: 'white' }}>1,000 ABC</h3>
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
								}

								setSelectedPool();
								setConfirmation(false);
								setConfirmStake(false);
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
								<span style={{ fontWeight: 'bold' }}>Time remaining:</span> 255
								days (12/12/23)
							</div>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									Penalty upon initial stake principle:
								</span>{' '}
								-100 ABC (-10%)
							</div>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									Forfeiture of earnings:
								</span>{' '}
								0 ABC (-10%)
							</div>

							<div style={{ marginTop: 20 }}>
								<span style={{ fontWeight: 'bold' }}>Amount to receive:</span>{' '}
								900 ABC
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
							Back
						</AntBtn>
						<AntBtn
							onClick={async () => {
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
							PROCEED
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
								You've successfully unstaked ABC
							</h2>
							<div style={{ marginTop: 20 }}>
								<span style={{ fontWeight: 'bold' }}>Amount to receive:</span>{' '}
								900 ABC
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
									<div>USDT 0: (VIEW)</div>
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
							{stakePools.map((pool) => {
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
														<use xlinkHref="#b" fill="#000" filter="url(#a)" />
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
											<span style={{ fontWeight: 'bold', color: 'white' }}>
												Duration:
											</span>{' '}
											{pool.duration}
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
											{pool.min_amount} {pool.currency}
										</div>
										<div>
											<span style={{ fontWeight: 'bold' }}>Max:</span>{' '}
											{pool.max_amount} {pool.currency}
										</div>
										<div>
											<AntBtn
												onClick={() => {
													setReadBeforeAction(true);
													setSelectedPool(pool);
												}}
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
												}}
											>
												{' '}
												STAKE{' '}
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
										<div style={{ fontSize: 18 }}>USDT 0: (VIEW)</div>
									</div>
									<div>
										<div>Estimated value of earnings</div>
										<div style={{ fontSize: 18 }}>USDT 0: (VIEW)</div>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-4 ">
							<Spin spinning={isLoading}>
								<Table
									className="blue-admin-table"
									columns={columns}
									dataSource={userStakeData}
									expandRowByClick={true}
									rowKey={(data) => {
										return data.id;
									}}
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
