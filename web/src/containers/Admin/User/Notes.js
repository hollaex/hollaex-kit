import React from 'react';
import { SubmissionError } from 'redux-form';
import { updateNotes } from './actions';
import { AdminHocForm } from '../../../components';

const Form = AdminHocForm('USER_NOTES', 'user_data');

const Fields = {
	note: {
		type: 'textarea',
		label: 'Notes'
	}
};

const onSubmit = (onChangeSuccess, userInfo) => (values) => {
    values.id = userInfo.id
	return updateNotes(values)
		.then((data) => {
			if (onChangeSuccess) {
                onChangeSuccess({
                    ...userInfo,
					...values,
				});
			}
		})
		.catch((err) => {
            throw new SubmissionError({ _error: err.data.message });
		});
};

const generateInitialValues = (initialValues) => {
	const values = {
		...initialValues
	};
	return values;
};

const Notes = ({ initialValues, userInfo, onChangeSuccess }) => {
    return (
        <Form
            onSubmit={onSubmit(onChangeSuccess, userInfo)}
            buttonText="SAVE"
            fields={Fields}
            initialValues={generateInitialValues(initialValues)}
        />
    );
} 

export default Notes;
