import React, { Component } from 'react';
import { Row, Col, Table, Spin } from 'antd';
import { requestUserLogins, requestUserLoginsDownload } from './actions';

import { SubmissionError } from 'redux-form';

import Moment from 'react-moment';

const INITIAL_STATE = {
	tradeHistory: '',
	loading: true
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
		render: formatDate
	}
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
						loading: false
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
		return requestUserLoginsDownload({ format: 'csv', userId: userId })
	}

	render() {
		const { logins, loading } = this.state;

		if (loading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return (
			<Row gutter={16} style={{ marginTop: 16 }}>
				<Col>
					<div>
						<span className="pointer" onClick={() => this.requestUserLoginsDownload(this.props.userId)}>
							Download table
						</span>
					</div>
					<span style={{ float: 'right' }}>
						Number of logins:{logins ? logins.length : null}
					</span>
					<Table
						columns={LOGIN_COLUMNS}
						dataSource={logins ? logins : 'No Data'}
						rowKey={(data, index) => {
							return `${data.id}_${index}`;
						}}
					/>
				</Col>
			</Row>
		);
	}
}

export default Logins;
