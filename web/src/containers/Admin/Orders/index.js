import React from 'react';
import ActiveOrders from '../ActiveOrders';
import './index.css';

const ExchangeOrdersContainer = ({ user }) => {
	return (
		<div className="trade-order">
			<div style={{ fontSize: '18px' }}>Active Orders</div>
			<div className="mb-4">
				List of open orders that are currently active on your exchange
			</div>
			<ActiveOrders getThisExchangeOrder={true} userId={user.id} />
		</div>
	);
};

export default ExchangeOrdersContainer;
