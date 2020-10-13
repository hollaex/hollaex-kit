import React from 'react';
import Image from 'components/Image';
import classnames from 'classnames';
import { SortableElement } from 'react-sortable-hoc';
import withConfig from 'components/ConfigProvider/withConfig';

import { BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../config/constants';
import { donutFormatPercentage, formatToCurrency } from '../../utils/currency';

const Tab = SortableElement(({
    pair = {},
    tab,
    ticker = {},
    coins = {},
    activePairTab,
    onTabClick,
    onTabChange,
    items,
    selectedToOpen,
    selectedToRemove,
    sortId,
    icons: ICONS,
    ...rest
}) => {
    const { symbol } = coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
    const pairTwo = coins[pair.pair_2 || BASE_CURRENCY] || DEFAULT_COIN_DATA;
    const { increment_price } = pair;
    const priceDifference = ticker.open === 0 ? 0 : ((ticker.close || 0) - (ticker.open || 0));
    const tickerPercent = priceDifference === 0 || ticker.open === 0 ? 0 : ((priceDifference / ticker.open) * 100);
    const priceDifferencePercent = isNaN(tickerPercent)
            ? donutFormatPercentage(0)
            : donutFormatPercentage(tickerPercent);
    return (
        <div
            id={`trade-tab-${sortId}`}
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
                onClick={() => onTabClick(tab)}>
                <div className="app_bar-pair-font d-flex align-items-center justify-content-between">
                    <div className="app_bar-currency-txt">
                        {symbol.toUpperCase()}/{pairTwo.symbol.toUpperCase()}:
                    </div>
                    <div className="title-font ml-1">
                        {formatToCurrency(ticker.close, increment_price)}
                    </div>
                    <div
                        className={
                            priceDifference < 0
                                ? "app-price-diff-down app-bar-price_diff_down"
                                : "app-bar-price_diff_up app-price-diff-up"
                        }>
                        {/* {formatAverage(formatToCurrency(priceDifference, increment_price))} */}
                    </div>
                    <div
                        className={priceDifference < 0
                            ? "title-font app-price-diff-down" : "title-font app-price-diff-up"}>
                            {priceDifferencePercent}
                    </div>
                </div>
            </div>
            <div className='d-flex align-items-center mx-2' onClick={() => onTabChange(tab)}>
                <Image
                    iconId="CLOSE_CROSS"
                    icon={ICONS["CLOSE_CROSS"]}
                    wrapperClassName="app-bar-tab-close mr-0"
                />
            </div>
        </div>
    );
});

export default withConfig(Tab);
