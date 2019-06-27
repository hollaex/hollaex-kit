import React from 'react';

import { Table } from '../../../components';
import {
	generateTradeHeaders,
	generateLessTradeHeaders
} from '../../TransactionsHistory/utils';

const ActiveOrders = ({ trades, pairData, pair, pairs, lessHeaders, pageSize, coins }) => {
	const headers = lessHeaders
		? generateLessTradeHeaders(pairData.pair_base, pairs, coins)
		: generateTradeHeaders(pairData.pair_base, pairs, coins);
	if (!pair) {
		return <div />;
	}
	return (
		<div className="trade_active_orders-wrapper">
			<Table
				headers={headers}
				data={trades}
				count={trades.length}
				pageSize={pageSize	? pageSize : 50}
				displayPaginator={false}
			/>
		</div>
	);
};

ActiveOrders.defaultProps = {
	trades: [],
	pair: '',
	pairData: {},
	pairs: {},
	coins: {}
};
export default ActiveOrders;
