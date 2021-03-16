import React, { Component } from 'react';
import { Table, Button, Tooltip, Modal } from 'antd';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

import { getFees, getFeesDownload } from '../AdminFees/action';
import { STATIC_ICONS } from 'config/icons';
import { SettleModal } from './SettleModal';
import Filter from './filter';

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
const filterOptions = [
	{
		label: 'Date',
		value: 'date',
		secondaryType: 'date-range',
		secondaryDefaultValue: [moment().subtract(30, 'days'), moment()],
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
			end_date: moment().format('YYYY-MM-DD'),
			start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
		};
	}

	componentDidMount() {
		this.requestFees();
	}

	requestFees = () => {
		const { start_date, end_date } = this.state;
		this.setState({
			error: '',
		});
		return getFees({ start_date, end_date })
			.then((response) => {
				this.setState({
					feesData: response,
					// page,
					// currentTablePage: page === 1 ? 1 : this.state.currentTablePage,
					// isRemaining: response.count > page * limit,
				});
				if (response) {
					this.handleData(response);
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

	SetFilterDates = (value) => {
		if (value && value.length) {
			const start_date = value[0].format('YYYY-MM-DD');
			const end_date = value[1].format('YYYY-MM-DD');
			this.setState({ start_date, end_date });
		}
		if (!value) {
			this.setState({
				end_date: moment().format('YYYY-MM-DD'),
				start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
			});
		}
	};

	render() {
		const { info } = this.props;
		const { earningsData, isOpen } = this.state;

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
					<div className="font-weight-bold">Earnings history</div>
					<div>
						Change the date below to view earnings made between different dates.
					</div>
					<div className="title-wrapper">
						<div>
							<Filter
								selectOptions={filterOptions}
								onChange={this.SetFilterDates}
								onClickFilter={this.requestFees}
							/>
						</div>
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
