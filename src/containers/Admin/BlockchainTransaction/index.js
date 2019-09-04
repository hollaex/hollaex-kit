import React, { Component } from 'react';
import { Icon, Spin, Alert } from 'antd';

import { AdminHocForm } from '../../../components';
import { validateRequired } from '../../../components/AdminForm/validations';
import { checkTransaction } from './actions';

const Form = AdminHocForm('TRANSACTION_FORM', 'transaction-form');

class BlockchainTransaction extends Component {
	state = {
		data: {},
		loading: false,
		error: ''
	};

	onSubmit = ({ currency, transaction_id = '', address = '' }) => {
		this.setState({ error: '', loading: true, data: {} });
		return checkTransaction(currency, transaction_id, address)
			.then((data) => {
				console.log(data);
				this.setState({ data, loading: false });
			})
			.catch(({ data }) => {
				console.log(data);
				this.setState({ error: data.message, loading: false });
			});
	};

	render() {
		const { error, data, loading } = this.state;
		return (
			<div className="app_container-content">
				<h1> CHECK BLOCKCHAIN TRANSACTIONS </h1>
				<Form
					onSubmit={this.onSubmit}
					buttonText="Check"
					fields={{
						currency: {
							type: 'select',
							placeholder: 'Coin',
							label: 'Coin',
							validate: [validateRequired],
							options: [
								{ label: 'BITCOIN (BTC)', value: 'btc' },
								{ label: 'ETHEREUM (ETH)', value: 'eth' },
								{ label: 'BITCOINCASH (BCH)', value: 'bch' },
								{ label: 'RIPPLE} (XRP)', value: 'xrp' }
							]
						},
						transaction_id: {
							type: 'input',
							placeholder: 'Transaction Id',
							validate: [validateRequired],
							prefix: <Icon type="appstore-o" />
						},
						address: {
							type: 'input',
							placeholder: 'Address',
							prefix: <Icon type="qrcode" />
						}
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

export default BlockchainTransaction;
