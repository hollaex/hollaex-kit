import React from 'react';
import { SubmissionError } from 'redux-form';

import { calculateFees } from './action';
import { AdminHocForm } from '../../../components';

const Form = AdminHocForm('TRANSFER_FORM');

const Fields = {
    user_id: {
        type: 'number',
        label: 'User ID',
        placeholder: 'User ID',
        fullWidth: true
    },
    start_date: {
        type: 'date',
        label: 'Start date'
    },
    end_date: {
        type: 'date',
        label: 'End date'
    }
};

const CalculateFeeForm = ({
    fields,
    handleCalculate,
}) => {
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
    const handleSubmit = (formProps) => {
        console.log('formProps', formProps);
        let values = { ...formProps };
        if (formProps.user_id) {
            values.user_id = parseInt(formProps.user_id);
        }

        return calculateFees(values)
            .then((res) => {
                console.log('res', res);
            })
            .catch((error) => {
                const message = error.data ? error.data.message : error.message;
                throw new SubmissionError({ _error: message });
            });
    };
    return (
        <div>
            <CalculateFeeForm
                fields={Fields}
                handleCalculate={handleSubmit} />
        </div>
    );
};

export default CalculateFee;
