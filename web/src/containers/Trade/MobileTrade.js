import React from 'react';
import classnames from 'classnames';
// import { Link } from 'react-router';
import TradeBlock from './components/TradeBlock';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import STRINGS from '../../config/localizedStrings';

const MobileTrade = ({
	orderbookReady,
	fees,
	balance,
	onSubmitOrder,
	openCheckOrder,
	onRiskyTrade,
	settings,
	orderbookProps,
	symbol,
	setPriceRef,
	setSizeRef,
}) => {
	return (
		<div
			className={classnames(
				'flex-row',
				'd-flex',
				'justify-content-between',
				'f-1',
				'apply_rtl',
				'w-100'
			)}
		>
			<TradeBlock
				title={''}
				className="p-relative order-book flex-column w-50"
				alignChildY={true}
			>
				{/* <Link className={classnames('blue-link', 'mb-2', 'caps')} to={`/quick-trade/${pair}`}>
				{STRINGS["QUICK_TRADE_MODE"]}
			</Link> */}
				<OrderEntry
					submitOrder={onSubmitOrder}
					openCheckOrder={openCheckOrder}
					onRiskyTrade={onRiskyTrade}
					symbol={symbol}
					balance={balance}
					fees={fees}
					showPopup={settings.orderConfirmationPopup}
					setPriceRef={setPriceRef}
					setSizeRef={setSizeRef}
				/>
			</TradeBlock>
			<TradeBlock title={STRINGS['ORDERBOOK']} className="order-entry w-50">
				{orderbookReady && <Orderbook {...orderbookProps} />}
			</TradeBlock>
		</div>
	);
};

export default MobileTrade;
