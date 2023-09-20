import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import mathjs from 'mathjs';
import classnames from 'classnames';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Button as AntBtn, Switch } from 'antd';
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
import CeFiUserStake from './components/CeFiUserStake';

class Stake extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			activeTab: '1',
			selectedStaking: 'defi',
			readBeforeAction: false,
			stakeAmount: false,
			duration: false,
			stakeDetails: false,
			confirmStake: false,
			confirmation: false,
			isLoading: false,
			userStakeData: [],
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
					{this.state.selectedStaking === 'defi' && (
						<IconTitle
							stringId="STAKE.TITLE"
							text={STRINGS['STAKE.TITLE']}
							iconPath={ICONS['TAB_STAKE']}
							iconId="TAB_STAKE"
							textType="title"
						/>
					)}

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
					{this.state.selectedStaking === 'cefi' && (
						<div style={{ width: 50, height: 40, marginBottom: 10 }}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="59.482"
								height="50.688"
								viewBox="0 0 59.482 50.688"
								class="w-100 h-100"
							>
								<g transform="translate(0 0)">
									<path
										class="fill_secondary-color stroke_none"
										d="M93.737,82.874l8.584-10.938-8.581-10.91L85.156,71.964Z"
										transform="translate(-63.997 -45.863)"
										fill="#fff"
									/>
									<path
										class="fill_secondary-color stroke_none"
										d="M84.424,0l8.763,11.141L101.931,0Z"
										transform="translate(-63.448 0)"
										fill="#fff"
									/>
									<path
										class="fill_secondary-color stroke_none"
										d="M126.056,16.8l8.613,10.95h19.548l-18.787-22.9Z"
										transform="translate(-94.735 -3.649)"
										fill="#fff"
									/>
									<path
										class="fill_secondary-color stroke_none"
										d="M0,27.794H19.569l8.592-10.949L18.776,4.913Z"
										transform="translate(0 -3.692)"
										fill="#fff"
									/>
									<path
										class="fill_secondary-color stroke_none"
										d="M135.814,107l-9.758,12.435,8.788,11.173L154.217,107Z"
										transform="translate(-94.735 -80.415)"
										fill="#fff"
									/>
									<path
										class="fill_secondary-color stroke_none"
										d="M89.21,174.8h15.17l-7.594-9.655Z"
										transform="translate(-67.044 -124.11)"
										fill="#fff"
									/>
									<path
										class="fill_secondary-color stroke_none"
										d="M0,107l19.383,23.622,8.777-11.185L18.38,107Z"
										transform="translate(-0.001 -80.415)"
										fill="#fff"
									/>
								</g>
							</svg>
						</div>
					)}

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
							checked={this.state.selectedStaking === 'cefi'}
							onClick={(checked) => {
								this.setState({
									selectedStaking: checked ? 'cefi' : 'defi',
								});
							}}
						/>
						<span style={{ marginLeft: 5 }}>CeFi Staking</span>
					</div>
				</div>

				{this.state.selectedStaking === 'cefi' && (
					<CeFiUserStake
						balance={this.props.balance}
						coins={this.props.coins}
					/>
				)}
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
