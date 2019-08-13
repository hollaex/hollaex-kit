import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { DonutChart } from '../../../components';
import STRINGS from '../../../config/localizedStrings';
import { BASE_CURRENCY, ICONS, FLEX_CENTER_CLASSES } from '../../../config/constants';
import { formatAverage, formatToCurrency } from '../../../utils/currency';

const AccountAssets = ({ chartData = [], totalAssets, balance, coins }) => {
    const baseValue = coins[BASE_CURRENCY] || { symbol: 'eur' };
    return (
        <div>
            <div className="summary-content-txt assets-description">
                <div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_1}</div>
            </div>
            <div className="d-flex align-items-center justify-content-center">
                <div className="w-50">
                    <div className="w-100 donut-container">
                        {BASE_CURRENCY && <DonutChart chartData={chartData} />}
                    </div>
                    <div className="d-flex justify-content-center flex-wrap">
                        {chartData.map((value, index) => {
                            const { min } = coins[value.symbol || BASE_CURRENCY] || {};
                            let currencyBalance = formatToCurrency(balance[`${value.symbol}_balance`], min);
                            return (
                                <div key={index} className="price-content text-center">
                                    <div className={classnames("coin-price-container", FLEX_CENTER_CLASSES)}>
                                        <ReactSVG path={ICONS[`${value.symbol.toUpperCase()}_ICON`]} wrapperClassName="coin-price" />
                                    </div>
                                    <div className="price-text">{STRINGS[`${value.symbol.toUpperCase()}_FULLNAME`]}:</div>
                                    <div className="price-text">
                                        {`${STRINGS[`${value.symbol.toUpperCase()}_CURRENCY_SYMBOL`]} ${formatAverage(currencyBalance)}`}
                                    </div>
                                    {value.symbol !== BASE_CURRENCY && <div>{`~${formatAverage(value.balanceFormat)}`}</div>}
                                </div>
                            )}
                        )}
                    </div>
                    {/* <div className="text-center my-3 title-font">
                        <span className="total-assets">
                            {STRINGS.formatString(STRINGS.TOTAL_ASSETS_VALUE, STRINGS[`${baseValue.symbol.toUpperCase()}_FULLNAME`], totalAssets)}
                        </span>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default AccountAssets;