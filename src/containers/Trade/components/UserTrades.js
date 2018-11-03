import React from 'react';

import { Table } from '../../../components';
import {
	generateTradeHeaders,
	generateLessTradeHeaders
} from '../../TransactionsHistory/utils';

const ActiveOrders = ({ trades, pairData, pair, pairs, lessHeaders }) => {
	const headers = lessHeaders
		? generateLessTradeHeaders(pairData.pair_base, pairs)
		: generateTradeHeaders(pairData.pair_base, pairs);
	if (!pair) {
		return <div />;
	}
	return (
		<div className="trade_active_orders-wrapper">
			<Table
				headers={headers}
				data={trades}
				count={trades.length}
				pageSize={5}
				displayPaginator={false}
			/>
		</div>
	);
};

ActiveOrders.defaultProps = {
	trades: [],
	pair: '',
	pairData: {},
	pairs: {}
};
export default ActiveOrders;
