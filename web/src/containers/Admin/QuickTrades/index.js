import React from 'react';
import QuickTradesList from '../QuickTradesList';
import './index.scss';

const ExchangeTradesContainer = () => {
	return (
		<div className="trade-order">
			<div style={{ fontSize: '18px' }}>Trades</div>
			<div className="mb-4">List of trades on your exchange</div>
			<QuickTradesList getThisExchangeOrder={true} />
		</div>
	);
};

export default ExchangeTradesContainer;
