import React, { Component } from 'react';
import { BarcodeOutlined } from '@ant-design/icons';
import { Spin, Alert, Table, Input } from 'antd';

import { HocForm } from '../../components';
import { getTransactions } from './actions';

import {
	initialValues,
	INITIAL_STATE,
	COLUMNS,
	expandedRowRender,
} from './utils';

const Form = HocForm('TRANSACTIONS_FORM', 'transactions-form', true);

class BankTransactions extends Component {
	state = INITIAL_STATE;

	onSubmit = ({ dates, ...rest }) => {
		this.setState({ ...INITIAL_STATE, loading: true });
		const values = {
			startDate: dates[0],
			endDate: dates[1],
			...rest,
		};
		return getTransactions(values)
			.then(({ transactions }) => {
				this.setState({
					data: transactions,
					filteredData: transactions,
					loading: false,
					success: true,
				});
			})
			.catch(({ data }) => {
				this.setState({ error: data.message, loading: false });
			});
	};

	handleChange = (pagination, filters, sorter) => {
		this.setState({
			filteredInfo: filters,
			sortedInfo: sorter,
		});
	};

	onSearch = (value) => {
		const filteredData = this.state.data.filter(
			({ UID, TrxID }) =>
				UID.indexOf(value) > -1 || `${TrxID}`.indexOf(value) > -1
		);
		this.setState({
			searchText: value,
			filteredData,
		});
	};

	onChange = (ev) => {
		const value = ev.target.value;
		this.onSearch(value);
	};

	render() {
		const { error, filteredData, loading, success } = this.state;
		return (
			<div className="app_container-content">
				<Form
					onSubmit={this.onSubmit}
					initialValues={initialValues}
					buttonText="Check"
					fields={{
						dates: {
							type: 'range',
							validate: [],
						},
						transaction_id: {
							type: 'string',
							placeholder: 'Transaction ID',
							validate: [],
							prefix: <BarcodeOutlined />,
						},
					}}
				/>
				<div className="m-top">
					{loading && <Spin size="large" />}
					{error && (
						<Alert message="Error" description={error} type="error" showIcon />
					)}
					{success && (
						<div className="w-100">
							<div className="m-bottom">
								<Input.Search
									addonBefore="Filter by Transaction UID"
									onSearch={this.onSearch}
									onChange={this.onChange}
									enterButton
								/>
							</div>
							<Table
								bordered={true}
								columns={COLUMNS}
								rowKey={(data) => {
									return data.id;
								}}
								dataSource={filteredData}
								expandedRowRender={expandedRowRender}
								onChange={this.handleChange}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default BankTransactions;
