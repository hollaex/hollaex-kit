import React from 'react';

import { Table } from 'components';
import { generateRecentTradeHeaders } from 'containers/TransactionsHistory/utils';

const RecentTrades = ({
	trades,
	pairData,
	pair,
	pairs,
	/*lessHeaders,*/
	pageSize,
	coins,
	discount,
	prices,
	icons,
}) => {
	const headers = generateRecentTradeHeaders(
		pairData.pair_base,
		pairs,
		coins,
		discount,
		prices,
		icons
	);
	if (!pair) {
		return <div />;
	}
	return (
		<div className="trade_active_orders-wrapper">
			<Table
				headers={headers}
				data={trades}
				count={trades.length}
				pageSize={pageSize ? pageSize : 50}
				displayPaginator={false}
				rowKey={(data) => {
					return data.id;
				}}
			/>
		</div>
	);
};

RecentTrades.defaultProps = {
	trades: [],
	pair: '',
	pairData: {},
	pairs: {},
	coins: {},
};
export default RecentTrades;
