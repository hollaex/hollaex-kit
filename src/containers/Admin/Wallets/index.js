import React, { Component } from 'react';
import { Spin } from 'antd';
import { requestTotalBalance, requestEthSweep } from './actions';
import { Card, Alert, Input, Button, Row, Col } from 'antd';
import { formatCurrency } from '../../../utils';

const Search = Input.Search;

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
				console.log(error);
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message
				});
			});
	};

	onSweep(value) {
		if (value === '') {
			return null;
		} else {
			this.setState({
				showSweep: true,
				walletNum: value
			});
			requestEthSweep(value).catch((error) => {
				console.log(error.data);
				const message = error.message;
				console.log(message);
			});
		}
	}

	render() {
		const { balance, loading, error, showSweep, walletNum } = this.state;

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
							<h1 className="m-top">Ethereum sweep</h1>
							{showSweep || (
								<div>
									<Search
										placeholder="Number of wallets to sweep"
										enterButton="Start"
										size="large"
										style={{ width: '60%' }}
										onSearch={(e) => this.onSweep(e)}
									/>
								</div>
							)}
							{showSweep && (
								<Row>
									<Col span={4}>
										<img src="http://gifimage.net/wp-content/uploads/2017/10/broom-sweeping-gif-6.gif" />
									</Col>
									<Col span={12}>
										<h2 className="m-top">
											Sweeping of {walletNum} wallets initiated on the server.
											Comeback later
									</h2>
										<Button
											size="large"
											type="primary"
											onClick={() => this.setState({ showSweep: false })}
										>
											Sweep again
									</Button>
									</Col>
								</Row>
							)}
						</div>
					)}
			</div>
		);
	}
}

export default Wallets;
