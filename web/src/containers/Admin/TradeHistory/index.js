import React, { Component } from 'react';
import { Row, Col, Table, Spin } from 'antd';
import { requestTrades, requestTradesDownload } from './actions';

import { SubmissionError } from 'redux-form';

import { formatCurrency } from '../../../utils/index';
import Moment from 'react-moment';

const INITIAL_STATE = {
	tradeHistory: '',
	loading: true,
	total: 0,
	page: 1,
	pageSize: 10,
	limit: 50,
	currentTablePage: 1,
	isRemaining: true,
};

const formatDate = (value) => {
	return <Moment format="YYYY/MM/DD HH:mm">{value}</Moment>;
};
const formatNum = (value) => {
	return <div>{formatCurrency(value)}</div>;
};

const COLUMNS = [
	{ title: 'Side', dataIndex: 'side', key: 'side' },
	{ title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
	{ title: 'Size', dataIndex: 'size', key: 'size', render: formatNum },
	{ title: 'Price', dataIndex: 'price', key: 'price', render: formatNum },
	{ title: 'Fee', dataIndex: 'fee', key: 'fee', render: formatNum },
	{
		title: 'Time',
		dataIndex: 'timestamp',
		key: 'timestamp',
		render: formatDate,
	},
];

// const SCV_COLUMNS = [
// 	{ label: 'Side', dataIndex: 'side', key: 'side' },
// 	{ label: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
// 	{ label: 'Size', dataIndex: 'size', key: 'size' },
// 	{ label: 'Price', dataIndex: 'price', key: 'price' },
// 	{ label: 'Fee', dataIndex: 'fee', key: 'fee' },
// 	{ label: 'Time', dataIndex: 'timestamp', key: 'timestamp' }
// ];

class TradeHistory extends Component {
	state = INITIAL_STATE;

	componentWillMount = () => {
		if (this.props.userId) {
			this.handleTrades(this.props.userId, this.state.page, this.state.limit);
		}
	};

	handleTrades = (userId, page, limit) => {
		requestTrades(userId, page, limit)
			.then((res) => {
				if (res) {
					this.setState({
						tradeHistory: [...this.state.tradeHistory, ...res.data],
						loading: false,
						total: res.count,
						page: res.page,
						isRemaining: res.isRemaining,
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
			this.handleTrades(this.props.userId, page + 1, limit);
		}
		this.setState({ currentTablePage: count });
	};

	requestTradesDownload = (userId) => {
		return requestTradesDownload({ format: 'csv', userId: userId });
	};

	render() {
		const { tradeHistory, currentTablePage, loading } = this.state;
		if (loading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return (
			<Row>
				<div className="f-1 mt-4 admin-user-container">
					<Col>
						<div>
							<span
								className="pointer"
								onClick={() => this.requestTradesDownload(this.props.userId)}
							>
								Download table
							</span>
						</div>
						<Table
							columns={COLUMNS}
							className="blue-admin-table"
							rowKey={(data, index) => {
								return `${data.symbol}_${index}`;
							}}
							dataSource={tradeHistory ? tradeHistory : 'NO Data'}
							pagination={{
								current: currentTablePage,
								onChange: this.pageChange,
							}}
						/>
					</Col>
				</div>
			</Row>
		);
	}
}

export default TradeHistory;
