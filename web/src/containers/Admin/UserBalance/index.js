import React, { Component } from 'react';
import { Row, Col, Spin, Card } from 'antd';
import { requestUserBalance } from './actions';

import { SubmissionError } from 'redux-form';

import { isSupport } from '../../../utils/token';

import { formatCurrency } from '../../../utils';
import moment from 'moment';

const INITIAL_STATE = {
	tradeHistory: '',
	loading: true,
};

class UserBalance extends Component {
	state = INITIAL_STATE;

	componentWillMount = () => {
		const isSupportUser = isSupport();
		if (this.props.userData) {
			this.handleBalance(this.props.userData, isSupportUser);
		}
	};

	handleBalance = (userData, isSupportUser) => {
		if (!isSupportUser) {
			requestUserBalance(userData.id)
				.then((res) => {
					if (res) {
						this.setState({
							isSupportUser: isSupportUser,
							userBalance: res,
							loading: false,
							userInformation: userData,
						});
					}
				})
				.catch((err) => {
					if (err.status === 403) {
						this.setState({ loading: false });
					}
					throw new SubmissionError({ _error: err.data.message });
				});
		} else {
			const error = new Error('Not found');
			error.data = userData;
			throw error;
		}
	};

	render() {
		const { userInformation, userBalance, loading, isSupportUser } = this.state;

		if (loading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return (
			<Row>
				<Row gutter={16}>
					{Object.entries(userInformation.crypto_wallet).map(([key, value]) => (
						<Col key={key}>
							<Card title={<h3>{key}</h3>} type="inner">
								{value}
							</Card>
						</Col>
					))}
				</Row>
				{!isSupportUser && (
					<Row gutter={16} style={{ marginTop: 16 }}>
						<Col>
							<Card title={<h3>Balance</h3>} type="inner">
								{Object.entries(userBalance).map(([key, value]) => {
									if (key === 'created_at' || key === 'updated_at') {
										return (
											<div key={key}>
												{' '}
												<strong>{key}</strong> :{' '}
												{moment(value).format('YYYY/MM/DD HH:mm')}{' '}
											</div>
										);
									} else {
										return (
											<div key={key}>
												<strong>{key}</strong> :{' '}
												{typeof value !== 'number' ? (
													<span>no data</span>
												) : (
													formatCurrency(value, 0, 8)
												)}{' '}
											</div>
										);
									}
								})}
							</Card>
						</Col>
					</Row>
				)}
			</Row>
		);
	}
}

export default UserBalance;
