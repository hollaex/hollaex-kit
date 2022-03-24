import React, { Component } from 'react';
import { Table, Button, Tooltip, Modal } from 'antd';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

import { getFees, getFeesDownload } from '../AdminFees/action';
import { STATIC_ICONS } from 'config/icons';
import { SettleModal } from './SettleModal';
import { requestUsers } from '../ListUsers/actions';
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
		title: 'Network_ID',
		dataIndex: 'user_id',
		key: 'user_id',
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
		render: (date) => (
			<div>
				{moment(date).format('DD/MMM/YYYY, hh:mmA ').toUpperCase() +
					new Date(date).toTimeString().slice(9)}
			</div>
		),
	},
];
const filterOptions = [
	{
		label: 'Date',
		value: 'date',
		secondaryType: 'date-range',
		secondaryDefaultValue: [moment().subtract(90, 'days'), moment()],
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
			end_date: moment().add(1, 'hours').format('YYYY-MM-DD hh:mm A'),
			start_date: moment().subtract(90, 'days').format('YYYY-MM-DD hh:mm A'),
			buttonSubmitting: false,
			currentScreen: '',
			userDetails: [],
			isLoading: false,
		};
	}

	componentDidMount() {
		this.requestFees();
	}

	requestFees = () => {
		const { start_date, end_date } = this.state;
		this.setState({
			error: '',
			buttonSubmitting: true,
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
				this.setState({ buttonSubmitting: false });
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					error: message,
					buttonSubmitting: false,
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
		const { currentScreen } = this.state;
		if (currentScreen === 'step2') {
			this.setState({ currentScreen: 'step1' });
		} else if (currentScreen === 'step1') {
			this.setState({
				isOpen: !this.state.isOpen,
				currentScreen: '',
			});
		}
	};

	handleSettle = () => {
		this.setState({
			isOpen: !this.state.isOpen,
			currentScreen: '',
		});
	};

	toggleOpen = () => {
		this.setState({ isOpen: !this.state.isOpen, currentScreen: 'step1' });
		this.getAllUserData();
	};

	onModalClose = () => {
		this.setState({
			isOpen: !this.state.isOpen,
			currentScreen: '',
		});
	};

	handleNext = () => {
		this.setState({ currentScreen: 'step2' });
	};

	handleDownload = () => {
		return getFeesDownload({ format: 'csv' });
	};

	setFilterDates = (value) => {
		if (value && value.length) {
			const start_date = value[0].format('YYYY-MM-DD hh:mm A');
			const end_date = value[1].format('YYYY-MM-DD hh:mm A');
			this.setState({ start_date, end_date });
		}
		if (!value) {
			this.setState({
				end_date: moment().add(1, 'hours').format('YYYY-MM-DD hh:mm A'),
				start_date: moment().subtract(90, 'days').format('YYYY-MM-DD hh:mm A'),
			});
		}
	};

	getAllUserData = async (params = {}) => {
		this.setState({ isLoading: true });
		try {
			const response = await requestUsers(params);
			if (response.data) {
				this.setState({ userDetails: response.data, isLoading: false });
			}
		} catch (error) {
			this.setState({ isLoading: false });
		}
	};

	render() {
		const { info } = this.props;
		const { earningsData, isOpen, buttonSubmitting } = this.state;
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
						<span className="font-weight-bold">{info.type}</span>:{' '}
						<span>{info.plan}</span>
					</div>
					<div>{this.renderMember(info.collateral_level)}</div>
					<div>
						<Button onClick={this.toggleOpen} className=" button">
							Settle
						</Button>
					</div>
				</div>
				<Modal
					visible={isOpen}
					footer={null}
					onCancel={this.onModalClose}
					width="37rem"
				>
					<SettleModal
						toggleVisibility={this.toggleVisibility}
						earningsData={earningsData}
						requestFees={this.requestFees}
						currentScreen={this.state.currentScreen}
						handleNext={this.handleNext}
						userDetails={this.state.userDetails}
						getAllUserData={this.getAllUserData}
						isLoading={this.state.isLoading}
						handleSettle={this.handleSettle}
						isOpen={isOpen}
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
								onChange={this.setFilterDates}
								onClickFilter={this.requestFees}
								buttonSubmitting={buttonSubmitting}
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
							rowKey={(data, index) => index}
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
							loading={!earningsData.length}
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
