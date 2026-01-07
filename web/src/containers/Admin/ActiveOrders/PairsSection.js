import React, { Component } from 'react';
import {
	Tabs,
	Row,
	Col,
	Table,
	Tooltip,
	Button,
	Spin,
	Modal,
	Dropdown,
	Menu,
	Input,
	InputNumber,
} from 'antd';
import { CSVLink } from 'react-csv';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Moment from 'react-moment';
import debounce from 'lodash.debounce';

import { formatCurrency } from '../../../utils/index';
import {
	requestActiveOrders,
	requestCancelOrders,
	requestMatchOrder,
} from './action';
import { MoreOutlined } from '@ant-design/icons';
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
	</div>
);

const getColumns = (userId, onCancel, onOpen, renderActions) => {
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
		{ title: 'Stop', dataIndex: 'stop', key: 'stop', render: formatNum },
		{
			title: 'Average',
			dataIndex: 'average',
			key: 'average',
			render: formatNum,
		},
		{ title: 'Filled', dataIndex: 'filled', key: 'filled', render: formatNum },
		{
			title: 'Time',
			dataIndex: 'updated_at',
			key: 'updated_at',
			render: formatDate,
		},
		{
			title: 'Details',
			dataIndex: 'id',
			key: 'details',
			render: (v, record) => (
				<Button
					type="link"
					style={{ color: 'white' }}
					onClick={(ev) => {
						ev.stopPropagation();
						onOpen(record);
					}}
				>
					View
				</Button>
			),
		},
	];
	// actions column
	columns = [
		...columns,
		{
			title: 'Actions',
			key: 'actions',
			render: (record) => renderActions(record),
		},
	];
	return columns;
};

const getThisExchangeOrders = (onCancel, onOpen, renderActions) => {
	let columns = [];

	columns = [
		{ title: 'Side', dataIndex: 'side', key: 'side' },
		{ title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
		{ title: 'Size', dataIndex: 'size', key: 'size', render: formatNum },
		{ title: 'Price', dataIndex: 'price', key: 'price', render: formatNum },
		{ title: 'Stop', dataIndex: 'stop', key: 'stop', render: formatNum },
		{
			title: 'Average',
			dataIndex: 'average',
			key: 'average',
			render: formatNum,
		},
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
			title: 'Details',
			dataIndex: 'id',
			key: 'details',
			render: (v, record) => (
				<Button
					type="link"
					style={{ color: 'white' }}
					onClick={(ev) => {
						ev.stopPropagation();
						onOpen(record);
					}}
				>
					View
				</Button>
			),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (record) => renderActions(record),
		},
	];

	return columns;
};

