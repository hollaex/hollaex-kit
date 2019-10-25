import React from 'react';

import { CurrencyBall } from '../../../components';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';
import {
    formatBaseAmount,
    formatBtcAmount
} from '../../../utils/currency';

const getLimitValue = (limit = -1, format) => {
    if (limit === 0) {
        return STRINGS.LEVELS.UNLIMITED;
    } else if (limit === -1) {
        return STRINGS.LEVELS.BLOCKED;
    } else {
        return format ? format(limit) : limit;
    }
};

const getDepositRow = (currency, index, coins, level) => {
    const { symbol = '', fullname, deposit_limits = {} } = coins[currency] || DEFAULT_COIN_DATA;
    const format = currency === BASE_CURRENCY ? formatBaseAmount : formatBtcAmount;
    return (
        <tr key={index}>
            <td className="account-limits-coin" rowSpan={2}>
                <div className='d-flex align-items-center'>
                    <CurrencyBall name={symbol.toUpperCase()} symbol={symbol} size='m' />
                    <div className="ml-2">{fullname}</div>
                </div>
            </td>
            <td className="account-limits-maker account-limits-status">{STRINGS.SUMMARY.DEPOSIT}:</td>
            <td className="account-limits-maker account-limits-value">{getLimitValue(deposit_limits[level], format)}</td>
        </tr>
    );
};

const getWithdrawalRow = (currency, index, coins, level) => {
    const { withdrawal_limits = {} } = coins[currency] || DEFAULT_COIN_DATA;
    const format = currency === BASE_CURRENCY ? formatBaseAmount : formatBtcAmount;
    return (
        <tr key={`${index}_1`}>
            <td className="account-limits-taker account-limits-status">{STRINGS.SUMMARY.WITHDRAWAL}:</td>
            <td className="account-limits-taker account-limits-value">{getLimitValue(withdrawal_limits[level], format)}</td>
        </tr>
    );
};


const getRows = (coins, level) => {
    const rowData = [];
    Object.keys(coins).map((currency, index) => {
        rowData.push(getDepositRow(currency, index, coins, level));
        rowData.push(getWithdrawalRow(currency, index, coins, level));
        return '';
    });
    return rowData;
};

const LimitsBlock = ({ level, coins }) => {
    return (
        <div>
            <table className="account-limits">
                <thead>
                    <tr>
                        <th className="limit-head-currency">{STRINGS.CURRENCY}</th>
                        <th></th>
                        <th className="limit-head">{STRINGS.LIMIT}</th>
                    </tr>
                </thead>
                <tbody className="account-limits-content font-weight-bold">
                    {getRows(coins, level)}
                </tbody>
            </table>
        </div>
    );
};

export default LimitsBlock;