import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { Sortable } from '../Sortable';
import { ICONS, BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../config/constants';
import { formatToCurrency, formatPercentage, formatAverage } from '../../utils/currency';

const Tab = ({ pair = {}, tab, ticker = {}, coins = {}, activePairTab, onTabClick, onTabChange, items, selectedToOpen, selectedToRemove, ...rest }) => {
    const { min, symbol } = coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
    const pairTwo = coins[pair.pair_2 || BASE_CURRENCY] || DEFAULT_COIN_DATA;
    const priceDifference = ticker.open === 0 ? 0 : ((ticker.close || 0) - (ticker.open || 0));
    const tickerPercent = priceDifference === 0 || ticker.open === 0 ? 0 : ((priceDifference / ticker.open) * 100);
    const priceDifferencePercent = isNaN(tickerPercent) ? formatPercentage(0) : formatPercentage(tickerPercent);
    return (
        <div
            className={classnames(
                'app_bar-pair-content',
                'd-flex',
                "justify-content-between",
                'app_bar-pair-tab',
                {
                    'active-tab-pair': activePairTab === tab,
                    'transition_open': selectedToOpen === tab,
                    'transition_close': selectedToRemove === tab
                })}>
            <div
                className='d-flex w-100 h-100 pl-2'
                onClick={() => onTabClick(tab)}
                {...rest}>
                <div className="app_bar-pair-font d-flex align-items-center justify-content-between">
                    <div className="app_bar-currency-txt">
                        {symbol.toUpperCase()}/{pairTwo.symbol.toUpperCase()}:
                    </div>
                    <div className="title-font ml-1">{`${pairTwo.symbol.toUpperCase()} ${formatAverage(formatToCurrency(ticker.close, min))}`}</div>
                    <div className={priceDifference < 0 ? "app-price-diff-down app-bar-price_diff_down" : "app-bar-price_diff_up app-price-diff-up"}>
                        {formatAverage(formatToCurrency(priceDifference, min))}
                    </div>
                    <div
                        className={priceDifference < 0
                            ? "title-font ml-1 app-price-diff-down" : "title-font ml-1 app-price-diff-up"}>
                            {`(${priceDifferencePercent})`}
                    </div>
                </div>
            </div>
            <div className='d-flex align-items-center mx-2' onClick={() => onTabChange(tab)}>
                <ReactSVG
                    path={ICONS.CLOSE_CROSS}
                    wrapperClassName="app-bar-tab-close mr-0" />
            </div>
        </div>
    );
};

export default Sortable(Tab);
