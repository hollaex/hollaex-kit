import React, { Component } from 'react';
import { Table, Spin } from 'antd';
import { requestUserAudits, requestUserAuditsDownload } from './actions';

import { SubmissionError } from 'redux-form';

import Moment from 'react-moment';

const INITIAL_STATE = {
	audits: [],
	total: 0,
	loading: true,
};

const formatDate = (value) => {
	return <Moment format="YYYY/MM/DD HH:mm">{value}</Moment>;
};

const formatDescription = (value) => {
	if (value.old) {
		return Object.keys(value.old).map((item, key) => {
			return (
				<div key={item}>
					{item}: {JSON.stringify(value.old[item])} {'->'}{' '}
					{JSON.stringify(value.new[item])}
				</div>
			);
		});
	}
	return null;
};

const formatDescriptionNote = (value) => {
	return <div>{value.note}</div>;
};

const AUDIT_COLUMNS = [
	{ title: 'Event', dataIndex: 'event', key: 'event' },
	{
		title: 'Change',
		dataIndex: 'description',
		key: 'old',
		render: formatDescription,
	},
	{
		title: 'Note',
		dataIndex: 'description',
		key: 'note',
		render: formatDescriptionNote,
	},
	{ title: 'Admin', dataIndex: 'admin_id', key: 'admin_id' },
	{ title: 'IP', dataIndex: 'ip', key: 'ip' },
	{ title: 'Domain', dataIndex: 'domain', key: 'domain' },
	{
		title: 'Time',
		dataIndex: 'timestamp',
		key: 'timestamp',
		render: formatDate,
	},
];
// const CSV_AUDIT_COLUMNS = [
// 	{ label: 'Event', dataIndex: 'event', key: 'event' },
// 	{ label: 'IP', dataIndex: 'ip', key: 'ip' },
// 	{ label: 'Domain', dataIndex: 'domain', key: 'domain' },
// 	{ label: 'Time', dataIndex: 'timestamp', key: 'timestamp' }
// ];

class Audits extends Component {
	state = INITIAL_STATE;

	componentWillMount = () => {
		if (this.props.userId) {
			this.handleUserAudits(this.props.userId);
		}
	};

	handleUserAudits = (userId) => {
		requestUserAudits(userId)
			.then((res) => {
				if (res) {
					this.setState({
						audits: res.data || [],
						total: res.count,
						loading: false,
					});
				}
			})
			.catch((err) => {
				if (err.status === 403) {
					this.setState({ loading: false });
				}
				if (err.data && err.data.message) {
					throw new SubmissionError({ _error: err.data.message });
				}
			});
	};

	requestUserAuditsDownload = (userId) => {
		return requestUserAuditsDownload({ format: 'csv', userId: userId });
	};

	render() {
		const { audits, loading } = this.state;

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
					<div>Number of events: {this.state.total}</div>
					<div
						className="pointer download-csv-table"
						onClick={() => this.requestUserAuditsDownload(this.props.userId)}
					>
						Download CSV table
					</div>
				</div>
				<Table
					rowKey={(data) => {
						return data.id;
					}}
					columns={AUDIT_COLUMNS}
					dataSource={audits ? audits : 'No Data'}
					pagination={{ pageSize: 5 }}
				/>
			</div>
		);
	}
}

export default Audits;
