import React from 'react';
import { SubmissionError } from 'redux-form';
import { updateNotes } from './actions';
import { AdminHocForm } from '../../../components';

const Form = AdminHocForm('USER_DATA', 'user_data');

const Fields = {
	note: {
		type: 'textarea',
		label: 'Notes'
	}
};

const onSubmit = (onChangeSuccess, initialValues) => (values) => {
    values.id = initialValues.id
	return updateNotes(values)
		.then((data) => {
			if (onChangeSuccess) {
                onChangeSuccess({
                    ...initialValues,
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
		...initialValues,
		...initialValues.address,
		gender: initialValues.gender ? 'Woman' : 'Man'
	};
	return values;
};

const Notes = ({ initialValues, onChangeSuccess }) => {
    return (
        <Form
            onSubmit={onSubmit(onChangeSuccess, initialValues)}
            buttonText="SAVE"
            fields={Fields}
            initialValues={generateInitialValues(initialValues)}
        />
    );
} 

export default Notes;
