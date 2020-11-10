import React, { Component } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Table, Spin, Button, Card } from 'antd';
import { Link } from 'react-router';

import { requestUsers } from '../ListUsers/actions';
import { requestTrades } from './actions';

const renderLink = (value) => (
	<Button type="primary" onClick={(e) => refreshPage(e)}>
		<Link to={`user?id=${value}`}>
			GO
			<RightOutlined />
		</Link>
	</Button>
);

const COLUMNS = [
	{ title: 'ID', dataIndex: 'id', key: 'id' },
	{ title: 'User name', dataIndex: 'username', key: 'username' },
	{ title: 'name', dataIndex: 'full_name', key: 'full_name' },
	{ title: 'Email', dataIndex: 'email', key: 'email' },
	{ title: 'See Data', dataIndex: 'id', key: 'data', render: renderLink },
];

// const TRADE_COLUMNS = [
// 	{ title: 'Type', dataIndex: 'side', key: 'side' },
// 	{ title: 'Symbol', dataIndex: 'symbol', key: 'symbol' }
// 	// { title: 'ID', dataIndex: 'id', key: 'id' },
// ];

const refreshPage = (e) => {
	e.preventDefault();
	window.location.reload();
};

class UserListTrades extends Component {
	state = {
		users: [],
		fetched: false,
		loading: false,
		error: '',
		tradeData: [],
	};

	componentWillMount() {
		this.requestFullUsers();
	}

	requestFullUsers = () => {
		this.setState({
			loading: true,
			error: '',
		});

		requestUsers().then((data) => {
			this.setState({
				users: data.data,
				loading: false,
				fetched: true,
			});
		});
	};

	renderRowContent = ({ id }) => {
		requestTrades(id).then((res) => {
			this.setState({ tradeData: res.data });
		});
		return (
			<div>
				{this.state.tradeData.map((each) => {
					return (
						<Card>
							{Object.entries(each).map(([key, val]) => {
								return (
									<div>
										{key} : {val}
									</div>
								);
							})}
						</Card>
					);
				})}
			</div>
		);
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
						<Table
							columns={COLUMNS}
							dataSource={users}
							expandedRowRender={this.renderRowContent}
							expandRowByClick={true}
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

export default UserListTrades;
