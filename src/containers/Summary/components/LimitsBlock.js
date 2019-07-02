import React from 'react';

import { CurrencyBall } from '../../../components';
import { BASE_CURRENCY } from '../../../config/constants';
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

const getDepositRow = (data, currency, index, coins) => {
    const { symbol } = coins[currency] || {};
    const format = currency === BASE_CURRENCY ? formatBaseAmount : formatBtcAmount;
    return (
        <tr key={index}>
            <td className="account-limits-coin" rowSpan={2}>
                <div className='d-flex align-items-center'>
                    <CurrencyBall name={STRINGS[`${symbol.toUpperCase()}_SHORTNAME`]} symbol={symbol} size='m' />
                    <div className="ml-2">{STRINGS[`${symbol.toUpperCase()}_FULLNAME`]}</div>
                </div>
            </td>
            <td className="account-limits-maker account-limits-status">{STRINGS.SUMMARY.DEPOSIT}:</td>
            <td className="account-limits-maker account-limits-value">{getLimitValue(data[`${symbol}_deposit_daily`], format)}</td>
        </tr>
    );
};

const getWithdrawalRow = (data, currency, index) => {
    const format = currency === BASE_CURRENCY ? formatBaseAmount : formatBtcAmount;
    return (
        <tr key={`${index}_1`}>
            <td className="account-limits-taker account-limits-status">{STRINGS.SUMMARY.WITHDRAWAL}:</td>
            <td className="account-limits-taker account-limits-value">{getLimitValue(data[`${currency}_withdraw_daily`], format)}</td>
        </tr>
    );
};

const getRows = (data, coins) => {
    const rowData = [];
    Object.keys(coins).map((currency, index) => {
        rowData.push(getDepositRow(data, currency, index, coins));
        rowData.push(getWithdrawalRow(data, currency, index, coins));
        return '';
    });
    return rowData;
};

const generateRowData = ({limits, level}) => {
    let levelData = {};
    limits.map(data => {
        if (data.verification_level === level)
            levelData = data;
        return data;
    });

    return levelData;
};

const LimitsBlock = ({ limits = [], level, coins }) => {
    const data = generateRowData({ limits, level });
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
                    {getRows(data, coins)}
                </tbody>
            </table>
        </div>
    );
};

export default LimitsBlock;