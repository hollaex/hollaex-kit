import React from 'react';
import { SubmissionError } from 'redux-form';
import { message } from 'antd';
import { performBalanceUpdate } from './actions';
import { AdminHocForm } from '../../../components';
import {
	validateRequired,
	validatePositiveNumber,
	validateRange,
} from '../../../components/AdminForm/validations';

import { isSupport } from '../../../utils/token';

const TYPES = ['deposit', 'withdrawal'];

const Form = AdminHocForm('BALANCE_UPDATE_FORM');

const onSubmit = (values) => {
	// redux form set numbers as string, se we have to parse them
	const postValues = {
		...values,
		user_id: parseInt(values.user_id, 10),
		amount: parseFloat(values.amount),
	};

	return performBalanceUpdate(postValues)
		.then(() => {
			message.success('Funding processed');
		})
		.catch((err) => {
			throw new SubmissionError({ _error: err.data.message });
		});
};

const Balance = ({ user_id, pairs = [] }) =>
	isSupport() ? (
		<div />
	) : (
		<div>
			<Form
				onSubmit={onSubmit}
				buttonText="Process"
				fields={{
					amount: {
						type: 'number',
						label: 'Amount',
						min: 0.00000001,
						max: 100000000000,
						validate: [validateRequired, validatePositiveNumber(0)],
					},
					currency: {
						type: 'select',
						label: 'Currency',
						options: pairs,
						validate: [validateRequired, validateRange(pairs)],
					},
					type: {
						type: 'select',
						label: 'Type',
						options: TYPES,
						validate: [validateRequired, validateRange(TYPES)],
					},
					description: {
						type: 'text',
						label: 'Description',
					},
				}}
				initialValues={{
					user_id,
					currency: pairs[0] ? pairs[0] : '',
					type: 'deposit',
					amount: 0,
				}}
			/>
		</div>
	);

export default Balance;
