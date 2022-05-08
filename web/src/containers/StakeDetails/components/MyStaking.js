import React, { useState } from 'react';
import { connect } from 'react-redux';
import mathjs from 'mathjs';
import { bindActionCreators } from 'redux';
import STRINGS from 'config/localizedStrings';
import { Table, EditWrapper, ProgressBar, Help } from 'components';
import { setNotification, NOTIFICATIONS } from 'actions/appActions';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Button as AntBtn } from 'antd';
import {
	userActiveStakesSelector,
	pendingTransactionsSelector,
	networksMismatchSelector,
} from 'containers/Stake/selector';
import { getEstimatedRemainingTime, calculateEsimatedDate } from 'utils/eth';
import { web3 } from 'config/contracts';
import Transaction from './Transaction';
import StakesAndEarnings from 'containers/Stake/components/StakesAndEarnings';
import ConnectWrapper from 'containers/Stake/components/ConnectWrapper';
import Variable from 'containers/Stake/components/Variable';

const TABLE_PAGE_SIZE = 10;

const MyStaking = ({
	coins,
	token,
	account,
	currentBlock,
	totalUserEarnings,
	totalUserStakes,
	stakables,
	setNotification,
	activeStakesCount,
	activeStakes,
	events,
	pending,
	goToBlocks,
	networksMismatch,
}) => {
	// This line is to temporarily hide the events history table
	const [showEventsHistory] = useState(false);

	const startStakingProcess = (tokenData) => {
		const { symbol } = tokenData;
		const { fullname, display_name, icon_id } = coins[symbol];
		setNotification(NOTIFICATIONS.STAKE, {
			tokenData: { ...tokenData, fullname, display_name, icon_id },
		});
	};

	const startUnstakingProcess = (stakeData) => {
		setNotification(NOTIFICATIONS.UNSTAKE, { stakeData });
	};

	const startEarlyUnstakingProcess = (stakeData) => {
		setNotification(NOTIFICATIONS.EARLY_UNSTAKE, { stakeData });
	};

	const generateStakeEventsHeader = () => [
		{
			stringId: 'STAKE_DETAILS.MY_STAKING.TIME',
			label: STRINGS['STAKE_DETAILS.MY_STAKING.TIME'],
			key: 'blockNumber',
			renderCell: ({ blockNumber }, key, index) => {
				return (
					<td key={index}>
						<span>{`${STRINGS['STAKE.BLOCK']}: ${blockNumber} `}</span>
						<span className="secondary-text">
							({calculateEsimatedDate(blockNumber, currentBlock, false)})
						</span>
					</td>
				);
			},
		},
		{
			stringId: 'STAKE_DETAILS.MY_STAKING.EVENT',
			label: STRINGS['STAKE_DETAILS.MY_STAKING.EVENT'],
			key: 'event',
			renderCell: ({ event }, key, index) => {
				return <td key={index}>{event}</td>;
			},
		},
		{
			stringId: 'STAKE_DETAILS.MY_STAKING.TRANSACTION_ID',
			label: STRINGS['STAKE_DETAILS.MY_STAKING.TRANSACTION_ID'],
			key: 'transactionHash',
			renderCell: ({ transactionHash }, key, index) => {
				return (
					<td key={index}>
						<Transaction id={transactionHash} />
					</td>
				);
			},
		},
		{
			stringId: 'STAKE_DETAILS.MY_STAKING.AMOUNT',
			label: STRINGS['STAKE_DETAILS.MY_STAKING.AMOUNT'],
			key: 'amount',
			renderCell: ({ amount }, key, index) => {
				return <td key={index}>{amount}</td>;
			},
		},
	];

	const { display_name } = coins[token];

	return (
		<div>
			<div className="d-flex justify-content-between align-start">
				<div>
					<div>
						<div className="bold important-text">
							{STRINGS['STAKE_DETAILS.MY_STAKING.TITLE']}
						</div>
						<div className="secondary-text">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.MY_STAKING.SUBTITLE'],
								display_name
							)}
						</div>
					</div>

					<div className="pt-4 secondary-text">
						{STRINGS.formatString(
							STRINGS['STAKE.CURRENT_ETH_BLOCK'],
							<span
								className="blue-link pointer underline-text"
								onClick={goToBlocks}
							>
								{currentBlock}
							</span>
						)}
					</div>
				</div>
				<StakesAndEarnings />
			</div>
			<table className="wallet-assets_block-table">
				<thead className="important-text">
					<tr className="table-bottom-border">
						<th />
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
					{stakables
						.filter(({ symbol }) => symbol === token)
						.map((tokenData, index) => {
							const { available } = tokenData;

							return (
								<tr className="table-row table-bottom-border" key={index}>
									<td />
									<td>
										<ConnectWrapper>{available}</ConnectWrapper>
									</td>
									<td>
										<ConnectWrapper>{totalUserStakes[token]}</ConnectWrapper>
									</td>
									<td>
										<ConnectWrapper>
											<Variable className="important-text" />
										</ConnectWrapper>
									</td>
									<td>
										<ConnectWrapper>{totalUserEarnings[token]}</ConnectWrapper>
									</td>
									<td>
										<div className="d-flex">
											<AntBtn
												className="stake-btn caps"
												type="primary"
												ghost
												onClick={() => startStakingProcess(tokenData)}
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
					<thead className="important-text">
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
									const calculatedCloseBlock = mathjs.sum(startBlock, period);
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

									const partial = mathjs.subtract(currentBlock, startBlock);

									const total = mathjs.number(period);

									const { display_name } = coins[symbol];

									const data = {
										amount,
										partial,
										total,
										reward,
										symbol,
										index,
										display_name,
									};

									const progressStatusText = remainingBlocks ? (
										`~${estimatedLeftover.join(' ')}`
									) : (
										<Help tip={STRINGS['STAKE.COMPLETED_TOOLTIP']}>
											{STRINGS['STAKE.COMPLETED']}
										</Help>
									);

									const btnProps = {
										type: 'primary',
										className: 'stake-btn',
										ghost: true,
										danger: !!isEarly,
										onClick: isEarly
											? () => startEarlyUnstakingProcess(data)
											: () => startUnstakingProcess(data),
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
													<ProgressBar partial={partial} total={total} />
													<div className="px-2 align-center">
														{progressStatusText}
													</div>
												</div>
											</td>
											<td>
												<div>{`${STRINGS['STAKE.BLOCK']}: ${startBlock}`}</div>
												<div className="secondary-text">
													{calculateEsimatedDate(startBlock, currentBlock)}
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
			{showEventsHistory && (
				<div className="pt-4">
					<div className="important-text bold pt-4 mt-2">
						<EditWrapper stringId="STAKE_DETAILS.MY_STAKING.EVENTS_TITLE">
							{STRINGS['STAKE_DETAILS.MY_STAKING.EVENTS_TITLE']}
						</EditWrapper>
					</div>
					<Table
						className="transactions-history-table stake-details-table"
						data={events}
						count={events.length}
						headers={generateStakeEventsHeader()}
						withIcon={false}
						pageSize={TABLE_PAGE_SIZE}
						rowKey={(data) => {
							return data.id;
						}}
						title={STRINGS['STAKE_DETAILS.MY_STAKING.EVENTS_TITLE']}
						handleNext={() => {}}
						jumpToPage={0}
						noData={
							!account &&
							STRINGS.formatString(
								STRINGS['STAKE.CONNECT_WALLET_TABLE'],
								<ConnectWrapper className="pr-2" />
							)
						}
						showHeaderNoData={true}
					/>
				</div>
			)}
		</div>
	);
};

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	account: store.stake.account,
	currentBlock: store.stake.currentBlock,
	stakables: store.stake.stakables,
	events: store.stake.contractEvents,
	...userActiveStakesSelector(store),
	pending: pendingTransactionsSelector(store),
	networksMismatch: networksMismatchSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
	setNotification: bindActionCreators(setNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyStaking);
