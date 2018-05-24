import React, { Component } from 'react';
import classnames from 'classnames';
import TradeBlock from './components/TradeBlock';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import MobileDropdownWrapper from './components/MobileDropdownWrapper';
import STRINGS from '../../config/localizedStrings';

class MobileTrade extends Component {
	render() {
		const {
			asks,
			bids,
			balance,
			marketPrice,
			settings,
			onSubmitOrder,
			openCheckOrder,
			orderbookReady,
			orderbookProps,
			symbol,
			goToPair
		} = this.props;

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
				<TradeBlock title={STRINGS.ORDER_ENTRY} className="p-relative">
					<MobileDropdownWrapper goToPair={goToPair} />
					<OrderEntry
						submitOrder={onSubmitOrder}
						openCheckOrder={openCheckOrder}
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
	}
}

export default MobileTrade;
