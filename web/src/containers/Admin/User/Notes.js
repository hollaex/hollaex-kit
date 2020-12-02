import React from 'react';
import { SubmissionError } from 'redux-form';
import { updateNotes } from './actions';
import { AdminHocForm } from '../../../components';

const Form = AdminHocForm('USER_NOTES', 'user_data');

const Fields = {
	note: {
		type: 'textarea',
		label: 'Notes',
	},
};

const onSubmit = (onChangeSuccess, userInfo, handleClose) => (values) => {
	values.id = userInfo.id;
	return updateNotes(values)
		.then((data) => {
			if (onChangeSuccess) {
				onChangeSuccess({
					...userInfo,
					...values,
				});
			}
			handleClose();
		})
		.catch((err) => {
			throw new SubmissionError({ _error: err.data.message });
		});
};

const generateInitialValues = (initialValues) => {
	const values = {
		...initialValues,
	};
	return values;
};

const Notes = ({ initialValues, userInfo, onChangeSuccess, handleClose }) => {
	return (
		<Form
			onSubmit={onSubmit(onChangeSuccess, userInfo, handleClose)}
			buttonText="SAVE"
			fields={Fields}
			initialValues={generateInitialValues(initialValues)}
			buttonClass="green-btn"
		/>
	);
};

export default Notes;
