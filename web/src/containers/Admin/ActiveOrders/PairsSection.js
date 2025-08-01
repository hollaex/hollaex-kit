import React, { Component } from 'react';
import { Tabs, Row, Col, Table, Tooltip, Button, Spin } from 'antd';
import { CSVLink } from 'react-csv';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Moment from 'react-moment';
import debounce from 'lodash.debounce';

import { formatCurrency } from '../../../utils/index';
import { requestActiveOrders, requestCancelOrders } from './action';
import { setSelectedOrdersTab } from 'actions/appActions';

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
			<Link to={`/admin/user?id=${id}`}>{id}</Link>
		</Button>
	</Tooltip>
);

const renderExchangeUser = (user) => (
	<div className="exchange-user-wrapper">
		<Tooltip placement="bottom" title={`SEE USER ${user?.id} DETAILS`}>
			<Button type="primary">
				<Link to={`/admin/user?id=${user?.id}`}>{user?.id}</Link>
			</Button>
		</Tooltip>
		<p className="pl-3 mb-0">{user?.email}</p>
	</div>
);

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
		{ title: 'Filled', dataIndex: 'filled', key: 'filled', render: formatNum },
		{
			title: 'Time',
			dataIndex: 'updated_at',
			key: 'updated_at',
			render: formatDate,
		},
	];
	if (userId) {
		columns = [
			...columns,
			{
				title: 'Cancel order',
				dataIndex: '',
				key: '',
				render: (e) => (
					<Tooltip placement="bottom" title={`Cancel order`}>
						<Button
							type="primary"
							onClick={() => onCancel(e, userId)}
							className="green-btn"
						>
							Cancel
						</Button>
					</Tooltip>
				),
			},
		];
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
		{ title: 'Filled', dataIndex: 'filled', key: 'filled', render: formatNum },
		{
			title: 'Time',
			dataIndex: 'updated_at',
			key: 'updated_at',
			render: formatDate,
		},
		{
			title: 'User',
			dataIndex: 'created_by',
			key: 'id',
			render: (v, data) => renderExchangeUser(data.User),
		},
		{
			title: 'Cancel order',
			dataIndex: '',
			key: '',
			render: (e) => (
				<Tooltip placement="bottom" title={`Cancel order`}>
					<Button
						type="primary"
						onClick={() => onCancel(e, e?.User?.id)}
						className="green-btn"
					>
						Cancel
					</Button>
				</Tooltip>
			),
		},
	];

	return columns;
};

const SCV_COLUMNS = [
	{ label: 'Side', dataIndex: 'side', key: 'side' },
	{ label: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
	{ label: 'Size', dataIndex: 'size', key: 'size' },
	{ label: 'Price', dataIndex: 'price', key: 'price' },
	{ label: 'Filled', dataIndex: 'filled', key: 'filled' },
	{ label: 'Time', dataIndex: 'updated_at', key: 'updated_at' },
];

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
		this.handleTrades('buy');
		this.handleTrades('sell');
		if (this.props?.selectedOrdersTab) {
			this.tabChange(this.props?.selectedOrdersTab);
			this.props.setSelectedOrdersTab(null);
		}
	}

	debounceClearTab = debounce(() => {
		this.props.setSelectedOrdersTab(null);
	}, 500);

	componentDidUpdate(prevProps, prevState) {
		const { open, pair, selectedOrdersTab } = this.props;
		if (pair !== prevProps.pair || open !== prevProps.open) {
			this.handleTrades('buy');
			this.handleTrades('sell');
		}
		if (selectedOrdersTab && selectedOrdersTab !== this.state.activeTab) {
			this.tabChange(selectedOrdersTab);
			this.debounceClearTab();
		}
	}

	componentWillUnmount() {
		if (this.debounceClearTab) {
			this.debounceClearTab.cancel();
		}
	}

	handleTrades = (side, page = 1, limit = this.state.limit) => {
		const { pair, userId, open } = this.props;
		requestActiveOrders({
			user_id: userId,
			symbol: pair,
			side,
			page,
			limit,
			open,
		})
			.then((res) => {
				if (res) {
					if (side === 'buy') {
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
					} else {
						this.setState({
							sellOrders: {
								...this.state.sellOrders,
								data: [...this.state.sellOrders.data, ...res.data],
								loading: false,
								total: res.count,
								page: res.page,
								isRemaining: res.isRemaining,
							},
						});
					}
				}
			})
			.catch((err) => {
				if (err.status === 403) {
					if (side === 'buy') {
						this.setState({
							buyOrders: {
								...this.state.buyOrders,
								loading: true,
							},
						});
					} else {
						this.setState({
							sellOrders: {
								...this.state.sellOrders,
								loading: true,
							},
						});
					}
				}
				// let errorMsg = err.data && err.data.message
				//     ? err.data.message
				//     : err.message;
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
			if (this.state.activeTab === 'buy') {
				this.setState({
					buyOrders: {
						...this.state.buyOrders,
						loading: true,
					},
				});
				this.handleTrades('buy', buyOrders.page + 1, limit);
			} else {
				this.setState({
					sellOrders: {
						...this.state.sellOrders,
						loading: true,
					},
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
		const {
			buyOrders,
			sellOrders,
			buyCurrentTablePage,
			sellCurrentTablePage,
		} = this.state;

		const COLUMNS = this.props.getThisExchangeOrder
			? getThisExchangeOrders(this.onCancelOrder)
			: getColumns(this.props.userId, this.onCancelOrder);
		return (
			<div className="f-1 admin-user-container">
				<Tabs onChange={this.tabChange} activeKey={this.state.activeTab}>
					<TabPane tab="Bids" key="buy">
						<Row>
							<div className="f-1 mt-4">
								{buyOrders.loading ? (
									<Spin size="large" />
								) : (
									<Col>
										<CSVLink
											filename={'active-orders-bids.csv'}
											data={buyOrders.data}
											headers={SCV_COLUMNS}
										>
											Download table
										</CSVLink>
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
					</TabPane>
					<TabPane tab="Asks" key="sell">
						<Row>
							<div className="f-1 mt-4">
								{sellOrders.loading ? (
									<Spin size="large" />
								) : (
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
											className="blue-admin-table"
											rowKey={(data) => {
												return data.id;
											}}
											dataSource={sellOrders.data}
											pagination={{
												current: sellCurrentTablePage,
												onChange: this.pageChange,
											}}
										/>
									</Col>
								)}
							</div>
						</Row>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	selectedOrdersTab: state.app.selectedOrdersTab,
});

const mapDispatchToProps = (dispatch) => ({
	setSelectedOrdersTab: bindActionCreators(setSelectedOrdersTab, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PairsSection);
