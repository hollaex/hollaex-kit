import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Alert, Spin } from 'antd';
import { isSupport } from 'utils/token';

import { getFees } from './actions';
import { formatCurrencyByIncrementalUnit } from 'utils/currency';

class BlockchainTransaction extends Component {
	state = {
		data: {},
		loading: true,
		error: '',
	};

	UNSAFE_componentWillMount() {
		if (!isSupport()) {
			getFees()
				.then((data) => {
					this.setState({
						loading: false,
						data,
					});
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					this.setState({
						loading: false,
						error: message,
					});
				});
		} else {
			this.setState({
				loading: false,
			});
		}
	}

	render() {
		const { error, data, loading } = this.state;
		const { coins } = this.props;
		if (loading) return <Spin size="large" />;
		return (
			<div className="app_container-content">
				{
					loading && <div />
					// <Spin size="large" />
				}
				{error && (
					<Alert
						message="Error"
						className="m-top"
						description={error}
						type="error"
						showIcon
					/>
				)}
				{data.fees && (
					<div className="list-group m-top">
						<Card
							className="card-title"
							title="Fees"
							style={{ textAlign: 'center' }}
						>
							{Object.entries(data.fees).map(([currency, amount], index) => {
								const increment_unit = coins?.[currency]?.increment_unit;
								return (
									<div
										key={index}
										className="list-group-item list-group-item-action"
									>
										{currency.toUpperCase()} :{' '}
										{formatCurrencyByIncrementalUnit(amount, increment_unit)}
									</div>
								);
							})}
						</Card>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(BlockchainTransaction);
