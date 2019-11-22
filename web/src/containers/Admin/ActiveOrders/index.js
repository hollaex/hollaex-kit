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
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: formatDate
    }
];

const SCV_COLUMNS = [
    { label: 'Side', dataIndex: 'side', key: 'side' },
    { label: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
    { label: 'Size', dataIndex: 'size', key: 'size' },
    { label: 'Price', dataIndex: 'price', key: 'price' },
    { label: 'Filled', dataIndex: 'filled', key: 'filled' },
    { label: 'Time', dataIndex: 'timestamp', key: 'timestamp' }
];

class ActiveOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Orders: [],
            loading: true,
            total: 0,
            page: 0,
            pageSize: 10,
            limit: 50,
            currentTablePage: 1,
            isRemaining: true
        };
    }

    componentDidMount() {
        this.handleTrades();
    }

    handleTrades = () => {
        requestActiveOrders()
            .then((res) => {
                if (res) {
                    this.setState({
                        Orders: [...this.state.Orders, ...res.data],
                        loading: false,
                        total: res.count,
                        page: res.page,
                        isRemaining: res.isRemaining
                    });
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
        const { page, limit, isRemaining } = this.state;
        const pageCount = count % 5 === 0 ? 5 : count % 5;
        const apiPageTemp = Math.floor(count / 5);
        if (
            this.props.userId &&
            limit === pageSize * pageCount &&
            apiPageTemp >= page &&
            isRemaining
        ) {
            this.setState({ loading: true });
        }
        this.setState({ currentTablePage: count });
    };

    render() {
        const {
            Orders,
            // currentTablePage
        } = this.state;

        const Bids = Orders.filter(Bids => Bids.side === 'buy');
        const Asks = Orders.filter(asks => asks.side === 'sell');

        return (
            <div className="app_container-content" >
                <Tabs>
                    <TabPane tab="Bids" key="transactions">
                        <Row>
                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col>
                                    <CSVLink
                                        filename={'active-orders-bids.csv'}
                                        data={Bids}
                                        headers={SCV_COLUMNS}
                                    >
                                        Download table
                                    </CSVLink>
                                    <Table
                                        columns={COLUMNS}
                                        rowKey={(data) => {
                                            return data.id;
                                        }}
                                        dataSource={Bids}
                                        // pagination={{
                                        //     current: currentTablePage,
                                        //     onChange: this.pageChange
                                        // }}
                                    />
                                </Col>
                            </Row>
                        </Row>
                    </TabPane>
                    <TabPane tab="Asks" key="validate">
                        <Row>
                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col>
                                    <CSVLink
                                        filename={'active-orders-asks.csv'}
                                        data={Asks}
                                        headers={SCV_COLUMNS}
                                    >
                                        Download table
                                    </CSVLink>
                                    <Table
                                        columns={COLUMNS}
                                        rowKey={(data) => {
                                            return data.id;
                                        }}
                                        dataSource={Asks}
                                        // pagination={{
                                        //     current: currentTablePage,
                                        //     onChange: this.pageChange
                                        // }}
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
