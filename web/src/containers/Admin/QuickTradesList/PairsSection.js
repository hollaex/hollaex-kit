import React, { Component } from 'react';
import { Row, Col, Table, Tooltip, Button, Spin } from 'antd';
import Moment from 'react-moment';
import { Link } from 'react-router';

import { formatCurrency } from '../../../utils/index';
import { requestActiveOrders, requestCancelOrders } from './action';

const formatDate = (value) => {
	return <Moment format="YYYY/MM/DD HH:mm">{value}</Moment>;
};
const formatNum = (value) => {
	return <div>{formatCurrency(value)}</div>;
};

const renderUser = (id) => (
	<Tooltip placement="bottom" title={`SEE USER ${id} DETAILS`}>
		<Button type="primary">
			<Link to={`/admin/user?id=${id}`}>{id}</Link>
		</Button>
	</Tooltip>
);

// const renderExchangeUser = (user) => (
// 	<div className="exchange-user-wrapper">
// 		<Tooltip placement="bottom" title={`SEE USER ${user?.id} DETAILS`}>
// 			<Button type="primary">
// 				<Link to={`/admin/user?id=${user?.id}`}>{user?.id}</Link>
// 			</Button>
// 		</Tooltip>
// 		<p className="pl-3 mb-0">{user?.email}</p>
// 	</div>
// );

const getColumns = (userId, onCancel) => {
	let columns = [];
	if (!userId) {
		columns = [
			{
				title: 'User ID',
				dataIndex: 'created_by',
				key: 'id',
				render: (v, data) => renderUser(v, data),
			},
		];
	}
	columns = [
		...columns,
		{ title: 'Side', dataIndex: 'side', key: 'side' },
		{ title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
		{ title: 'Size', dataIndex: 'size', key: 'size', render: formatNum },
		{ title: 'Price', dataIndex: 'price', key: 'price', render: formatNum },
		{
			title: 'Time',
			dataIndex: 'timestamp',
			key: 'timestamp',
			render: formatDate,
		},
	];
	if (userId) {
		columns = [...columns];
	}
	return columns;
};

const getThisExchangeOrders = (onCancel) => {
	let columns = [];

	columns = [
		{ title: 'Side', dataIndex: 'side', key: 'side' },
		{ title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
		{ title: 'Size', dataIndex: 'size', key: 'size', render: formatNum },
		{ title: 'Price', dataIndex: 'price', key: 'price', render: formatNum },
		{
			title: 'Time',
			dataIndex: 'timestamp',
			key: 'timestamp',
			render: formatDate,
		},
		{
			title: 'Maker ID',
			dataIndex: 'maker_id',
			key: 'maker_id',
			render: (v, data) => (
				<div>
					{data?.maker_id ? (
						<Button type="primary">
							<Link to={`/admin/user?id=${data?.maker_id}`}>
								{data?.maker_id}
							</Link>
						</Button>
					) : (
						'-'
					)}
				</div>
			),
		},
		{
			title: 'Taker ID',
			dataIndex: 'taker_id',
			key: 'taker_id',
			render: (v, data) => (
				<div>
					{data?.taker_id ? (
						<Button type="primary">
							<Link to={`/admin/user?id=${data?.taker_id}`}>
								{data?.taker_id}
							</Link>
						</Button>
					) : (
						'-'
					)}
				</div>
			),
		},
	];

	return columns;
};

class PairsSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			buyOrders: {
				data: [],
				loading: true,
				total: 0,
				page: 1,
				isRemaining: true,
			},
			sellOrders: {
				data: [],
				loading: true,
				total: 0,
				page: 1,
				isRemaining: true,
			},
			pageSize: 10,
			limit: 50,
			buyCurrentTablePage: 1,
			sellCurrentTablePage: 1,
			activeTab: 'buy',
		};
	}

	componentDidMount() {
		this.handleTrades();
	}

	componentDidUpdate(prevProps, prevState) {
		const { open, pair } = this.props;
		if (pair !== prevProps.pair || open !== prevProps.open) {
			this.handleTrades();
		}
	}

	handleTrades = (page = 1, limit = this.state.limit) => {
		const { pair, userId, open } = this.props;
		requestActiveOrders({
			user_id: userId,
			symbol: pair ? (/^[a-z0-9]+-[a-z0-9]+$/i.test(pair) ? pair : null) : null,
			page,
			limit,
			open,
		})
			.then((res) => {
				if (res) {
					this.setState({
						buyOrders: {
							...this.state.buyOrders,
							data: [...this.state.buyOrders.data, ...res.data],
							loading: false,
							total: res.count,
							page: res.page,
							isRemaining: res.isRemaining,
						},
					});
				}
			})
			.catch((err) => {
				this.setState({
					buyOrders: {
						...this.state.buyOrders,
						loading: false,
					},
				});
			});
	};

	pageChange = (count, pageSize) => {
		const { buyOrders = {}, sellOrders = {}, limit } = this.state;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		const page =
			this.state.activeTab === 'buy' ? buyOrders.page : sellOrders.page;
		const isRemaining =
			this.state.activeTab === 'buy'
				? buyOrders.isRemaining
				: sellOrders.isRemaining;
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			this.setState({
				buyOrders: {
					...this.state.buyOrders,
					loading: true,
				},
			});
			this.handleTrades(buyOrders.page + 1, limit);
		}
		this.setState({ buyCurrentTablePage: count });
	};

	tabChange = (activeTab) => {
		this.setState({ activeTab });
	};

	onCancelOrder = (order, userId) => {
		if (order && order.id) {
			requestCancelOrders(order.id, userId).then((res) => {
				if (res && res.side === 'buy') {
					const temp = this.state.buyOrders.data.filter(
						(val) => val.id !== res.id
					);
					this.setState({
						buyOrders: {
							...this.state.buyOrders,
							data: [...temp],
						},
					});
				} else if (res && res.side === 'sell') {
					const temp = this.state.sellOrders.data.filter(
						(val) => val.id !== res.id
					);
					this.setState({
						sellOrders: {
							...this.state.sellOrders,
							data: [...temp],
						},
					});
				}
			});
		}
	};

	render() {
		const { buyOrders, buyCurrentTablePage } = this.state;

		const COLUMNS = this.props.getThisExchangeOrder
			? getThisExchangeOrders(this.onCancelOrder)
			: getColumns(this.props.userId, this.onCancelOrder);
		return (
			<div className="f-1 admin-user-container">
				<Row>
					<div className="f-1 mt-4">
						{buyOrders.loading ? (
							<Spin size="large" />
						) : (
							<Col>
								<Table
									className="blue-admin-table"
									columns={COLUMNS}
									rowKey={(data) => {
										return data.id;
									}}
									dataSource={buyOrders.data}
									pagination={{
										current: buyCurrentTablePage,
										onChange: this.pageChange,
									}}
								/>
							</Col>
						)}
					</div>
				</Row>
			</div>
		);
	}
}

export default PairsSection;
