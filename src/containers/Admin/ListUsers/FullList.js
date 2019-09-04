import React, { Component } from 'react';
import { Table, Icon, Spin, Button } from 'antd';
import { Link } from 'react-router';
import { CSVLink } from 'react-csv';
import { formatCurrency, formatDate } from '../../../utils/index';
import moment from 'moment';

import './index.css';

import { requestFullUsers } from './actions';

import { HEADERS } from './constants';

// const renderBoolean = (value) => <Icon type={value ? 'check-circle-o' : 'close-circle'}/>;

class FullListUsers extends Component {
	state = {
		users: [],
		fetched: false,
		loading: false,
		error: ''
	};

	componentWillMount() {
		this.requestFullUsers();
	}

	requestFullUsers = () => {
		this.setState({
			loading: true,
			error: ''
		});

		requestFullUsers()
			.then((data) => {
				data.data.sort((a, b) => {
					return new Date(b.created_at) - new Date(a.created_at);
				});
				this.setState({
					users: data.data.map((user) => {
						return { ...user };
					}),
					loading: false,
					fetched: true
				});
			})
			.catch((error) => {
				console.log(error.data);
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
		const renderLink = (value) => (
			<Button type="primary" onClick={() => this.requestUser(value)}>
				<Link to={`user?id=${value}`}>
					GO
					<Icon type="right" />
				</Link>
			</Button>
		);

		const renderFlagIcon = (value) => {
			if (value === true) {
				return (
					<div>
						<Icon type={'flag'} style={{ color: 'red', fontSize: '1.5em' }} />
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
				key: 'verification_level'
			},
			{
				title: 'flagged users',
				dataIndex: 'flagged',
				key: 'flagged',
				render: renderFlagIcon
			},
			{ title: 'See Data', dataIndex: 'id', key: 'data', render: renderLink }
		];

		const renderRowContent = ({
			created_at,
			crypto_wallet,
			btc_balance,
			bch_balance,
			eth_balance,
			xrp_balance,
			fiat_balance
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

		const { users, loading, error } = this.state;
		return (
			<div className="app_container-content">
				{loading ? (
					<Spin size="large" />
				) : (
						<div>
							{error && <p>-{error}-</p>}
							<CSVLink filename={'users.csv'} data={users} headers={HEADERS}>
								Download table
						</CSVLink>
							<Table
								columns={COLUMNS}
								dataSource={users}
								expandedRowRender={renderRowContent}
								expandRowByClick={true}
							/>
						</div>
					)}
			</div>
		);
	}
}

export default FullListUsers;
