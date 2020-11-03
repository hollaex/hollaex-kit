import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';

import { CurrencyBall } from '../../../components';

const getHeaders = (userTiers) => {
    const headers = [
        {
            title: 'Pairs',
            dataIndex: 'pair_base',
            key: 'pair_base',
            render: (pair_base, { name }) => (
                <div className="d-flex align-items-center">
                    <CurrencyBall symbol={pair_base} name={pair_base} size='m' />
                    <div className="ml-1">{name}</div>
                </div>
            )
        },
        {
            title: 'Fee type',
            dataIndex: 'type',
            key: 'type',
            render: () => (
                <div>
                    <div>
                        Taker
                    </div>
                    <div>
                        Maker
                    </div>
                </div>
            )
        }
    ];
    Object.keys(userTiers).forEach((level) => {
        headers.push({
            title: `Tiers ${level}`, dataIndex: 'deposit_limit', key: 'deposit_limit'
        })
    });
    headers.push({
        title: 'Adjust limit values',
        dataIndex: 'type',
        key: 'type',
        render: () => (
            <div>Adjust limits</div>
        )
    });
    return headers;
}

const Fees = ({ pairs, userTiers }) => {
    const coinsData = Object.keys(pairs).map(key => pairs[key]);
    return (
        <div>
            <div className="d-flex">
                <div>
                    <div className="sub-title">User asset deposit & withdrawal limits</div>
                    <div className="description mx-2">Set the amount allowed to be withdrawn and deposited for each coin on your exchange</div>
                    <div className="description mt-4">All amounts are valued in your set native currency USD. You can change the native currency for your exchange in the general setup page.</div>
                </div>
            </div>
            <div>
                <Table
                    columns={getHeaders(userTiers, pairs)}
                    dataSource={coinsData}
                    bordered
                />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    pairs: state.app.pairs
});

export default connect(mapStateToProps)(Fees);
