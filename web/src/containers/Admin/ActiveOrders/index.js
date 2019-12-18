import React, { Component } from 'react';
import { Tabs, Row, Col, Table, Tooltip, Button } from 'antd';
import { CSVLink } from 'react-csv';
import { SubmissionError } from 'redux-form';
import Moment from 'react-moment';
import { Link } from 'react-router';

import { formatCurrency } from '../../../utils/index';
import { requestActiveOrders } from './action';

const TabPane = Tabs.TabPane;

const formatDate = (value) => {
    return <Moment format="YYYY/MM/DD HH:mm">{value}</Moment>;
};
const formatNum = (value) => {
    return <div>{formatCurrency(value)}</div>;
};

const renderUser = (id) => (
    <Tooltip placement="bottom" title={`SEE USER ${id} DETAILS`}>
        <Button type="primary">
            <Link to={`/admin/user?id=${id}`}>
                {id}
            </Link>
        </Button>
    </Tooltip>
);

const COLUMNS = [
    {
        title: 'User ID',
        dataIndex: 'created_by',
        key: 'id',
        render: (v, data) => renderUser(v, data)
    },
    { title: 'Side', dataIndex: 'side', key: 'side' },
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
    { title: 'Size', dataIndex: 'size', key: 'size', render: formatNum },
    { title: 'Price', dataIndex: 'price', key: 'price', render: formatNum },
    { title: 'Filled', dataIndex: 'filled', key: 'filled', render: formatNum },
    {
        title: 'Time',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: formatDate
    }
];

const SCV_COLUMNS = [
    { label: 'Side', dataIndex: 'side', key: 'side' },
    { label: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
    { label: 'Size', dataIndex: 'size', key: 'size' },
    { label: 'Price', dataIndex: 'price', key: 'price' },
    { label: 'Filled', dataIndex: 'filled', key: 'filled' },
    { label: 'Time', dataIndex: 'updated_at', key: 'updated_at' }
];

class ActiveOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buyOrders: {
                data: [],
                loading: true,
                total: 0,
                page: 1,
                isRemaining: true
            },
            sellOrders: {
                data: [],
                loading: true,
                total: 0,
                page: 1,
                isRemaining: true
            },
            pageSize: 10,
            limit: 50,
            buyCurrentTablePage: 1,
            sellCurrentTablePage: 1,
            activeTab: 'buy'
        };
    }

    componentDidMount() {
        this.handleTrades('buy');
        this.handleTrades('sell');
    }

    handleTrades = (side, page = 1, limit = this.state.limit) => {
        requestActiveOrders({ side, page, limit })
            .then((res) => {
                if (res) {
                    if (side === 'buy') {
                        this.setState({
                            buyOrders: {
                                ...this.state.buyOrders,
                                data: [ ...this.state.buyOrders.data, ...res.data ],
                                loading: false,
                                total: res.count,
                                page: res.page,
                                isRemaining: res.isRemaining
                            }
                        });
                    } else {
                        this.setState({
                            sellOrders: {
                                ...this.state.sellOrders,
                                data: [ ...this.state.sellOrders.data, ...res.data ],
                                loading: false,
                                total: res.count,
                                page: res.page,
                                isRemaining: res.isRemaining
                            }
                        });

                    }
                }
            })
            .catch((err) => {
                if (err.status === 403) {
                    this.setState({ loading: false });
                }
                throw new SubmissionError({ _error: err.data.message });
            });
    };

    pageChange = (count, pageSize) => {
        const { buyOrders = {}, sellOrders = {}, limit } = this.state;
        const pageCount = count % 5 === 0 ? 5 : count % 5;
        const apiPageTemp = Math.floor(count / 5);
        const page = this.state.activeTab === 'buy' ? buyOrders.page : sellOrders.page;
        const isRemaining = this.state.activeTab === 'buy' ? buyOrders.isRemaining : sellOrders.isRemaining;
        if (limit === pageSize * pageCount &&
            apiPageTemp >= page &&
            isRemaining
        ) {
            if (this.state.activeTab === 'buy') {
                this.setState({
                    buyOrders: {
                        ...this.state.buyOrders,
                        loading: true
                    }
                });
                this.handleTrades('buy', buyOrders.page + 1, limit);
            } else {                
                this.setState({
                    sellOrders: {
                        ...this.state.sellOrders,
                        loading: true
                    }
                });
                this.handleTrades('sell', sellOrders.page + 1, limit);
            }
        }
        if (this.state.activeTab === 'buy') {
            this.setState({ buyCurrentTablePage: count });
        } else {
            this.setState({ sellCurrentTablePage: count });
        }
    };

    tabChange = (activeTab) => {
        this.setState({ activeTab });
    };

    render() {
        const {
            buyOrders = {},
            sellOrders = {},
            buyCurrentTablePage,
            sellCurrentTablePage
        } = this.state;

        return (
            <div className="app_container-content" >
                <Tabs onChange={this.tabChange}>
                    <TabPane tab="Bids" key="buy">
                        <Row>
                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col>
                                    <CSVLink
                                        filename={'active-orders-bids.csv'}
                                        data={buyOrders.data}
                                        headers={SCV_COLUMNS}
                                    >
                                        Download table
                                    </CSVLink>
                                    <Table
                                        columns={COLUMNS}
                                        rowKey={(data) => {
                                            return data.id;
                                        }}
                                        dataSource={buyOrders.data}
                                        pagination={{
                                            current: buyCurrentTablePage,
                                            onChange: this.pageChange
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Row>
                    </TabPane>
                    <TabPane tab="Asks" key="sell">
                        <Row>
                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col>
                                    <CSVLink
                                        filename={'active-orders-asks.csv'}
                                        data={sellOrders.data}
                                        headers={SCV_COLUMNS}
                                    >
                                        Download table
                                    </CSVLink>
                                    <Table
                                        columns={COLUMNS}
                                        rowKey={(data) => {
                                            return data.id;
                                        }}
                                        dataSource={sellOrders.data}
                                        pagination={{
                                            current: sellCurrentTablePage,
                                            onChange: this.pageChange
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        );
    };
}

export default ActiveOrders;
