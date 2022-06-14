import React from 'react';
import renderFields from './utils';
import { reduxForm, reset, getFormValues } from 'redux-form';
import { Button } from 'antd';
import { connect } from 'react-redux';

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
		small,
		buttonClass = '',
		submitOnKeyDown = false,
		disableAllFields = false,
		secondaryBtnTxt = '',
		onClose = () => {},
		buttonSubmitting = false,
		renderCustomFooter = () => {},
		formValues,
	}) => {
		return (
			<form
				className={className}
				onKeyDown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						if (submitOnKeyDown && !submitting && valid && !error) {
							e.preventDefault();
							handleSubmit(onSubmit)();
						}
					}
				}}
			>
				{fields && renderFields(fields, disableAllFields)}
				{error && (
					<div>
						<strong>{error}</strong>
					</div>
				)}
				{renderCustomFooter(formValues)}
				{secondaryBtnTxt ? (
					<Button type="primary" onClick={onClose} className={'green-btn'}>
						{secondaryBtnTxt}
					</Button>
				) : null}
				<Button
					type={buttonType ? buttonType : 'primary'}
					onClick={handleSubmit(onSubmit)}
					disabled={
						disableAllFields ||
						(allowPristine ? false : fields && pristine) ||
						submitting ||
						!valid ||
						error ||
						buttonSubmitting
					}
					size={small ? 'small' : 'large'}
					className={small ? `${buttonClass}` : `w-100 ${buttonClass}`}
					style={small ? { float: 'right' } : null}
				>
					{buttonText}
				</Button>
			</form>
		);
	};

	const CommonHocForm = reduxForm({
		form: name,
		// onSubmitFail: (result, dispatch) => dispatch(reset(FORM_NAME)),
		onSubmitSuccess: (result, dispatch) => dispatch(reset(name)),
		enableReinitialize: true,
	})(HocForm);

	const mapStateToProps = (state) => ({
		formValues: getFormValues(name)(state)
	});
	return connect(mapStateToProps)(CommonHocForm);
};

export default Form;
