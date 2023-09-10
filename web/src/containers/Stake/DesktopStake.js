import React, { Component } from 'react';
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
} from 'antd';
import {
	connectWallet,
	loadBlockchainData,
	getCurrentBlock,
	generateTableData,
	getAllPeriods,
	getAllUserStakes,
	getPendingTransactions,
	getAllPenalties,
	getAllPots,
} from 'actions/stakingActions';
import { setNotification, NOTIFICATIONS } from 'actions/appActions';
import { Link, withRouter } from 'react-router';
import { web3 } from 'config/contracts';
import STRINGS from 'config/localizedStrings';
import { DEFAULT_COIN_DATA } from 'config/constants';
import { STAKING_INDEX_COIN } from 'config/contracts';
import {
	IconTitle,
	HeaderSection,
	EditWrapper,
	Button,
	ProgressBar,
	Help,
	Coin,
} from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import { open } from 'helpers/link';

import {
	userActiveStakesSelector,
	pendingTransactionsSelector,
	networksMismatchSelector,
} from './selector';
import { getEstimatedRemainingTime, calculateEsimatedDate } from 'utils/eth';
import { isLoggedIn } from 'utils/token';
import { formatToCurrency } from 'utils/currency';
import Account from './components/Account';
import ConnectWrapper from './components/ConnectWrapper';
import StakesAndEarnings from './components/StakesAndEarnings';
import Variable from './components/Variable';
import {
	CloseOutlined,
	ExclamationCircleOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';

const TabPane = Tabs.TabPane;

class Stake extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			activeTab: '0',
			selectedStaking: 'cefi',
			readBeforeAction: false,
			stakeAmount: false,
			duration: false,
			stakeDetails: false,
			confirmStake: false,
			confirmation: false,
		};
	}

	UNSAFE_componentWillMount() {
		const {
			loadBlockchainData,
			getAllPeriods,
			getCurrentBlock,
			getAllPenalties,
			getAllPots,
		} = this.props;
		loadBlockchainData();
		getCurrentBlock();
		getAllPeriods();
		getAllPenalties();
		getAllPots();
	}

	componentDidUpdate(prevProps) {
		const {
			account,
			network,
			generateTableData,
			getAllUserStakes,
			getPendingTransactions,
		} = this.props;
		if (
			(!!account && account !== prevProps.account) ||
			(!!network && network !== prevProps.network)
		) {
			generateTableData(account);
			getAllUserStakes(account);
			getPendingTransactions(account);
		}
	}

	componentDidMount() {
		this.setBlockNumberInterval();
	}

	componentWillUnmount() {
		this.clearBlockNumberInterval();
	}

	setBlockNumberInterval = () => {
		const { getCurrentBlock } = this.props;
		this.BlockNumberIntervalHandler = setInterval(getCurrentBlock, 5000);
	};

	clearBlockNumberInterval = () => {
		clearInterval(this.BlockNumberIntervalHandler);
	};

	startStakingProcess = (tokenData) => {
		const { symbol } = tokenData;
		const { coins, setNotification } = this.props;
		const { fullname, display_name, icon_id } = coins[symbol];
		setNotification(NOTIFICATIONS.STAKE, {
			tokenData: { ...tokenData, fullname, display_name, icon_id },
		});
	};

	startEarlyUnstakingProcess = (stakeData) => {
		const { setNotification } = this.props;
		setNotification(NOTIFICATIONS.EARLY_UNSTAKE, { stakeData });
	};

	startUnstakingProcess = (stakeData) => {
		const { setNotification } = this.props;
		setNotification(NOTIFICATIONS.UNSTAKE, { stakeData });
	};

	moveXHT = () => {
		const { setNotification } = this.props;
		setNotification(NOTIFICATIONS.MOVE_XHT, {});
	};

	renderAvailableBalance = () => {
		const { balance, coins } = this.props;
		const { min } = coins[STAKING_INDEX_COIN] || DEFAULT_COIN_DATA;
		const available = formatToCurrency(
			balance[`${STAKING_INDEX_COIN}_available`],
			min
		);

		return <span className="secondary-text">{available}</span>;
	};

	goToDetails = (symbol) => {
		const { router } = this.props;
		router.push(`/stake/details/${symbol.toLowerCase()}`);
	};

	goToPOT = () => {
		const {
			contracts: {
				[STAKING_INDEX_COIN]: { network, token },
			},
			pots,
		} = this.props;
		const address = pots[STAKING_INDEX_COIN]
			? pots[STAKING_INDEX_COIN].address
			: '';

		const url = `https://${
			network !== 'main' ? `${network}.` : ''
		}etherscan.io/token/${token}?a=${address}`;
		open(url);
	};

	goToBlocks = () => {
		const {
			contracts: {
				[STAKING_INDEX_COIN]: { network },
			},
		} = this.props;
		const url = `https://${
			network !== 'main' ? `${network}.` : ''
		}etherscan.io/blocks`;
		open(url);
	};

	handleTabChange = (key) => {
		this.setState({ activeTab: key });
	};

	readBeforeActionModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
					visible={this.state.readBeforeAction}
					width={800}
					footer={null}
					onCancel={() => {
						this.setState({ readBeforeAction: false });
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
								this.setState({ readBeforeAction: false });
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
								this.setState({ readBeforeAction: false, stakeAmount: true });
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

	stakeAmountModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
					visible={this.state.stakeAmount}
					width={400}
					footer={null}
					onCancel={() => {
						this.setState({ stakeAmount: false });
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
								<InputNumber
									style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
									placeholder="Input amount"
									onChange={(e) => {}}
									// value={}
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
								this.setState({ stakeAmount: false });
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
								this.setState({ stakeAmount: false, duration: true });
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

	durationModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
					visible={this.state.duration}
					width={420}
					footer={null}
					onCancel={() => {
						this.setState({ duration: false });
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
								this.setState({ duration: false });
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
								this.setState({ duration: false, stakeDetails: true });
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

	stakeDetailsModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
					visible={this.state.stakeDetails}
					width={450}
					footer={null}
					onCancel={() => {
						this.setState({ stakeDetails: false });
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
								this.setState({ stakeDetails: false });
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
								this.setState({ stakeDetails: false, confirmStake: true });
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

	confirmStakeModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
					visible={this.state.confirmStake}
					width={400}
					footer={null}
					onCancel={() => {
						this.setState({ confirmStake: false });
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
								this.setState({ confirmStake: false });
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
								this.setState({ confirmStake: false, confirmation: true });
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

	confirmationModel = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#303236',
						marginTop: 60,
					}}
					visible={this.state.confirmation}
					width={450}
					footer={null}
					onCancel={() => {
						this.setState({ confirmation: false });
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
								this.setState({
									confirmation: false,
								});
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
								this.setState({
									readBeforeAction: false,
									stakeAmount: false,
									duration: false,
									stakeDetails: false,
									confirmStake: false,
									confirmation: false,
								});
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

	render() {
		const {
			icons: ICONS,
			coins,
			connectWallet,
			account,
			currentBlock,
			stakables,
			activeStakes,
			activeStakesCount,
			totalUserStakes,
			totalUserEarnings,
			pending,
			networksMismatch,
		} = this.props;

		const { display_name: index_display_name } = coins[STAKING_INDEX_COIN];

		return (
			<div className="presentation_container apply_rtl wallet-wrapper">
				<div className="d-flex align-end justify-content-between">
					{/* <IconTitle
						stringId="STAKE.TITLE"
						text={STRINGS['STAKE.TITLE']}
						iconPath={ICONS['TAB_STAKE']}
						iconId="TAB_STAKE"
						textType="title"
					/> */}

					{this.state.selectedStaking === 'defi' && <Account />}
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<h2>Stake</h2>
					<div>Earn rewards for staking your digital assets</div>
				</div>

				<div
					style={{
						marginTop: 20,
						marginBottom: 20,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<div className="d-flex">
						<span style={{ marginRight: 5 }}>DeFi Staking</span>
						<Switch
							checked={true}
							// onClick={}
						/>
						<span style={{ marginLeft: 5 }}>CeFi Staking</span>
					</div>
				</div>
				{this.state.readBeforeAction && this.readBeforeActionModel()}
				{this.state.stakeAmount && this.stakeAmountModel()}
				{this.state.duration && this.durationModel()}
				{this.state.stakeDetails && this.stakeDetailsModel()}
				{this.state.confirmStake && this.confirmStakeModel()}
				{this.state.confirmation && this.confirmationModel()}

				<Tabs
					defaultActiveKey="0"
					activeKey={this.state.activeTab}
					onChange={this.handleTabChange}
				>
					<TabPane tab="POOLS" key="0">
						<div
							style={{ backgroundColor: '#25262C', width: '100%', padding: 30 }}
						>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div style={{ flex: 1 }}>
									<div style={{ fontWeight: 'bold', color: 'white' }}>
										Local CeFi Staking Pools
									</div>
									<div style={{}}>
										Earn rewards on assets you have stored in your local
										exchange wallet. Simply, click 'STAKE', input the amount
										you'd like to stake and start earning.
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
									<h3 style={{ color: 'white' }}>Mid-Term ABC Staking</h3>
									<div>
										<span style={{ fontWeight: 'bold', color: 'white' }}>
											Duration:
										</span>{' '}
										242 days
									</div>
									<div>
										<span style={{ fontWeight: 'bold', color: 'white' }}>
											APY:
										</span>{' '}
										4.5%
									</div>
									<div>-</div>
									<div>
										<span style={{ fontWeight: 'bold' }}>Min:</span> 25,000 ABC
									</div>
									<div>
										<span style={{ fontWeight: 'bold' }}>Max:</span> 10,000,000
										ABC
									</div>
									<div>
										<AntBtn
											onClick={() => {
												this.setState({ readBeforeAction: true });
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
							</div>
						</div>
					</TabPane>
					<TabPane tab="MY STAKES" key="1"></TabPane>
				</Tabs>

				{this.state.selectedStaking === 'defi' && (
					<>
						<div
							className={classnames('wallet-container', 'no-border', {
								'area-disabled': networksMismatch,
							})}
						>
							<div className="wallet-assets_block">
								<div className="d-flex justify-content-between align-start">
									<div>
										<HeaderSection
											stringId="STAKE.DEFI_TITLE"
											title={STRINGS['STAKE.DEFI_TITLE']}
										>
											<div className="header-content">
												<div>
													<EditWrapper stringId="STAKE.DEFI_TEXT">
														{STRINGS['STAKE.DEFI_TEXT']}
													</EditWrapper>
												</div>
											</div>
										</HeaderSection>
										<div className="secondary-text">
											{STRINGS.formatString(
												STRINGS['STAKE.CURRENT_ETH_BLOCK'],
												<span
													className="blue-link pointer underline-text"
													onClick={this.goToBlocks}
												>
													{currentBlock}
												</span>
											)}
										</div>
										<div className="secondary-text">
											{STRINGS.formatString(
												STRINGS['STAKE.ON_EXCHANGE_XHT'],
												index_display_name,
												isLoggedIn() ? (
													this.renderAvailableBalance()
												) : (
													<Link to="/login">
														<span className="blue-link pointer underline-text">
															{STRINGS['STAKE.LOGIN_HERE']}
														</span>
													</Link>
												),
												isLoggedIn() && account ? (
													<span onClick={this.moveXHT}>
														(
														{
															<span className="blue-link pointer">
																{STRINGS.formatString(
																	STRINGS['STAKE.MOVE_XHT'],
																	index_display_name
																)}
															</span>
														}
														)
													</span>
												) : (
													''
												)
											)}
										</div>
										<div className="secondary-text">
											<span
												className="blue-link pointer underline-text"
												onClick={this.goToPOT}
											>
												{STRINGS['STAKE.VIEW_POT']}
											</span>
										</div>
									</div>
									<StakesAndEarnings />
								</div>
								<table className="wallet-assets_block-table">
									<thead>
										<tr className="table-bottom-border">
											<th />
											<th>
												<EditWrapper stringId="STAKE_TABLE.CURRENCY">
													{STRINGS['STAKE_TABLE.CURRENCY']}
												</EditWrapper>
											</th>
											<th>
												<EditWrapper stringId="STAKE_TABLE.AVAILABLE">
													{STRINGS['STAKE_TABLE.AVAILABLE']}
												</EditWrapper>
											</th>
											<th>
												<EditWrapper stringId="STAKE_TABLE.TOTAL">
													{STRINGS['STAKE_TABLE.TOTAL']}
												</EditWrapper>
											</th>
											<th>
												<EditWrapper stringId="STAKE_TABLE.REWARD_RATE">
													{STRINGS['STAKE_TABLE.REWARD_RATE']}
												</EditWrapper>
											</th>
											<th>
												<EditWrapper stringId="STAKE_TABLE.EARNING">
													{STRINGS['STAKE_TABLE.EARNINGS']}
												</EditWrapper>
											</th>
											<th>
												<EditWrapper stringId="STAKE_TABLE.STAKE">
													{STRINGS['STAKE_TABLE.STAKE']}
												</EditWrapper>
											</th>
										</tr>
									</thead>
									<tbody>
										{stakables.map((tokenData, index) => {
											const { symbol, available } = tokenData;
											const { fullname, display_name, icon_id } = coins[symbol];
											const goToSymbol = () => this.goToDetails(symbol);
											const commonCellProps = !account
												? {}
												: { onClick: goToSymbol };
											return (
												<tr
													className="hoverable pointer table-row table-bottom-border"
													key={index}
												>
													<td />
													<td onClick={goToSymbol} className="td-name td-fit">
														<div className="d-flex align-items-center">
															<Coin iconId={icon_id} />
															<div className="px-2">
																{fullname}
																<span className="pl-2 secondary-text">
																	{display_name}
																</span>
															</div>
														</div>
													</td>
													<td {...commonCellProps}>
														<ConnectWrapper>{available}</ConnectWrapper>
													</td>
													<td {...commonCellProps}>
														<ConnectWrapper>
															{totalUserStakes[symbol]}
														</ConnectWrapper>
													</td>
													<td {...commonCellProps}>
														<ConnectWrapper>
															<Variable className="important-text" />
														</ConnectWrapper>
													</td>
													<td {...commonCellProps}>
														<ConnectWrapper>
															{totalUserEarnings[symbol]}
														</ConnectWrapper>
													</td>
													<td>
														<div className="d-flex">
															<AntBtn
																className="stake-btn caps"
																type="primary"
																ghost
																onClick={() =>
																	this.startStakingProcess(tokenData)
																}
																disabled={!account || networksMismatch}
															>
																{STRINGS['STAKE_TABLE.STAKE']}
															</AntBtn>
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
								{account && activeStakesCount !== 0 && (
									<table className="wallet-assets_block-table mt-4">
										<thead>
											<tr className="table-bottom-border">
												<th />
												<th>
													<EditWrapper stringId="STAKE_LIST.AMOUNT">
														{STRINGS['STAKE_LIST.AMOUNT']}
													</EditWrapper>
												</th>
												<th>
													<EditWrapper stringId="STAKE_LIST.DURATION">
														{STRINGS['STAKE_LIST.DURATION']}
													</EditWrapper>
												</th>
												<th>
													<EditWrapper stringId="STAKE_LIST.START">
														{STRINGS['STAKE_LIST.START']}
													</EditWrapper>
												</th>
												<th>
													<EditWrapper stringId="STAKE_LIST.END">
														{STRINGS['STAKE_LIST.END']}
													</EditWrapper>
												</th>
												<th>
													<EditWrapper stringId="STAKE_LIST.EARNINGS">
														{STRINGS['STAKE_LIST.EARNINGS']}
													</EditWrapper>
												</th>
												<th>
													<EditWrapper stringId="STAKE_LIST.STAKE">
														{STRINGS['STAKE_LIST.STAKE']}
													</EditWrapper>
												</th>
											</tr>
										</thead>
										<tbody>
											{Object.entries(activeStakes).map(([symbol, stakes]) =>
												stakes.map(
													([
														weiAmount,
														period,
														startBlock,
														weiReward,
														closeBlock,
														index,
													]) => {
														const amount = web3.utils.fromWei(weiAmount);
														const reward = web3.utils.fromWei(weiReward);
														const calculatedCloseBlock = mathjs.sum(
															startBlock,
															period
														);
														const remainingBlocks = mathjs.max(
															mathjs.subtract(
																calculatedCloseBlock,
																currentBlock
															),
															0
														);
														const estimatedLeftover = getEstimatedRemainingTime(
															remainingBlocks
														);
														const isEarly = mathjs.larger(
															calculatedCloseBlock,
															currentBlock
														);

														const partial = mathjs.subtract(
															currentBlock,
															startBlock
														);

														const total = mathjs.number(period);

														const progressStatusText = remainingBlocks
															? `~${estimatedLeftover.join(' ')}`
															: STRINGS['STAKE.COMPLETED'];

														const wrappedProgressStatusText = remainingBlocks ? (
															`~${estimatedLeftover.join(' ')}`
														) : (
															<Help tip={STRINGS['STAKE.COMPLETED_TOOLTIP']}>
																{progressStatusText}
															</Help>
														);

														const { display_name } = coins[symbol];

														const data = {
															amount,
															partial,
															total,
															reward,
															symbol,
															index,
															progressStatusText,
															display_name,
														};

														const btnProps = {
															type: 'primary',
															className: 'stake-btn',
															ghost: true,
															danger: !!isEarly,
															onClick: isEarly
																? () => this.startEarlyUnstakingProcess(data)
																: () => this.startUnstakingProcess(data),
															children: isEarly ? 'UNSTAKE EARLY' : 'UNSTAKE',
															disabled: networksMismatch,
														};
														return (
															<tr
																className="table-row table-bottom-border"
																key={`${symbol}_${index}`}
															>
																<td />
																<td>{amount}</td>
																<td>
																	<div className="d-flex">
																		<ProgressBar
																			partial={partial}
																			total={total}
																		/>
																		<div className="px-2 align-center">
																			{wrappedProgressStatusText}
																		</div>
																	</div>
																</td>
																<td>
																	<div>{`${STRINGS['STAKE.BLOCK']}: ${startBlock}`}</div>
																	<div className="secondary-text">
																		{calculateEsimatedDate(
																			startBlock,
																			currentBlock
																		)}
																	</div>
																</td>
																<td>
																	<div>{`${STRINGS['STAKE.BLOCK']}: ${calculatedCloseBlock}`}</div>
																	<div className="secondary-text">
																		{calculateEsimatedDate(
																			calculatedCloseBlock,
																			currentBlock
																		)}
																	</div>
																</td>
																<td>{reward}</td>
																<td className="text-align-center">
																	<div className="d-flex">
																		<AntBtn {...btnProps} />
																	</div>
																</td>
															</tr>
														);
													}
												)
											)}
											{Object.entries(pending).map(
												([token, pendingValue], pendingIndex) => {
													return (
														pendingValue !== 0 && (
															<tr
																className="table-row table-bottom-border"
																key={`${token}_${pendingIndex}`}
															>
																<td />
																<td>
																	<div className="d-flex align-center">
																		<div>
																			<ClockCircleOutlined />
																		</div>
																		<div className="pl-4">
																			<div>
																				{STRINGS.formatString(
																					STRINGS['STAKE.PENDING_TRANSACTIONS'],
																					pendingValue,
																					token.toUpperCase()
																				)}
																			</div>
																			<div>
																				{STRINGS.formatString(
																					STRINGS['STAKE.VIEW_ON'],
																					<span className="underline-text pointer blue-link">
																						{STRINGS['STAKE.BLOCKCHAIN']}
																					</span>
																				)}
																			</div>
																		</div>
																	</div>
																</td>
																<td />
																<td />
																<td />
																<td />
																<td />
															</tr>
														)
													);
												}
											)}
										</tbody>
									</table>
								)}
							</div>
						</div>

						{!account && (
							<div className="btn-wrapper">
								<Button
									label={STRINGS['STAKE.CONNECT_WALLET']}
									onClick={connectWallet}
									className="my-4"
								/>
							</div>
						)}
					</>
				)}
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	balance: store.user.balance,
	account: store.stake.account,
	network: store.stake.network,
	currentBlock: store.stake.currentBlock,
	stakables: store.stake.stakables,
	periods: store.stake.periods,
	pots: store.stake.pots,
	...userActiveStakesSelector(store),
	pending: pendingTransactionsSelector(store),
	networksMismatch: networksMismatchSelector(store),
	contracts: store.app.contracts,
});

const mapDispatchToProps = (dispatch) => ({
	connectWallet: bindActionCreators(connectWallet, dispatch),
	loadBlockchainData: bindActionCreators(loadBlockchainData, dispatch),
	getCurrentBlock: bindActionCreators(getCurrentBlock, dispatch),
	generateTableData: bindActionCreators(generateTableData, dispatch),
	getAllPeriods: bindActionCreators(getAllPeriods, dispatch),
	getAllUserStakes: bindActionCreators(getAllUserStakes, dispatch),
	getPendingTransactions: bindActionCreators(getPendingTransactions, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
	getAllPenalties: bindActionCreators(getAllPenalties, dispatch),
	getAllPots: bindActionCreators(getAllPots, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withConfig(Stake)));