const SCV_COLUMNS = [
	{ label: 'Side', dataIndex: 'side', key: 'side' },
	{ label: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
	{ label: 'Size', dataIndex: 'size', key: 'size' },
	{ label: 'Price', dataIndex: 'price', key: 'price' },
	{ label: 'Stop', dataIndex: 'stop', key: 'stop' },
	{ label: 'Average', dataIndex: 'average', key: 'average' },
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
			orderModalVisible: false,
			selectedOrder: null,
			matchModalVisible: false,
			matchOrderRecord: null,
			matchSize: null,
			matchUserId: null,
			matchLoading: false,
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

	openOrderModal = (order) => {
		this.setState({ orderModalVisible: true, selectedOrder: order });
	};

	closeOrderModal = () => {
		this.setState({ orderModalVisible: false, selectedOrder: null });
	};

	deriveUserId = (order) => {
		return order?.User?.id || order?.created_by || this.props.userId;
	};

	renderActionMenu = (record) => (
		<Menu>
			<Menu.Item
				key="cancel"
				onClick={({ domEvent }) => {
					domEvent.stopPropagation();
					this.confirmCancel(record);
				}}
			>
				Cancel
			</Menu.Item>
			<Menu.Item
				key="match"
				onClick={({ domEvent }) => {
					domEvent.stopPropagation();
					this.openMatchModal(record);
				}}
			>
				Match order
			</Menu.Item>
		</Menu>
	);

	renderActions = (record) => (
		<Dropdown overlay={this.renderActionMenu(record)} trigger={['click']}>
			<Button
				type="link"
				style={{ color: 'white' }}
				onClick={(ev) => ev.stopPropagation()}
			>
				<MoreOutlined />
			</Button>
		</Dropdown>
	);

	confirmCancel = (order) => {
		Modal.confirm({
			title: 'Cancel this order?',
			okText: 'Cancel order',
			okType: 'danger',
			onOk: () => this.onCancelOrder(order, this.deriveUserId(order)),
		});
	};

	openMatchModal = (order) => {
		this.setState({
			matchModalVisible: true,
			matchOrderRecord: order,
			matchUserId: this.deriveUserId(order),
			matchSize: null,
		});
	};

	closeMatchModal = () => {
		this.setState({
			matchModalVisible: false,
			matchOrderRecord: null,
			matchSize: null,
			matchUserId: null,
			matchLoading: false,
		});
	};

	submitMatch = async () => {
		const { matchOrderRecord, matchSize, matchUserId } = this.state;
		if (!matchOrderRecord || !matchUserId || !matchSize) return;
		this.setState({ matchLoading: true });
		try {
			await requestMatchOrder({
				user_id: Number(matchUserId),
				order_id: matchOrderRecord.id,
				symbol: matchOrderRecord.symbol,
				size: Number(matchSize),
			});
			this.closeMatchModal();
			this.refreshOrders();
		} catch (e) {
			this.setState({ matchLoading: false });
		}
	};

	refreshOrders = () => {
		this.setState(
			{
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
				buyCurrentTablePage: 1,
				sellCurrentTablePage: 1,
			},
			() => {
				this.handleTrades('buy');
				this.handleTrades('sell');
			}
		);
	};

	// no modal actions; read-only details

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
			? getThisExchangeOrders(
					this.onCancelOrder,
					this.openOrderModal,
					this.renderActions
			  )
			: getColumns(
					this.props.userId,
					this.onCancelOrder,
					this.openOrderModal,
					this.renderActions
			  );
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
											onRow={(record) => ({
												onClick: () => this.openOrderModal(record),
												style: { cursor: 'pointer' },
											})}
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
											onRow={(record) => ({
												onClick: () => this.openOrderModal(record),
												style: { cursor: 'pointer' },
											})}
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
				<Modal
					title={<span style={{ color: 'white' }}>Order details</span>}
					visible={this.state.orderModalVisible}
					onCancel={this.closeOrderModal}
					footer={null}
				>
					{this.state.selectedOrder && (
						<div>
							<div className="d-flex flex-column mb-3">
								<div>
									<strong>ID:</strong> {this.state.selectedOrder.id}
								</div>
								<div>
									<strong>User ID:</strong>{' '}
									{this.deriveUserId(this.state.selectedOrder)}
									{this.state.selectedOrder?.User?.email
										? ` (${this.state.selectedOrder.User.email})`
										: ''}
								</div>
								<div>
									<strong>Symbol:</strong> {this.state.selectedOrder.symbol}
								</div>
								<div>
									<strong>Side:</strong> {this.state.selectedOrder.side}
								</div>
								<div>
									<strong>Type:</strong> {this.state.selectedOrder.type}
								</div>
								<div>
									<strong>Price:</strong> {this.state.selectedOrder.price}
								</div>
								<div>
									<strong>Size:</strong> {this.state.selectedOrder.size}
								</div>
								<div>
									<strong>Filled:</strong> {this.state.selectedOrder.filled}
								</div>
								<div>
									<strong>Stop:</strong> {this.state.selectedOrder.stop || ''}
								</div>
								<div>
									<strong>Average:</strong>{' '}
									{this.state.selectedOrder.average || ''}
								</div>
								<div>
									<strong>Status:</strong> {this.state.selectedOrder.status}
								</div>
								<div>
									<strong>Updated:</strong>{' '}
									{this.state.selectedOrder.updated_at}
								</div>
								<div>
									<strong>Created:</strong>{' '}
									{this.state.selectedOrder.created_at}
								</div>
							</div>
						</div>
					)}
				</Modal>
				<Modal
					title={<span style={{ color: 'white' }}>Match order</span>}
					visible={this.state.matchModalVisible}
					onCancel={this.closeMatchModal}
					onOk={this.submitMatch}
					confirmLoading={this.state.matchLoading}
					okText="Match"
				>
					<div className="d-flex flex-column">
						<div className="mb-2">
							<div className="mb-1">User ID</div>
							<Input
								value={this.state.matchUserId}
								onChange={(e) => this.setState({ matchUserId: e.target.value })}
							/>
						</div>
						<div>
							<div className="mb-1">Size</div>
							<InputNumber
								value={this.state.matchSize}
								onChange={(v) => this.setState({ matchSize: v })}
								min={0}
								style={{ width: '100%' }}
							/>
						</div>
					</div>
				</Modal>
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
