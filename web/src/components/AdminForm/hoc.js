import React from 'react';
import renderFields from './utils';
import { reduxForm, reset } from 'redux-form';
import { Button } from 'antd';

const Form = (name, className = '', allowPristine = false) => {
	const HocForm = ({
		handleSubmit,
		submitting,
		pristine,
		error,
		valid,
		fields,
		onSubmit,
		buttonText,
		buttonType,
		small
	}) => {
		return (
			<form className={className}>
				{fields && renderFields(fields)}
				{error && (
					<div>
						<strong>{error}</strong>
					</div>
				)}
				<Button
					type={buttonType ? buttonType : 'primary'}
					onClick={handleSubmit(onSubmit)}
					disabled={
						(allowPristine ? false : fields && pristine) ||
						submitting ||
						!valid ||
						error
					}
					size={small ? 'small' : 'large'}
					className={small ? '' : 'w-100'}
					style={small ? { float: 'right' } : null}
				>
					{buttonText}
				</Button>
			</form>
		);
	};

	return reduxForm({
		form: name,
		// onSubmitFail: (result, dispatch) => dispatch(reset(FORM_NAME)),
		onSubmitSuccess: (result, dispatch) => dispatch(reset(name)),
		enableReinitialize: true
	})(HocForm);
};

export default Form;
