import React from 'react';
import { reduxForm, reset } from 'redux-form';
import { Button } from '../';
import renderFields from './factoryFields';
import { getErrorLocalized } from '../../utils/errors';

const createForm = (name, fields, onSubmit, buttonText) => {
	const Form = ({ handleSubmit, submitting, pristine, error, valid }) => (
		<form className="form">
			{renderFields(fields)}
			{error && (
				<div>
					<strong>{getErrorLocalized(error)}</strong>
				</div>
			)}
			<Button
				onClick={handleSubmit(onSubmit)}
				disabled={pristine || submitting || !valid}
				label={buttonText}
			/>
		</form>
	);

	return reduxForm({
		form: name,
		// onSubmitFail: (result, dispatch) => dispatch(reset(FORM_NAME)),
		onSubmitSuccess: (result, dispatch) => dispatch(reset(name)),
		enableReinitialize: true,
	})(Form);
};

export default createForm;
