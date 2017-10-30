import React from 'react';
import classnames from 'classnames';

import { Table } from '../../../components';
import { formatTimestamp } from '../../../utils/utils';
import { formatFiatAmount, formatBtcAmount } from '../../../utils/currency';

import { generateTradeHeaders } from '../../TransactionsHistory/utils';

const ActiveOrders = ({ trades, symbol }) => {
  const headers = generateTradeHeaders(symbol);
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
}

ActiveOrders.defaultProps = {
  trades: [],
  symbol: 'btc',
}
export default ActiveOrders;
