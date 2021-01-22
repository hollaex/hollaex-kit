import React, { Component } from 'react';
import { AppstoreOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Spin, Alert } from 'antd';
import { connect } from 'react-redux';

import { AdminHocForm } from '../../../components';
import { validateRequired } from '../../../components/AdminForm/validations';
import { checkTransaction } from './actions';

const Form = AdminHocForm('TRANSACTION_FORM', 'transaction-form');
const SERVER_TYPES = [
	{ label: 'mainnet', value: '0' },
	{ label: 'testnet', value: '1' },
];

class BlockchainTransaction extends Component {
	state = {
		data: {},
		loading: false,
		error: '',
	};

	onSubmit = ({
		currency,
		transaction_id = '',
		address = '',
		is_testnet = false,
	}) => {
		const testnet = is_testnet === '0' ? false : true;
		this.setState({ error: '', loading: true, data: {} });
		return checkTransaction(currency, transaction_id, address, testnet)
			.then((data) => {
				this.setState({ data, loading: false });
			})
			.catch(({ err, message }) => {
				let error = err
					? err.message
						? err.message
						: err
					: message
					? message
					: '';
				this.setState({ error: error, loading: false });
			});
	};

	render() {
		const { error, data, loading } = this.state;
		const coinOptions = [];
		Object.keys(this.props.coins).forEach((data) => {
			let temp = this.props.coins[data];
			if (temp) {
				coinOptions.push({
					label: `${temp.fullname} (${temp.symbol})`,
					value: data,
				});
			}
		});
		return (
			<div className="app_container-content">
				<Form
					onSubmit={this.onSubmit}
					buttonText="Check"
					initialValues={this.props.initialValues}
					fields={{
						currency: {
							type: 'select',
							placeholder: 'Coin',
							label: 'Coin',
							validate: [validateRequired],
							options: coinOptions,
						},
						transaction_id: {
							type: 'input',
							placeholder: 'Transaction Id',
							validate: [validateRequired],
							prefix: <AppstoreOutlined />,
						},
						address: {
							type: 'input',
							placeholder: 'Address',
							prefix: <QrcodeOutlined />,
						},
						is_testnet: {
							type: 'select',
							options: SERVER_TYPES,
							validate: [validateRequired],
						},
					}}
				/>
				<div className="m-top">
					{loading && <Spin size="large" />}
					{error && (
						<Alert message="Error" description={error} type="error" showIcon />
					)}
					{Object.keys(data).length > 0 && (
						<div className="w-100">
							<Alert message={data.message} type="success" showIcon />
							<Alert
								message="Deposit"
								className="m-top"
								description={<pre>{JSON.stringify(data.deposit, null, 2)}</pre>}
								type="info"
							/>
							<Alert
								message="User"
								className="m-top"
								description={<pre>{JSON.stringify(data.user, null, 2)}</pre>}
								type="info"
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

BlockchainTransaction.defaultProps = {
	initialValues: { is_testnet: '0' },
};

export default connect(mapStateToProps)(BlockchainTransaction);
