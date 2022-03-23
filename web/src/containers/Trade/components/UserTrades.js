import React from 'react';

import { Table } from 'components';
import { generateRecentTradeHeaders } from 'containers/TransactionsHistory/utils';
import STRINGS from 'config/localizedStrings';

const RecentTrades = ({
	trades,
	pairData,
	pairs,
	/*lessHeaders,*/
	pageSize,
	coins,
	discount,
	prices,
	icons,
	isLoading,
}) => {
	const headers = generateRecentTradeHeaders(
		pairData.pair_base,
		pairs,
		coins,
		discount,
		prices,
		icons
	);

	return (
		<div className="trade_active_orders-wrapper">
			<Table
				noData={isLoading && STRINGS['LOADING']}
				headers={headers}
				data={trades}
				count={trades.length}
				pageSize={pageSize ? pageSize : 50}
				displayPaginator={false}
				rowKey={(data) => {
					return data.id;
				}}
				cssTransitionClassName="general-record"
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
