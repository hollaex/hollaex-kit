import React, { Component } from 'react';
import { Table, Icon, Spin, Button } from 'antd';
import { Link } from 'react-router';

import './index.css';

import { requestUsers } from './actions';

class ListUsers extends Component {
	state = {
		users: [],
		fetched: false,
		loading: false,
		error: ''
	};

	componentWillMount() {
		this.requestUsers();
	}

	requestUsers = () => {
		this.setState({
			loading: true,
			error: ''
		});

		requestUsers()
			.then((data) => {
				this.setState({
					users: data,
					loading: false,
					fetched: true
				});
			})
			.catch((error) => {
				const message = error.message;
				this.setState({
					loading: false,
					error: message
				});
			});
	};

	requestUser = (value) => {
		this.props.requestUser({ id: JSON.stringify(value) });
	};

	render() {
		const { users, loading, error } = this.state;

		const renderBoolean = (value) => (
			<Icon type={value ? 'check-circle-o' : 'close-circle'} />
		);

		const renderLink = (value) => (
			<Button type="primary" onClick={() => this.requestUser(value)}>
				<Link to={`/admin/user?id=${value}`}>
					GO
					<Icon type="right" />
				</Link>
			</Button>
		);
		const COLUMNS = [
			{ title: 'ID', dataIndex: 'id', key: 'id' },
			{ title: 'Email', dataIndex: 'email', key: 'email' },
			{
				title: 'Verification Level',
				dataIndex: 'verification_level',
				key: 'verification_level'
			},
			{
				title: 'Activated',
				dataIndex: 'activated',
				key: 'activated',
				render: renderBoolean
			},
			{ title: 'See Data', dataIndex: 'id', key: 'data', render: renderLink }
		];

		return (
			<div className="app_container-content">
				{loading ? (
					<Spin size="large" />
				) : (
					<div>
						{error && <p>-{error}-</p>}
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

export default ListUsers;
