import React from 'react';
import { reduxForm } from 'redux-form';
import { Button } from '../';
import renderFields from './factoryFields';
import { getErrorLocalized } from '../../utils/errors';

const createForm = (formName, otherProps = {}) => {
	const formProperties = {
		form: formName,
		...otherProps,
	};

	const Form = ({
		handleSubmit,
		submitting,
		pristine,
		error,
		valid,
		formFields = {},
		buttonLabel,
		extraButtonLabel = '',
		extraButtonOnClick = '',
	}) => (
		<form onSubmit={handleSubmit} className="w-100">
			<div className="w-100">
				{renderFields(formFields)}
				{error && (
					<div className="warning_text error_text">
						{getErrorLocalized(error)}
					</div>
				)}
			</div>
			<div className="w-100 buttons-wrapper d-flex">
				{extraButtonLabel && extraButtonOnClick && (
					<Button
						label={extraButtonLabel}
						onClick={extraButtonOnClick}
						type="html"
					/>
				)}
				{extraButtonLabel && extraButtonOnClick && (
					<div className="separator" />
				)}
				<Button
					label={buttonLabel}
					disabled={pristine || submitting || !valid}
				/>
			</div>
		</form>
	);

	return reduxForm(formProperties)(Form);
};

export default createForm;
