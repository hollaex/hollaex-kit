import React, { Component } from 'react';
import { Table, Button } from 'antd';

import { getFees } from '../AdminFees/action';

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
		title: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
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
		title: 'Network_fee',
		dataIndex: 'network_fee',
		key: 'network_fee',
	},
	{
		title: 'Timestamp',
		dataIndex: 'timestamp',
		key: 'timestamp',
	},
	{
		title: 'Exchange_id',
		dataIndex: 'exchange_id',
		key: 'exchange_id',
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

	render() {
		const { currentTablePage, earningsData } = this.state;
		return (
			<div className="admin-earnings-container">
				<div className="table-container">
					<div className="title-wrapper">
						<div className="title">Earnings</div>
						<div>
							<Button size="small" className="download-btn">
								Download
							</Button>
						</div>
					</div>
					<div>
						<Table
							columns={earningsColumns}
							dataSource={earningsData.map((data) => {
								return data;
							})}
							rowKey={(data) => data.id}
							pagination={{
								current: currentTablePage,
								onChange: this.pageChange,
							}}
							expandedRowRender={(record) => {
								return (
									<Table
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

export default Earnings;
