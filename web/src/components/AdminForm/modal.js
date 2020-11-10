import React from 'react';
import renderFields from './utils';
import { reduxForm, reset } from 'redux-form';
import { Modal } from 'antd';

const Form = (name, className = '', allowPristine = false) => {
	const ModalForm = ({
		handleSubmit,
		submitting,
		pristine,
		error,
		valid,
		fields,
		onSubmit,
		onCancel,
		title,
		buttonText,
		buttonType,
		small,
		visible,
		okText = 'Create',
		initialValues,
		CustomRenderContent,
		customLevels,
		...rest
	}) => {
		return (
			<form className={className}>
				<Modal
					visible={visible}
					title={title}
					okText={okText}
					onCancel={onCancel}
					onOk={handleSubmit(onSubmit)}
				>
					{CustomRenderContent ? (
						<CustomRenderContent
							fields={fields}
							customLevels={customLevels}
							{...rest}
						/>
					) : (
						fields && renderFields(fields)
					)}
					{error && (
						<div>
							<strong>{error}</strong>
						</div>
					)}
				</Modal>
			</form>
		);
	};

	return reduxForm({
		form: name,
		// onSubmitFail: (result, dispatch) => dispatch(reset(FORM_NAME)),
		onSubmitSuccess: (result, dispatch) => dispatch(reset(name)),
		enableReinitialize: true,
	})(ModalForm);
};

export default Form;
