import React, { Component } from 'react';
import { Row, Col, Table, Spin, Button, Tooltip } from 'antd';
import { CSVLink } from 'react-csv';
import { SubmissionError } from 'redux-form';
import Moment from 'react-moment';

import { requestOrders } from './action'
import { formatCurrency } from '../../../utils/index';

const formatDate = (value) => {
	return <Moment format="YYYY/MM/DD HH:mm">{value}</Moment>;
};
const formatNum = (value) => {
	return <div>{formatCurrency(value)}</div>;
};
// export const renderUser = (id) => (
// 	<Tooltip placement="bottom" title={`SEE USER ${id} DETAILS`}>
// 		<Button type="primary">
// 			<Link to={`/admin/user?id=${id}`}>{id}</Link>
// 		</Button>
// 	</Tooltip>
// );
const getColumns = (onCancel) => [
	{ title: 'Side', dataIndex: 'side' },
	{ title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
	{ title: 'Size', dataIndex: 'size', key: 'size', render: formatNum },
	{ title: 'Price', dataIndex: 'price', key: 'price', render: formatNum },
	{ title: 'Filled', dataIndex: 'filled', key: 'filled', render: formatNum },
	{
		title: 'Time',
		dataIndex: 'timestamp',
		key: 'timestamp',
		render: formatDate
	},
	{
		title: 'Cancel order',
		dataIndex: '',
		key: '',
		render: (e) => (
			<Tooltip placement="bottom" title={`Cancel order`}>
				<Button type="primary" onClick={() => onCancel(e)}>
					Cancel
				</Button>
			</Tooltip>
		)
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

class UserOrders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Orders: '',
			loading: true,
			total: 0,
			page: 1,
			pageSize: 10,
			limit: 50,
			currentTablePage: 1,
			isRemaining: true
		};
	}

	componentDidMount = () => {
		if (this.props.userId) {
			this.handleTrades(this.props.userId, this.state.page, this.state.limit);
		}
	};

	handleTrades = (userId, page, limit) => {
		requestOrders(userId, page, limit)
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
			this.handleTrades(this.props.userId, page + 1, limit);
		}
		this.setState({ currentTablePage: count });
	};

	onCancelOrder = (order) => {
		// TODO: need to add cancel order api here
	};

	render() {
		const { Orders, currentTablePage, loading } = this.state;
		if (loading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}
		let COLUMNS = getColumns(this.onCancelOrder);

		return (
			<Row>
				<Row gutter={16} style={{ marginTop: 16 }}>
					<Col>
						<CSVLink
							filename={'user-orders.csv'}
							data={Orders ? Orders : 'NO Data'}
							headers={SCV_COLUMNS}
						>
							Download table
						</CSVLink>
						<Table
							columns={COLUMNS}
							rowKey={(data) => {
								return data.id;
							}}
							dataSource={Orders ? Orders : 'NO Data'}
							pagination={{
								current: currentTablePage,
								onChange: this.pageChange
							}}
						/>
					</Col>
				</Row>
			</Row>
		);
	}
}

export default UserOrders;
