import React from 'react';
import renderFields from './utils';
import { reduxForm, reset, getFormValues } from 'redux-form';
import { Button } from 'antd';
import { connect } from 'react-redux';
import FormButton from 'components/FormButton/Button';

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
		isConfirmModal = false,
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
				<div className={isConfirmModal ? 'd-flex justify-content-between' : ''}>
					{secondaryBtnTxt ? (
						<Button
							type="primary"
							onClick={onClose}
							className={`green-btn ${isConfirmModal ? 'btn-48' : ''}`}
						>
							{secondaryBtnTxt}
						</Button>
					) : null}
					<FormButton
						type={buttonType ? buttonType : 'primary'}
						handleSubmit={handleSubmit(onSubmit)}
						disabled={
							disableAllFields ||
							(allowPristine ? false : fields && pristine) ||
							submitting ||
							!valid ||
							error ||
							buttonSubmitting
						}
						size={small ? 'small' : 'large'}
						className={`${small ? buttonClass : buttonClass} ${
							isConfirmModal ? 'btn-48' : 'w-100'
						}`}
						style={small ? { float: 'right' } : null}
						buttonText={buttonText}
						secondaryClassName={'w-100'}
					/>
				</div>
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
		formValues: getFormValues(name)(state),
	});
	return connect(mapStateToProps)(CommonHocForm);
};

export default Form;
