import React, { Component } from 'react';
import { Spin } from 'antd';
import { requestTotalBalance } from './actions';
import { Card, Alert } from 'antd';
import { formatCurrency } from '../../../utils';


class Wallets extends Component {
	state = {
		users: [],
		fetched: false,
		loading: false,
		error: '',
		showSweep: null,
		walletNum: null
	};

	componentWillMount() {
		this.requestTotalBalance();
		this.setState({ showSweep: false });
	}

	requestTotalBalance = () => {
		this.setState({
			loading: true,
			error: ''
		});

		requestTotalBalance()
			.then((res) => {
				this.setState({
					balance: res.data.balances,
					loading: false,
					fetched: true
				});
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message
				});
			});
	};

	render() {
		const { balance, loading, error } = this.state;

		return (
			<div className="app_container-content">
				{error && (
					<Alert
						message="Error"
						className="m-top"
						description={error}
						type="error"
						showIcon
					/>
				)}
				{loading ? (
					<Spin size="large" />
				) : (
					<div>
						{error && <p>-{error}-</p>}
						<h1>USER WALLETS</h1>
						<Card
							className="card-title"
							title="TOTAL BALANCE OF USERS WALLETS"
							style={{ width: '60%' }}
						>
							{!balance ? (
								<Alert
									message="Error"
									className="m-top"
									description={error}
									type="error"
									showIcon
								/>
							) : (
								Object.entries(balance).map(([name, value]) => {
									return (
										<p key={name}>
											{name.toUpperCase()} : {formatCurrency(value)}
										</p>
									);
								})
							)}
						</Card>
					</div>
				)}
			</div>
		);
	}
}

export default Wallets;
