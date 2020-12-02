import React from 'react';
import { reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';

const DumbForm = (formName) => {
	const Form = (props) => {
		const { handleSubmit, formValues = {}, children } = props;
		return (
			<form onSubmit={handleSubmit} className="user_verification-form">
				{children}
				{renderFields(formValues)}
			</form>
		);
	};

	return reduxForm({
		form: formName,
	})(Form);
};

export default DumbForm;
