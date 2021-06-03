import React from 'react';
import { Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { reduxForm } from 'redux-form';

import renderFields from 'components/AdminForm/utils';

const UserForm = (name) => {
	const Form = ({
		handleSubmit,
		submitting,
		pristine,
		error,
		valid,
		fields,
		onSubmit,
		toggleVisibility,
		initialValues,
	}) => {
		return (
			<form>
				<div className="w-50">
					{Object.keys(fields).length ? (
						<div className="d-flex">
							{fields && renderFields(fields)}
							{error && (
								<div>
									<strong>{error}</strong>
								</div>
							)}
							<div
								className="icon-wrapper"
								onClick={() => toggleVisibility('remove_meta', fields)}
							>
								<CloseCircleOutlined />
							</div>
						</div>
					) : null}
				</div>
				<Button
					type="primary"
					onClick={handleSubmit(onSubmit)}
					disabled={pristine || submitting || !valid || error}
					size="large"
					className="green-btn my-3"
				>
					Save
				</Button>
			</form>
		);
	};

	return reduxForm({
		form: name,
		enableReinitialize: true,
	})(Form);
};

export default UserForm;
