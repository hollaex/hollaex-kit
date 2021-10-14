import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, EditWrapper } from 'components';
import { getDistributions } from 'actions/stakingActions';
import STRINGS from 'config/localizedStrings';
import { TABS } from '../index';
import { calculateEsimatedDate } from 'utils/eth';
import Transaction from './Transaction';
import DonutChart from './DonutChart';
import { web3 } from 'config/contracts';

const TABLE_PAGE_SIZE = 10;

const PublicInfo = ({
	fullname,
	token,
	currentBlock,
	setActiveTab,
	network,
}) => {
	const [distributions, setDistributions] = useState([]);
	useEffect(() => {
		getDistributions(token).then((response) =>
			setDistributions(response.reverse())
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateDistributionsHeader = () => [
		{
			stringId: 'STAKE_DETAILS.DISTRIBUTIONS.TIME',
			label: STRINGS['STAKE_DETAILS.DISTRIBUTIONS.TIME'],
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
			stringId: 'STAKE_DETAILS.DISTRIBUTIONS.TRANSACTION_ID',
			label: STRINGS['STAKE_DETAILS.DISTRIBUTIONS.TRANSACTION_ID'],
			key: 'transactionHash',
			renderCell: ({ transactionHash }, key, index) => {
				return (
					<td key={index}>
						<Transaction id={transactionHash} network={network} />
					</td>
				);
			},
		},
		{
			stringId: 'STAKE_DETAILS.DISTRIBUTIONS.AMOUNT',
			label: STRINGS['STAKE_DETAILS.DISTRIBUTIONS.AMOUNT'],
			key: 'amount',
			renderCell: ({ returnValues: { _amount } }, key, index) => {
				return <td key={index}>{web3.utils.fromWei(_amount)}</td>;
			},
		},
	];

	return (
		<div>
			<div className="d-flex justify-content-between">
				<div>
					<div>
						<div className="bold">
							{STRINGS['STAKE_DETAILS.PUBLIC_INFO.TITLE']}
						</div>
						<div className="secondary-text">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.PUBLIC_INFO.SUBTITLE'],
								fullname,
								token.toUpperCase()
							)}
						</div>
					</div>

					<div className="pt-4">
						<div className="bold">
							{STRINGS['STAKE_DETAILS.PUBLIC_INFO.TOTAL_DISTRIBUTED_EARNINGS']}
						</div>
						<div className="secondary-text">383,001 XHT</div>
					</div>

					<div className="pt-4 d-flex">
						<div>
							<div className="bold">
								{
									STRINGS[
										'STAKE_DETAILS.PUBLIC_INFO.CLEARED_UNDISTRIBUTED_EARNINGS'
									]
								}
							</div>
							<div className="secondary-text">31,000 XHT</div>
						</div>
						<div className="secondary-text px-4">|</div>
						<div>
							<div className="bold">
								{
									STRINGS[
										'STAKE_DETAILS.PUBLIC_INFO.UNCLEARED_PENDING_EARNINGS'
									]
								}
							</div>
							<div className="secondary-text">13,000 XHT</div>
						</div>
					</div>

					<div className="pt-4">
						<div className="bold">
							{STRINGS['STAKE_DETAILS.PUBLIC_INFO.TOTAL_STAKED']}
						</div>
						<div className="secondary-text">3,213,321 XHT</div>
					</div>

					<div className="pt-4">
						<div className="bold">
							{STRINGS['STAKE_DETAILS.PUBLIC_INFO.REWARD_RATE']}
						</div>
						<div className="secondary-text">
							{STRINGS['STAKE_DETAILS.PUBLIC_INFO.VARIABLE']}
						</div>
					</div>
				</div>
				<div>
					<div>
						<DonutChart />
					</div>

					<div className="pt-4">
						<div className="d-flex align-center">
							<div className="stake-chart-legend mine" />
							<div className="bold">
								{STRINGS.formatString(
									STRINGS['STAKE_DETAILS.PUBLIC_INFO.MY_STAKE'],
									25
								)}
							</div>
						</div>
						<div className="secondary-text ml-4 pl-3">3,213,321 XHT</div>
					</div>

					<div className="pt-4">
						<div className="d-flex align-center">
							<div className="stake-chart-legend others" />
							<div className="bold">
								{STRINGS.formatString(
									STRINGS['STAKE_DETAILS.PUBLIC_INFO.OTHER_STAKE'],
									75
								)}
							</div>
						</div>
						<div className="d-flex ml-4 pl-3">
							<div className="secondary-text">3,213,321 XHT</div>
							<div className="pl-2">
								(
								<span
									className="blue-link underline-text pointer"
									onClick={() => setActiveTab(TABS.MY_STAKING.key)}
								>
									<EditWrapper stringId="STAKE_DETAILS.VIEW">
										{STRINGS['STAKE_DETAILS.VIEW']}
									</EditWrapper>
								</span>
								)
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bold">
				<EditWrapper stringId="STAKE_DETAILS.MY_STAKING.EVENTS_TITLE">
					{STRINGS['STAKE_DETAILS.MY_STAKING.EVENTS_TITLE']}
				</EditWrapper>
			</div>
			<div>
				<Table
					className="transactions-history-table"
					data={distributions}
					count={distributions.length}
					headers={generateDistributionsHeader()}
					withIcon={false}
					pageSize={TABLE_PAGE_SIZE}
					rowKey={(data) => {
						return data.id;
					}}
					title={STRINGS['STAKE_DETAILS.MY_STAKING.EVENTS_TITLE']}
					handleNext={() => {}}
					jumpToPage={0}
					displayPaginator={false}
				/>
			</div>
			{distributions.length !== 0 && (
				<div className="d-flex content-center">
					<div
						className="blue-link underline-text pointer"
						onClick={() => setActiveTab(TABS.DISTRIBUTIONS.key)}
					>
						<EditWrapper stringId="STAKE_DETAILS.VIEW_MORE">
							{STRINGS['STAKE_DETAILS.VIEW_MORE']}
						</EditWrapper>
					</div>
				</div>
			)}
		</div>
	);
};

const mapStateToProps = (store) => ({
	network: store.stake.network,
	currentBlock: store.stake.currentBlock,
});

export default connect(mapStateToProps)(PublicInfo);
