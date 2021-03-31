import React, { Component } from 'react';
import { Table, Spin } from 'antd';
import { requestDeposits } from './actions';

import { formatDate } from '../../../utils';

const tableFormatDate = (value) => {
	return <div>{formatDate(value)}</div>;
};

const COLUMNS = [
	{ title: 'ID', dataIndex: 'user_id', key: 'user_id' },
	{ title: 'Currency', dataIndex: 'currency', key: 'currency' },
	{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
	{
		title: 'transaction id',
		dataIndex: 'transaction_id',
		key: 'transaction_id',
	},
	{
		title: 'Time',
		dataIndex: 'created_at',
		key: 'created_at',
		render: tableFormatDate,
	},
];

class DepositsList extends Component {
	state = {
		users: [],
		fetched: false,
		loading: false,
		error: '',
	};

	componentWillMount() {
		this.requestDeposits();
	}

	requestDeposits = () => {
		this.setState({
			loading: true,
			error: '',
		});

		requestDeposits()
			.then((data) => {
				this.setState({
					users: data,
					loading: false,
					fetched: true,
				});
			})
			.catch((error) => {
				const message = error.message;
				this.setState({
					loading: false,
					error: message,
				});
			});
	};

	render() {
		const { users, loading, error } = this.state;

		return (
			<div className="app_container-content">
				{loading ? (
					<Spin size="large" />
				) : (
					<div>
						{error && <p>-{error}-</p>}
						<h3>Transactions</h3>
						<Table
							columns={COLUMNS}
							dataSource={users}
							rowKey={(data) => {
								return data.id;
							}}
						/>
					</div>
				)}
			</div>
		);
	}
}

export default DepositsList;
