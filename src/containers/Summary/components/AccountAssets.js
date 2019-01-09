import React from 'react';
import ReactSVG from 'react-svg';

import { DonutChart } from '../../../components';
import STRINGS from '../../../config/localizedStrings';
import { CURRENCIES, BASE_CURRENCY, ICONS } from '../../../config/constants';
// import { formatAverage } from '../../../utils/currency';

const AccountAssets = ({ chartData = [], totalAssets, balance }) => {
    const baseValue = CURRENCIES[BASE_CURRENCY];
    return (
        <div className="summary-section_2">
            <div className="summary-content-txt assets-description">
                <div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_1}</div>
                <div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_2}</div>
            </div>
            <div className="w-100 donut-container">
                {BASE_CURRENCY && <DonutChart chartData={chartData} />}
            </div>
            <div className="d-flex">
                {chartData.map((value, index) => {
                    const { formatToCurrency } = CURRENCIES[value.symbol];
                    let currencyBalance = formatToCurrency(balance[`${value.symbol}_balance`]);
                    return (
                        <div key={index} className="price-content text-center">
                            <ReactSVG path={ICONS[`${value.shortName.toUpperCase()}_ICON`]} wrapperClassName="coin-price" />
                            <div className="price-text">{value.fullName}:</div>
                            <div className="price-text">
                                {`${STRINGS[`${value.symbol.toUpperCase()}_CURRENCY_SYMBOL`]} ${currencyBalance}`}
                            </div>
                            {value.symbol !== 'fiat' && <div>{`~${value.balanceFormat}`}</div>}
                        </div>
                    )}
                )}
            </div>
            <div className="text-center my-3 title-font">
                <span className="total-assets">
                    {STRINGS.formatString(STRINGS.TOTAL_ASSETS_VALUE, baseValue.fullName, totalAssets)}
                </span>
            </div>
        </div>
    );
}

export default AccountAssets;