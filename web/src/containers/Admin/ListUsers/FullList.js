import React, { Component } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Table, Spin, Button } from 'antd';
import { Link } from 'react-router';
import { formatCurrency } from '../../../utils/index';
import moment from 'moment';

import './index.css';

import { requestUsers } from './actions';

// import { generateHeaders } from './constants';

// const renderBoolean = (value) => <Icon type={value ? 'check-circle-o' : 'close-circle'}/>;

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
		};
	}

	componentWillMount() {
		this.requestFullUsers(this.state.page, this.state.limit);
	}

	requestFullUsers = (page = 1, limit = 50) => {
		this.setState({
			loading: true,
			error: '',
		});

		requestUsers({ page, limit })
			.then((res) => {
				let temp = page === 1 ? res.data : [...this.state.users, ...res.data];
				let users = temp.sort((a, b) => {
					return new Date(b.created_at) - new Date(a.created_at);
				});
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
			this.requestFullUsers(page + 1, limit);
		}
		this.setState({ currentTablePage: count });
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

		const renderRowContent = ({
			created_at,
			crypto_wallet,
			btc_balance,
			bch_balance,
			eth_balance,
			xrp_balance,
			fiat_balance,
		}) => {
			btc_balance = formatCurrency(btc_balance);
			bch_balance = formatCurrency(bch_balance);
			eth_balance = formatCurrency(eth_balance);
			xrp_balance = formatCurrency(xrp_balance);
			fiat_balance = formatCurrency(fiat_balance);

			return (
				<div>
					<div>Created at: {moment(created_at).format('YYYY/MM/DD HH:mm')}</div>
				</div>
			);
		};

		const { users, loading, error, currentTablePage } = this.state;
		// const { coins } = this.props;
		// const HEADERS = generateHeaders(coins);
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
								onClick={() => this.props.handleDownload({})}
							>
								Download table
							</span>
						</div>
						<Table
							className="blue-admin-table"
							columns={COLUMNS}
							dataSource={users}
							expandedRowRender={renderRowContent}
							expandRowByClick={true}
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

export default FullListUsers;
