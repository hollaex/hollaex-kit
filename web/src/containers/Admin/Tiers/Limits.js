import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';

import { CurrencyBall } from '../../../components';

const getHeaders = (userTiers) => {
    const headers = [
        {
            title: 'Asset',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (symbol, { fullname }) => (
                <div className="d-flex align-items-center">
                    <CurrencyBall symbol={symbol} name={symbol} size='m' />
                    <div className="ml-1">{fullname}</div>
                </div>
            )
        },
        {
            title: 'Limit type',
            dataIndex: 'type',
            key: 'type',
            render: () => (
                <div>
                    <div>
                        Deposit
                    </div>
                    <div>
                        Withdraw
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

const Limits = ({ coins, userTiers }) => {
    const coinsData = Object.keys(coins).map(key => coins[key]);
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
                    columns={getHeaders(userTiers, coins)}
                    dataSource={coinsData}
                    bordered
                />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    coins: state.app.coins
});

export default connect(mapStateToProps)(Limits);
