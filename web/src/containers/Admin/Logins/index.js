import React, { Component } from 'react';
import { Table, Spin } from 'antd';
import { requestUserLogins, requestUserLoginsDownload } from './actions';

import { SubmissionError } from 'redux-form';

import Moment from 'react-moment';

const INITIAL_STATE = {
	logins: [],
	total: 0,
	loading: true,
};

const formatDate = (value) => {
	return <Moment format="YYYY/MM/DD HH:mm">{value}</Moment>;
};

const LOGIN_COLUMNS = [
	{ title: 'IP', dataIndex: 'ip', key: 'ip' },
	{ title: 'Device', dataIndex: 'device', key: 'device' },
	{ title: 'Domain', dataIndex: 'domain', key: 'domain' },
	{
		title: 'Time',
		dataIndex: 'timestamp',
		key: 'timestamp',
		render: formatDate,
	},
];
// const SCV_LOGIN_COLUMNS = [
// 	{ label: 'IP', dataIndex: 'ip', key: 'ip' },
// 	{ label: 'Device', dataIndex: 'device', key: 'device' },
// 	{ label: 'Domain', dataIndex: 'domain', key: 'domain' },
// 	{ label: 'Time', dataIndex: 'timestamp', key: 'timestamp' }
// ];

class Logins extends Component {
	state = INITIAL_STATE;

	componentWillMount = () => {
		if (this.props.userId) {
			this.handleUserLogins(this.props.userId);
		}
	};

	handleUserLogins = (userId) => {
		requestUserLogins(userId)
			.then((res) => {
				if (res) {
					this.setState({
						logins: res.data,
						total: res.count,
						loading: false,
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

	requestUserLoginsDownload = (userId) => {
		return requestUserLoginsDownload({ format: 'csv', user_id: userId });
	};

	render() {
		const { logins, total, loading } = this.state;

		if (loading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return (
			<div className="app_container-content my-2 admin-user-container">
				<div className="d-flex justify-content-between my-3">
					<div>Number of logins: {total}</div>
					<div
						className="pointer download-csv-table"
						onClick={() => this.requestUserLoginsDownload(this.props.userId)}
					>
						Download CSV table
					</div>
				</div>
				<Table
					columns={LOGIN_COLUMNS}
					dataSource={logins ? logins : 'No Data'}
					rowKey={(data, index) => {
						return `${data.id}_${index}`;
					}}
					pagination={{ pageSize: 5 }}
				/>
			</div>
		);
	}
}

export default Logins;
