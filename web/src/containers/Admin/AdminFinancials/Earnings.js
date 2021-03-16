import React, { Component } from 'react';
import { Table, Button, Tooltip, Modal } from 'antd';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { getFees, getFeesDownload } from '../AdminFees/action';
import { STATIC_ICONS } from 'config/icons';
import { SettleModal } from './SettleModal';

const earningsColumns = [
	{
		title: 'Date',
		dataIndex: 'date',
		key: 'date',
		render: (date) => <div className="table-content">{date}</div>,
	},
];

const descriptionColumn = [
	{
		title: 'Transaction_ID',
		dataIndex: 'transaction_id',
		key: 'transaction_id',
	},
	{
		title: 'Amount',
		dataIndex: 'amount',
		key: 'amount',
	},
	{
		title: 'Currency',
		dataIndex: 'currency',
		key: 'currency',
	},
	{
		title: (
			<div>
				Network fee
				<Tooltip
					placement="right"
					overlayClassName="terminating-tooltip"
					title="Network fees are calculated based on your plan and membership status. All network fees are redistributed to all XHT collateral stakers and members"
				>
					<QuestionCircleOutlined
						style={{ fontSize: '14px', color: '#ffffff', marginLeft: '5px' }}
					/>
				</Tooltip>
			</div>
		),
		dataIndex: 'network_fee',
		key: 'network_fee',
	},
	{
		title: 'Timestamp',
		dataIndex: 'timestamp',
		key: 'timestamp',
	},
];

class Earnings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			pageSize: 10,
			limit: 50,
			currentTablePage: 1,
			isRemaining: true,
			data: {},
			earningsData: [],
			feesData: [],
			isOpen: false,
		};
	}

	componentDidMount() {
		this.requestFees();
	}

	requestFees = (page = 1, limit = 50) => {
		this.setState({
			error: '',
		});
		return getFees(page, limit)
			.then((response) => {
				this.setState({
					feesData:
						page === 1
							? response.data
							: [...this.state.feesData, ...response.data],
					page,
					currentTablePage: page === 1 ? 1 : this.state.currentTablePage,
					isRemaining: response.count > page * limit,
				});
				if (response.data) {
					this.handleData(response.data.data);
				}
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					error: message,
				});
			});
	};

	renderMember = (level) => {
		if (level === 'member') {
			return '(Holla member)';
		} else {
			return '(non member)';
		}
	};

	pageChange = (count, pageSize) => {
		const { page, limit, isRemaining } = this.state;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			this.requestFees(page + 1, limit);
		}
		this.setState({ currentTablePage: count });
	};

	handleData = () => {
		const result = Object.keys(this.state.feesData).map((key) => {
			return {
				date: key,
				fields: this.state.feesData[key],
			};
		});
		this.setState({ earningsData: result });
	};

	toggleVisibility = () => {
		this.setState({ isOpen: !this.state.isOpen });
	};

	handleDownload = () => {
		return getFeesDownload({ format: 'csv' });
	};

	render() {
		const { info } = this.props;
		const { currentTablePage, earningsData, isOpen } = this.state;

		return (
			<div className="admin-earnings-container">
				<div>
					<div className="title">Settle earnings</div>
					<div className="description-width">
						Below displays the historic settlement of earnings generated from
						the trading fees of all your users. Earning calculations are
						dependent on your plan type and membership status.
					</div>
				</div>
				<div className="icon-wrapper d-flex align-items-center flex-column">
					<div className="icon-holder">
						<ReactSVG src={STATIC_ICONS['CLOUD_ICON']} className="cloudIcon" />
						<div className="dollar-icon text-center">$</div>
					</div>
					<div>
						<span className="font-weight-bold">{info.type} </span> :
						<span>{info.plan}</span>
					</div>
					<div>{this.renderMember(info.collateral_level)}</div>
					<div>
						<Button onClick={this.toggleVisibility} className=" button">
							Settle
						</Button>
					</div>
				</div>
				<Modal
					visible={isOpen}
					footer={null}
					onCancel={this.toggleVisibility}
					width="37rem"
				>
					<SettleModal
						toggleVisibility={this.toggleVisibility}
						earningsData={earningsData}
						requestFees={this.requestFees}
					/>
				</Modal>
				<div className="table-container">
					<div className="title-wrapper">
						<div className="title">Earnings</div>
						<div>
							<span
								size="small"
								className="download-btn"
								onClick={this.handleDownload}
							>
								Download
							</span>
						</div>
					</div>
					<div>
						<Table
							columns={earningsColumns}
							className="blue-admin-table"
							dataSource={earningsData.map((data) => {
								return data;
							})}
							rowKey={(data) => data.date}
							pagination={{
								current: currentTablePage,
								onChange: this.pageChange,
							}}
							expandedRowRender={(record) => {
								return (
									<Table
										className="blue-admin-table"
										columns={descriptionColumn}
										dataSource={record.fields}
										rowKey={(data) => data.id}
										pagination={false}
									/>
								);
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	info: state.app.constants.info,
});

export default connect(mapStateToProps)(Earnings);
