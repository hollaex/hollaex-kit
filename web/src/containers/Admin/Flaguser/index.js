import React from 'react';
import { SubmissionError } from 'redux-form';
import { flagUser } from './actions';
import { AdminHocForm } from '../../../components';

const Form = AdminHocForm('ACTIVATION_FORM');

const onSubmit = (refreshData) => (values) => {
	return flagUser(values)
		.then((res) => {
			refreshData(values);
		})
		.catch((err) => {
			throw new SubmissionError({ _error: err.data.message });
		});
};

const Flagger = ({ user_id, flagged, refreshData, small }) => (
	<Form
		onSubmit={() => onSubmit(refreshData)({ user_id, flagged: !flagged })}
		buttonText={flagged ? 'Unflag user' : 'Flag user'}
		buttonType={flagged ? 'dashed' : 'danger'}
		small={small}
	/>
);

export default Flagger;
