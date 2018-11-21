import React from 'react';

import { CurrencyBall } from '../../../components';
import { CURRENCIES } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';
import {
    formatFiatAmount,
    formatBtcAmount
} from '../../../utils/currency';

const FIAT = CURRENCIES.fiat.symbol;

const getLimitValue = (limit = -1, format) => {
    if (limit === 0) {
        return STRINGS.LEVELS.UNLIMITED;
    } else if (limit === -1) {
        return STRINGS.LEVELS.BLOCKED;
    } else {
        return format ? format(limit) : limit;
    }
};

const getDepositRow = (data, currency, index) => {
    const { symbol, shortName, fullName } = CURRENCIES[currency];
    const format = currency === FIAT ? formatFiatAmount : formatBtcAmount;
    return (
        <tr key={index}>
            <td className="account-limits-coin" rowSpan={2}>
                <div className='d-flex align-items-center'>
                    <CurrencyBall name={shortName} symbol={symbol} />
                    <div className="ml-2">{fullName}</div>
                </div>
            </td>
            <td className="account-limits-status">{STRINGS.SUMMARY.DEPOSIT}:</td>
            <td className="account-limits-value">{getLimitValue(data[`${symbol}_deposit_daily`], format)}</td>
        </tr>
    );
};

const getWithdrawalRow = (data, currency, index) => {
    const format = currency === FIAT ? formatFiatAmount : formatBtcAmount;
    return (
        <tr key={`${index}_1`}>
            <td className="account-limits-status">{STRINGS.SUMMARY.WITHDRAWAL}:</td>
            <td className="account-limits-value">{getLimitValue(data[`${currency}_withdrawal_daily`], format)}</td>
        </tr>
    );
};

const getRows = (data) => {
    const rowData = [];
    Object.keys(CURRENCIES).map((currency, index) => {
        rowData.push(getDepositRow(data, currency, index));
        rowData.push(getWithdrawalRow(data, currency, index));
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

const LimitsBlock = ({ limits, level }) => {
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
                <tbody className="font-weight-bold">
                    {getRows(data)}
                </tbody>
            </table>
        </div>
    );
};

export default LimitsBlock;