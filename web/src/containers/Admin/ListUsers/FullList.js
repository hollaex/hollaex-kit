import React, { Component } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Table, Button, Modal } from 'antd';
import { Link } from 'react-router';
import { formatDate } from 'utils';
import { requestUsers } from './actions';
import AddUser from './AddUser';
import UseFilters from './UserFilters';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

import './index.css';

class FullListUsers extends Component {
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
			isVisible: false,
			displayFilterModel: false,
			filters: null,
		};
	}

	UNSAFE_componentWillMount() {
		this.requestFullUsers(this.state.page, this.state.limit);
	}

	requestFullUsers = (page = 1, limit = 50) => {
		this.setState({
			loading: true,
			error: '',
		});
		const { filters } = this.state;
		requestUsers({ page, limit, ...(filters != null && filters) })
			.then((res) => {
				let temp = page === 1 ? res.data : [...this.state.users, ...res.data];
				let users = temp;

				this.setState({
					users,
					loading: false,
					fetched: true,
					total: res.count,
					page,
					currentTablePage: page === 1 ? 1 : this.state.currentTablePage,
					isRemaining: res.count > page * limit,
				});
			})
			.catch((error) => {
				const message = error.data.message;
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
			this.requestFullUsers(page + 1, limit);
		}
		this.setState({ currentTablePage: count });
	};

	onCancel = () => {
		this.setState({ isVisible: false });
	};

	applyFilters = (filters) => {
		this.setState({ filters }, () => {
			const { page, limit } = this.state;
			this.requestFullUsers(page, limit);
		});
	};

	render() {
		const renderLink = (value) => (
			<Button
				type="primary"
				// onClick={() => this.requestUser(value)}
				className="green-btn"
			>
				<Link to={`/admin/user?id=${value}`}>
					GO
					<RightOutlined />
				</Link>
			</Button>
		);

		const renderFlagIcon = (value) => {
			if (value === true) {
				return (
					<div>
						<LegacyIcon
							type={'flag'}
							style={{ color: 'red', fontSize: '1.5em' }}
						/>
					</div>
				);
			}
			return <div> </div>;
		};

		const COLUMNS = [
			{ title: 'ID', dataIndex: 'id', key: 'id' },
			{ title: 'User name', dataIndex: 'username', key: 'username' },
			{ title: 'name', dataIndex: 'full_name', key: 'full_name' },
			{ title: 'Email', dataIndex: 'email', key: 'email' },
			{
				title: 'Level',
				dataIndex: 'verification_level',
				key: 'verification_level',
			},
			{
				title: 'flagged users',
				dataIndex: 'flagged',
				key: 'flagged',
				render: renderFlagIcon,
			},
			{ title: 'See Data', dataIndex: 'id', key: 'data', render: renderLink },
		];

		const renderRowContent = ({ created_at }) => {
			return (
				<div>
					<div>Created at: {formatDate(created_at)}</div>
				</div>
			);
		};

		const {
			users,
			loading,
			error,
			currentTablePage,
			total,
			isVisible,
		} = this.state;

		return (
			<div className="app_container-content admin-user-container">
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<div
						style={{
							marginTop: 20,
							marginBottom: 10,
							fontSize: 15,
							color: '#ccc',
						}}
					>
						Find users by their email and verification status below, or narrow
						down your search by adding more filters.
					</div>
					<Button
						style={{
							backgroundColor: '#288500',
							color: 'white',
							marginTop: 20,
						}}
						onClick={() => this.setState({ isVisible: true })}
					>
						{' '}
						Add new user
					</Button>
				</div>
				<hr style={{ border: '1px solid #ccc', marginBottom: 20 }} />

				<div>
					{error && <p>-{error}-</p>}

					<div>
						<UseFilters
							displayFilterModel={this.state.displayFilterModel}
							setDisplayFilterModel={(value) => {
								this.setState({ displayFilterModel: value });
							}}
							applyFilters={this.applyFilters}
							loading={loading}
						/>
					</div>

					<div className="user-list-header-wrapper">
						<span
							className="pointer"
							onClick={() => this.props.handleDownload(this.state.filters)}
						>
							Download table
						</span>
						<span>Total: {total || '-'}</span>
					</div>
					<Table
						loading={loading}
						className="blue-admin-table"
						columns={COLUMNS}
						dataSource={users}

						expandable={{
							expandedRowRender: renderRowContent,
							expandRowByClick: true,
							expandIcon: ({ expanded, onExpand, record }) =>
								expanded ? (
									<MinusCircleOutlined onClick={(e) => onExpand(record, e)} style={{ marginRight: 8 }} />
								) : (
									<PlusCircleOutlined onClick={(e) => onExpand(record, e)} style={{ marginRight: 8 }} />
								),
						}}
						rowKey={(data) => {
							return data.id;
						}}
						pagination={{
							current: currentTablePage,
							onChange: this.pageChange,
						}}
					/>
				</div>

				<Modal
					visible={isVisible}
					footer={null}
					className="add-user-modal"
					width={'500px'}
					onCancel={this.onCancel}
				>
					<AddUser
						onCancel={this.onCancel}
						requestFullUsers={this.requestFullUsers}
					/>
				</Modal>
			</div>
		);
	}
}

export default FullListUsers;
