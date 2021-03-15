import React, { useState } from 'react';
import { SubmissionError } from 'redux-form';

import { calculateFees } from './action';
import { AdminHocForm } from '../../../components';
import { Card, Divider } from 'antd';
import { formatCurrency } from '../../../utils/currency';

const Form = AdminHocForm('TRANSFER_FORM');

const Fields = {
	start_date: {
		type: 'date',
		label: 'Start date',
	},
	end_date: {
		type: 'date',
		label: 'End date',
	},
	user_id: {
		type: 'number',
		label: 'User ID (optional)',
		placeholder: 'User ID',
		fullWidth: true,
	},
};

const CalculateFeeForm = ({ fields, handleCalculate }) => {
	return (
		<div className="mb-4">
			<Form
				onSubmit={handleCalculate}
				buttonText={'Calculate'}
				fields={fields}
			/>
		</div>
	);
};

const CalculateFee = () => {
	const [fees, updateFees] = useState({});
	const handleSubmit = (formProps) => {
		let values = { ...formProps };
		if (formProps.user_id) {
			values.user_id = parseInt(formProps.user_id);
		}

		return calculateFees(values)
			.then((res) => {
				updateFees(res);
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				throw new SubmissionError({ _error: message });
			});
	};
	return (
		<div>
			<div>
				Calculate fees made on the exchange between the start and end date.
			</div>
			<div>
				Note: If User ID is specified, system only calculates fees made by the
				specific user.
			</div>
			<Divider />
			<CalculateFeeForm fields={Fields} handleCalculate={handleSubmit} />
			{Object.keys(fees).length ? (
				<Card className="card-title" title="CALCULATED FEE">
					{Object.entries(fees).map(([name, value]) => {
						return (
							<p key={name}>
								{name.toUpperCase()} : {formatCurrency(value)}
							</p>
						);
					})}
				</Card>
			) : null}
		</div>
	);
};

export default CalculateFee;
