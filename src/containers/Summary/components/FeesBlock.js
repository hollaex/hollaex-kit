import React from 'react';

import { CurrencyBall } from '../../../components';
import STRINGS from '../../../config/localizedStrings';
import { formatPercentage } from '../../../utils/currency';

const getMakerRow = (pairs, pair, level, index) => {
    const { pair_base, pair_2, maker_fees } = pairs[pair];
    const feeData = maker_fees ? maker_fees[level] : 0;
    return (
        <tr key={index}>
            <td className="account-limits-coin" rowSpan={2}>
                <div className='d-flex align-items-center'>
                    <CurrencyBall name={STRINGS[`${pair_base.toUpperCase()}_SHORTNAME`]} symbol={pair_base} size='m' />
                    <div className="ml-2">
                        {`${STRINGS[`${pair_base.toUpperCase()}_FULLNAME`]} / ${STRINGS[`${pair_2.toUpperCase()}_FULLNAME`]}`}
                    </div>
                </div>
            </td>
            <td className="account-limits-maker account-limits-status">{STRINGS.SUMMARY.MAKER}:</td>
            <td className="account-limits-maker account-limits-value">{formatPercentage(feeData)}</td>
        </tr>
    );
}

const getTakerRow = (pairs, pair, level, index) => {
    const { taker_fees } = pairs[pair];
    const feeData = taker_fees ? taker_fees[level] : 0;
    return (
        <tr key={`${index}_1`}>
            <td className="account-limits-taker account-limits-status">{STRINGS.SUMMARY.TAKER}:</td>
            <td className="account-limits-taker account-limits-value">{formatPercentage(feeData)}</td>
        </tr>
    );
}

const getRows = (pairs, level) => {
    const rowData = [];
    Object.keys(pairs).map((pair, index) => {
        rowData.push(getMakerRow(pairs, pair, level, index));
        rowData.push(getTakerRow(pairs, pair, level, index));
        return '';
    });
    return rowData;
};

const FeesBlock = ({ pairs, level }) => {
    return (
        <div>
            <table className="account-limits">
                <thead>
                    <tr>
                        <th className="limit-head-currency">{STRINGS.CURRENCY}</th>
                        <th></th>
                        <th className="limit-head">{STRINGS.FEES}</th>
                    </tr>
                </thead>
                <tbody className="account-limits-content font-weight-bold">
                    {getRows(pairs, level)}
                </tbody>
            </table>
        </div>
    );
};

export default FeesBlock;