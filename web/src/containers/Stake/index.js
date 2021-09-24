import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import mathjs from 'mathjs';
import { Button as AntBtn } from 'antd';
import {
	connectWallet,
	loadBlockchainData,
	getCurrentBlock,
	generateTableData,
	getAllPeriods,
	getUserStake,
	removeStake,
} from 'actions/stakingActions';
import { setNotification, NOTIFICATIONS } from 'actions/appActions';
import { Link } from 'react-router';
import { web3 } from 'config/contracts';
import STRINGS from 'config/localizedStrings';
import {
	IconTitle,
	HeaderSection,
	EditWrapper,
	Button,
	ProgressBar,
} from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from 'components/Image';

import { getEstimatedRemainingTime, calculateEsimatedDate } from 'utils/eth';

const ConnectWalletLink = (props) => (
	<span className="blue-link pointer underline-text" {...props}>
		{STRINGS['STAKE.CONNECT_WALLET']}
	</span>
);

class Stake extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userStakes: [],
		};
	}

	componentWillMount() {
		const { loadBlockchainData, getAllPeriods, getCurrentBlock } = this.props;
		loadBlockchainData();
		getCurrentBlock();
		getAllPeriods();
	}

	componentDidUpdate(prevProps) {
		const { account, generateTableData } = this.props;
		if (!prevProps.account && !!account) {
			generateTableData(account);
			this.getUserStake('xht')(account);
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

	smartRender = (element) => {
		const { account, connectWallet } = this.props;
		return account ? element : <ConnectWalletLink onClick={connectWallet} />;
	};

	getUserStake = (token = 'xht') => async (account) => {
		const userStakes = await getUserStake(token)(account);
		this.setState({
			userStakes,
		});
	};

	startStakingProcess = (tokenData) => {
		const { symbol } = tokenData;
		const { coins, setNotification } = this.props;
		const { fullname } = coins[symbol];
		setNotification(NOTIFICATIONS.STAKE, {
			tokenData: { ...tokenData, fullname },
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

	render() {
		const { userStakes } = this.state;
		const {
			icons: ICONS,
			coins,
			connectWallet,
			account,
			network,
			currentBlock,
			stakables,
		} = this.props;
		const { smartRender } = this;

		return (
			<div className="presentation_container apply_rtl wallet-wrapper">
				<IconTitle
					stringId="STAKE.TITLE"
					text={STRINGS['STAKE.TITLE']}
					iconPath={ICONS['TAB_WALLET']}
					iconId="TAB_WALLET"
					textType="title"
				/>
				<div className="wallet-container no-border">
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
										<span className="blue-link">{currentBlock}</span>
									)}
								</div>
							</div>
							<div
								className="secondary-text"
								style={{
									minWidth: 'max-content',
									paddingTop: '0.5rem',
									textAlign: 'right',
									marginLeft: '3rem',
								}}
							>
								<div>
									<div>{STRINGS['STAKE.ESTIMATED_STAKED']}</div>
									<div>{smartRender('___')}</div>
									<div className="kit-divider" />
								</div>
								<div>
									<div>{STRINGS['STAKE.ESTIMATED_EARNINGS']}</div>
									<div>{smartRender('___')}</div>
									<div className="kit-divider" />
								</div>
							</div>
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
									const {
										symbol,
										available,
										total,
										rate,
										earnings,
									} = tokenData;
									const { fullname } = coins[symbol];
									const iconId = `${symbol.toUpperCase()}_ICON`;
									return (
										<tr className="table-row table-bottom-border" key={index}>
											<td />
											<td className="td-name td-fit">
												<div className="d-flex align-items-center">
													<Link to={`/stake/details/${symbol.toLowerCase()}`}>
														<Image
															iconId={iconId}
															icon={ICONS[iconId]}
															wrapperClassName="currency-ball"
															imageWrapperClassName="currency-ball-image-wrapper"
														/>
													</Link>
													<Link to={`/stake/details/${symbol.toLowerCase()}`}>
														{fullname}
													</Link>
												</div>
											</td>
											<td>{smartRender(available)}</td>
											<td>{smartRender(total)}</td>
											<td>{smartRender(rate)}</td>
											<td>{smartRender(earnings)}</td>
											<td>
												<div className="d-flex content-center">
													<AntBtn
														className="stake-btn"
														type="primary"
														ghost
														onClick={() => this.startStakingProcess(tokenData)}
														disabled={!account}
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
						{account && (
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
									{userStakes
										.filter((stake) => stake[4] === '0')
										.map(
											(
												[weiAmount, period, startBlock, reward, closeBlock],
												index
											) => {
												const amount = web3.utils.fromWei(weiAmount);
												const calculatedCloseBlock = mathjs.sum(
													startBlock,
													period
												);
												const remainingBlocks = mathjs.max(
													mathjs.subtract(calculatedCloseBlock, currentBlock),
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

												const data = {
													amount,
													partial,
													total,
													reward,
													symbol: 'xht',
													index,
												};

												const progressStatusText = remainingBlocks
													? `~${estimatedLeftover.join(' ')}`
													: 'Completed';

												const btnProps = {
													type: 'primary',
													className: 'stake-btn',
													ghost: true,
													danger: !!isEarly,
													onClick: isEarly
														? () => this.startEarlyUnstakingProcess(data)
														: () => this.startUnstakingProcess(data),
													children: isEarly ? 'UNSTAKE EARLY' : 'UNSTAKE',
												};
												return (
													<tr
														className="table-row table-bottom-border"
														key={index}
													>
														<td />
														<td>{amount}</td>
														<td>
															<div className="d-flex">
																<ProgressBar partial={partial} total={total} />
																<div className="px-2 align-center">
																	{progressStatusText}
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
															<div className="d-flex content-center">
																<AntBtn {...btnProps} />
															</div>
														</td>
													</tr>
												);
											}
										)}
								</tbody>
							</table>
						)}
						<div>
							{STRINGS['STAKE.NETWORK']}: {network}
						</div>
						<div>
							{STRINGS['STAKE.ACCOUNT']}: {account}
						</div>
					</div>
				</div>
				{!account && (
					<div className="btn-wrapper">
						<Button
							label={STRINGS['STAKE.CONNECT_WALLET']}
							onClick={connectWallet}
						/>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	account: store.stake.account,
	network: store.stake.network,
	currentBlock: store.stake.currentBlock,
	stakables: store.stake.stakables,
	periods: store.stake.periods,
});

const mapDispatchToProps = (dispatch) => ({
	connectWallet: bindActionCreators(connectWallet, dispatch),
	loadBlockchainData: bindActionCreators(loadBlockchainData, dispatch),
	getCurrentBlock: bindActionCreators(getCurrentBlock, dispatch),
	generateTableData: bindActionCreators(generateTableData, dispatch),
	getAllPeriods: bindActionCreators(getAllPeriods, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Stake));
