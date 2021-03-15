import React, { Component } from 'react';
import { Table, Spin } from 'antd';

import './index.css';

import { requestUsers } from './actions';

class ListUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			fetched: false,
			loading: false,
			error: '',
			total: 0,
			page: 1,
			pageSize: 10,
			limit: 50,
			currentTablePage: 1,
			isRemaining: true,
		};
	}

	componentWillMount() {
		this.requestUsers(this.state.page, this.state.limit);
	}

	requestUsers = (page = 1, limit = 50) => {
		this.setState({
			loading: true,
			error: '',
		});

		requestUsers({ pending: true, page, limit })
			.then((response) => {
				this.setState({
					users:
						page === 1
							? response.data
							: [...this.state.users, ...response.data],
					total: response.count,
					loading: false,
					fetched: true,
					page,
					currentTablePage: page === 1 ? 1 : this.state.currentTablePage,
					isRemaining: response.count > page * limit,
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

	requestUser = (value) => {
		this.props.requestUser({ id: JSON.stringify(value) });
	};

	pageChange = (count, pageSize) => {
		const { page, limit, isRemaining } = this.state;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			this.requestUsers(page + 1, limit);
		}
		this.setState({ currentTablePage: count });
	};

	render() {
		const { users, loading, error, currentTablePage } = this.state;
		const { columns } = this.props;
		return (
			<div className="app_container-content admin-user-container">
				{loading ? (
					<Spin size="large" />
				) : (
					<div>
						{error && <p>-{error}-</p>}
						<div>
							<span
								className="pointer"
								onClick={() => this.props.handleDownload({ pending: true })}
							>
								Download table
							</span>
						</div>
						<Table
							className="blue-admin-table"
							columns={columns}
							dataSource={users}
							rowKey={(data) => {
								return data.id;
							}}
							pagination={{
								current: currentTablePage,
								onChange: this.pageChange,
							}}
						/>
					</div>
				)}
			</div>
		);
	}
}

export default ListUsers;
