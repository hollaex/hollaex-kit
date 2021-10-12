import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table } from 'components';
import { getDistributions } from 'actions/stakingActions';
import STRINGS from 'config/localizedStrings';
import { calculateEsimatedDate } from 'utils/eth';
import Transaction from './Transaction';

const TABLE_PAGE_SIZE = 10;

const Distributions = ({ token, account, currentBlock }) => {
	const [distributions, setDistributions] = useState([]);
	useEffect(() => {
		getDistributions(token)(account).then((response) =>
			setDistributions(response)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateDistributionsHeader = () => [
		{
			stringId: 'STAKE_DETAILS.DISTRIBUTIONS.TIME',
			label: STRINGS['STAKE_DETAILS.DISTRIBUTIONS.TIME'],
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
			stringId: 'STAKE_DETAILS.DISTRIBUTIONS.TRANSACTION_ID',
			label: STRINGS['STAKE_DETAILS.DISTRIBUTIONS.TRANSACTION_ID'],
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
			stringId: 'STAKE_DETAILS.DISTRIBUTIONS.AMOUNT',
			label: STRINGS['STAKE_DETAILS.DISTRIBUTIONS.AMOUNT'],
			key: 'amount',
			renderCell: ({ amount }, key, index) => {
				return <td key={index}>{amount}</td>;
			},
		},
	];

	return (
		<div>
			<div className="d-flex">
				<div>
					<div>
						<div className="bold">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.DISTRIBUTIONS.TITLE'],
								token.toUpperCase()
							)}
						</div>
						<div className="secondary-text">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.DISTRIBUTIONS.SUBTITLE'],
								token.toUpperCase()
							)}
						</div>
					</div>
				</div>
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
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	account: store.stake.account,
	currentBlock: store.stake.currentBlock,
});

export default connect(mapStateToProps)(Distributions);
