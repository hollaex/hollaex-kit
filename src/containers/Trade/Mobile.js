import React from 'react';
import classnames from 'classnames';
import TradeBlock from './components/TradeBlock';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import STRINGS from '../../config/localizedStrings';

export const Mobile = ({ props, orderbookProps, symbol }) => {
	const {
		pair,
		pairData,
		tradeHistory,
		orderbookReady,
		asks,
		bids,
		activeOrders,
		userTrades,
		cancelOrder,
		cancelAllOrders,
		balance,
		marketPrice,
		activeLanguage,
		activeTheme,
		settings
	} = props;
	return (
		<div
			className={classnames(
				'flex-row',
				'd-flex',
				'justify-content-between',
				'f-1',
				'apply_rtl'
			)}
		>
			<TradeBlock title={STRINGS.ORDER_ENTRY}>
				<OrderEntry
					submitOrder={this.onSubmitOrder}
					openCheckOrder={this.openCheckOrder}
					symbol={symbol}
					balance={balance}
					asks={asks}
					bids={bids}
					marketPrice={marketPrice}
					showPopup={settings.orderConfirmationPopup}
				/>
			</TradeBlock>
			<TradeBlock title={STRINGS.ORDERBOOK}>
				{orderbookReady && <Orderbook {...orderbookProps} />}
			</TradeBlock>
		</div>
	);
};
