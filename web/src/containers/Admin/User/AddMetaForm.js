import React, { useEffect } from 'react';
import { Button } from 'antd';
import { reduxForm, reset } from 'redux-form';

import renderFields from 'components/AdminForm/utils';

const AddMetaForm = ({
	handleSubmit,
	onSubmit,
	toggleVisibility,
	add_meta_field,
	btnDisable,
	metaType,
	isVisible,
	resetForm,
	dispatch,
	isAddMeta,
	pristine,
	error,
	valid,
	submitting,
}) => {
	useEffect(() => {
		if (!isVisible) {
			resetForm('', dispatch);
		}
	}, [isVisible, dispatch, resetForm]);

	return (
		<form onSubmit={handleSubmit} className="modal-wrapper">
			<div className="title">{isAddMeta ? 'Add new meta' : 'Edit meta'}</div>
			<div className="w-50">{renderFields(add_meta_field)}</div>
			<div className="d-flex">
				<Button
					type="primary"
					className="green-btn"
					block
					onClick={toggleVisibility}
				>
					Back
				</Button>
				<div className="m-1" />
				<Button
					type="primary"
					onClick={handleSubmit(onSubmit)}
					className="green-btn"
					block
					disabled={btnDisable || pristine || submitting || !valid || error}
				>
					Confirm
				</Button>
			</div>
		</form>
	);
};

export default reduxForm({
	form: 'AddMetaForm',
	enableReinitialize: true,
	resetForm: (result, dispatch) => dispatch(reset('AddMetaForm')),
})(AddMetaForm);
