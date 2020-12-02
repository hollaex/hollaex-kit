import React from 'react';
import { Divider, message } from 'antd';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import { postTransfer } from './action';
import { AdminHocForm } from '../../../components';
import {
	validateRequired,
	validateRange,
	validatePositiveNumber,
} from '../../../components/AdminForm/validations';

const Form = AdminHocForm('TRANSFER_FORM');

const getFields = (coins) => ({
	sender_id: {
		type: 'number',
		label: 'Sender ID',
		placeholder: 'Sender ID',
		validate: [validateRequired],
		fullWidth: true,
	},
	receiver_id: {
		type: 'number',
		label: 'Receiver ID',
		placeholder: 'Receiver ID',
		validate: [validateRequired],
		fullWidth: true,
	},
	currency: {
		type: 'select',
		label: 'Currency',
		placeholder: 'Currency',
		options: coins,
		validate: [validateRequired, validateRange(coins)],
	},
	amount: {
		type: 'number',
		label: 'Amount',
		placeholder: 'Amount',
		min: 0.00000001,
		max: 100000000000,
		validate: [validateRequired, validatePositiveNumber(0)],
	},
});

const TransferForm = ({ fields, initialValues, handleSubmitTransfer }) => {
	return (
		<div className="mb-4">
			<Form
				initialValues={initialValues}
				onSubmit={handleSubmitTransfer}
				buttonText={'Transfer'}
				fields={fields}
			/>
		</div>
	);
};

const Transfer = ({ coins = {} }) => {
	const handleSubmit = (formProps) => {
		const postValues = {
			...formProps,
			sender_id: parseInt(formProps.sender_id, 10),
			receiver_id: parseInt(formProps.receiver_id, 10),
			amount: parseFloat(formProps.amount),
		};
		return postTransfer(postValues)
			.then((res) => {
				message.success('Transferred Successfully');
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				throw new SubmissionError({ _error: message });
			});
	};
	const coinData = Object.keys(coins || {});
	const fields = getFields(coinData);
	return (
		<div className="app_container-content">
			<h1 className="m-top">Transfer</h1>
			<Divider />
			<TransferForm
				initialValues={{ currency: coinData[0] ? coinData[0] : '' }}
				fields={fields}
				handleSubmitTransfer={handleSubmit}
			/>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(Transfer);
