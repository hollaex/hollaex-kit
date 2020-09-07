import React, { useState } from 'react';
import classnames from 'classnames';
// import { Link } from 'react-router';
import TradeBlock from './components/TradeBlock';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import MarketSelector from 'components/AppBar/MarketSelector';
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
	goToPair,
	pair,
	setPriceRef,
	setSizeRef,
	goToMarkets
}) => {

  const [isMarketSelectorOpen, setIsMarketSelectorOpen] = useState(false);

  const toggleMarketSelector = () => {
    setIsMarketSelectorOpen(!isMarketSelectorOpen)
  }

  const closeAddTabMenu = () => {
    setIsMarketSelectorOpen(false)
  }

	return(
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
				<div
					className={classnames(
                      'app_bar-pair-content',
                      'd-flex',
                      'justify-content-between',
                      'px-2',
                    )}
				>
					<div
						className="d-flex align-items-center"
						onClick={toggleMarketSelector}
					>
						<span className="pt-2 trade-tab__market-selector">{pair}</span>
						<i className={classnames('arrow small ml-3', (isMarketSelectorOpen ? 'up' : 'down'))}/>
					</div>
                  {
                    isMarketSelectorOpen && (
						<MarketSelector
							triggerId="market-selector"
							onViewMarketsClick={goToMarkets}
							closeAddTabMenu={closeAddTabMenu}
							addTradePairTab={goToPair}
						/>
                    )
                  }
				</div>
              {/* <Link className={classnames('blue-link', 'mb-2', 'caps')} to={`/quick-trade/${pair}`}>
				{STRINGS.QUICK_TRADE_MODE}
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
			<TradeBlock title={STRINGS.ORDERBOOK} className="order-entry">
              {orderbookReady && <Orderbook {...orderbookProps} />}
			</TradeBlock>
		</div>
    )
};

export default MobileTrade;
