import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import TradeBlock from './components/TradeBlock';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import MobileDropdownWrapper from './components/MobileDropdownWrapper';
import STRINGS from '../../config/localizedStrings';

const MobileTrade = ({
	orderbookReady,
	asks,
	bids,
	balance,
	onSubmitOrder,
	openCheckOrder,
	onRiskyTrade,
	marketPrice,
	settings,
	orderbookProps,
	symbol,
	goToPair,
	pair
}) => (
	<div
		className={classnames(
			'flex-row',
			'd-flex',
			'justify-content-between',
			'f-1',
			'apply_rtl'
		)}
	>
		<TradeBlock
			title={''}
			className="p-relative order-book flex-column"
			alignChildY={true}
		>
			<MobileDropdownWrapper goToPair={goToPair} />
			<Link className={classnames('blue-link', 'mb-2', 'caps')} to={`/quick-trade/${pair}`}>
				{STRINGS.QUICK_TRADE_MODE}
			</Link>
			<OrderEntry
				submitOrder={onSubmitOrder}
				openCheckOrder={openCheckOrder}
				onRiskyTrade={onRiskyTrade}
				symbol={symbol}
				balance={balance}
				asks={asks}
				bids={bids}
				marketPrice={marketPrice}
				showPopup={settings.orderConfirmationPopup}
			/>
		</TradeBlock>
		<TradeBlock title={STRINGS.ORDERBOOK} className="order-entry">
			{orderbookReady && <Orderbook {...orderbookProps} />}
		</TradeBlock>
	</div>
);

export default MobileTrade;
