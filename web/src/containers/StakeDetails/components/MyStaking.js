import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mathjs from 'mathjs';
import { bindActionCreators } from 'redux';
import STRINGS from 'config/localizedStrings';
import { Table, EditWrapper, ProgressBar } from 'components';
import { setNotification, NOTIFICATIONS } from 'actions/appActions';
import { Button as AntBtn } from 'antd';
import { userActiveStakesSelector } from 'containers/Stake/selector';
import { getEstimatedRemainingTime, calculateEsimatedDate } from 'utils/eth';
import { web3 } from 'config/contracts';
import { getStakeEvents } from 'actions/stakingActions';
import Transaction from './Transaction';

const TABLE_PAGE_SIZE = 10;

const MyStaking = ({
	coins,
	token,
	account,
	currentBlock,
	totalEarningsString,
	totalStakesString,
	totalUserEarnings,
	totalUserStakes,
	stakables,
	setNotification,
	activeStakesCount,
	activeStakes,
}) => {
	const [events, setEvents] = useState([]);
	useEffect(() => {
		getStakeEvents(token)(account).then((response) => setEvents(response));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const startStakingProcess = (tokenData) => {
		const { symbol } = tokenData;
		const { fullname } = coins[symbol];
		setNotification(NOTIFICATIONS.STAKE, {
			tokenData: { ...tokenData, fullname },
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
			key: 'block',
			renderCell: ({ block }, key, index) => {
				return (
					<td key={index}>
						<span>{`${STRINGS['STAKE.BLOCK']}: ${block} `}</span>
						<span className="secondary-text">
							({calculateEsimatedDate(block, currentBlock, false)})
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
			key: 'id',
			renderCell: ({ id }, key, index) => {
				return (
					<td key={index}>
						<Transaction id={id} />
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

	return (
		<div>
			<div className="d-flex justify-content-between align-start">
				<div>
					<div>
						<div className="bold">
							{STRINGS['STAKE_DETAILS.MY_STAKING.TITLE']}
						</div>
						<div className="secondary-text">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.MY_STAKING.SUBTITLE'],
								token.toUpperCase()
							)}
						</div>
					</div>

					<div className="pt-4 secondary-text">
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
						<div>{totalStakesString}</div>
						<div className="kit-divider" />
					</div>
					<div>
						<div>{STRINGS['STAKE.ESTIMATED_EARNINGS']}</div>
						<div>{totalEarningsString}</div>
					</div>
				</div>
			</div>
			<table className="wallet-assets_block-table">
				<thead>
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
									<td>{available}</td>
									<td>{totalUserStakes[token]}</td>
									<td>{STRINGS['STAKE_TABLE.VARIABLE']}</td>
									<td>{totalUserEarnings[token]}</td>
									<td>
										<div className="d-flex content-center">
											<AntBtn
												className="stake-btn"
												type="primary"
												ghost
												onClick={() => startStakingProcess(tokenData)}
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
									reward,
									closeBlock,
									index,
								]) => {
									const amount = web3.utils.fromWei(weiAmount);
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

									const data = {
										amount,
										partial,
										total,
										reward,
										symbol,
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
											? () => startEarlyUnstakingProcess(data)
											: () => startUnstakingProcess(data),
										children: isEarly ? 'UNSTAKE EARLY' : 'UNSTAKE',
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
												<div className="d-flex content-center">
													<AntBtn {...btnProps} />
												</div>
											</td>
										</tr>
									);
								}
							)
						)}
					</tbody>
				</table>
			)}
			<div className="bold">
				<EditWrapper stringId="STAKE_DETAILS.MY_STAKING.EVENTS_TITLE">
					{STRINGS['STAKE_DETAILS.MY_STAKING.EVENTS_TITLE']}
				</EditWrapper>
			</div>
			<div>
				<Table
					className="transactions-history-table"
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
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	account: store.stake.account,
	currentBlock: store.stake.currentBlock,
	stakables: store.stake.stakables,
	...userActiveStakesSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
	setNotification: bindActionCreators(setNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyStaking);
