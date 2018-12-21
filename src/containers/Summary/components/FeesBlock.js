import React from 'react';

import { CurrencyBall } from '../../../components';
import STRINGS from '../../../config/localizedStrings';
import { formatPercentage } from '../../../utils/currency';

const getMakerRow = (data, pair, pairs, index) => {
    const { pair_base, pair_2 } = pairs[pair];
    const { maker_fees } = data[pair];
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
            <td className="account-limits-maker account-limits-value">{formatPercentage(maker_fees)}</td>
        </tr>
    );
}

const getTakerRow = (data, pair, index) => {
    const { taker_fees } = data[pair];
    return (
        <tr key={`${index}_1`}>
            <td className="account-limits-taker account-limits-status">{STRINGS.SUMMARY.TAKER}:</td>
            <td className="account-limits-taker account-limits-value">{formatPercentage(taker_fees)}</td>
        </tr>
    );
}

const getRows = (data, pairs) => {
    const rowData = [];
    Object.keys(data).map((pair, index) => {
        rowData.push(getMakerRow(data, pair, pairs, index));
        rowData.push(getTakerRow(data, pair, index));
    });
    return rowData;
};

const generateRowData = ({ fees, level }) => {
    let levelData = {};
    Object.keys(fees).map(key => {
        const temp = fees[key];
        levelData[key] = {
            taker_fees: temp.taker_fees[level],
            maker_fees: temp.maker_fees[level]
        };
    });
    return levelData;
};

const FeesBlock = ({ fees, level, pairs }) => {
    const data = generateRowData({ fees, level });
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
                    {getRows(data, pairs)}
                </tbody>
            </table>
        </div>
    );
};

export default FeesBlock;