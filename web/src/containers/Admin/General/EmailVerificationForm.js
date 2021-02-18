import React from 'react';
import { Button, Checkbox, Form } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

const { Item } = Form;

const EmailVerificationForm = ({
	initialValues = {},
	handleSaveEmailVerification,
}) => {
	const handleSubmit = (values) => {
		let formValues = {};
		if (values) {
			formValues = {
				email_verification_required: !!values.email_verification_required,
			};
			handleSaveEmailVerification(formValues);
		}
	};
	return (
		<div className="general-wrapper mb-5 ml-5">
			<div className="sub-title">Email verification</div>
			<Form
				name="email-verification-form"
				initialValues={initialValues}
				onFinish={handleSubmit}
			>
				<div className="interface-box mb-5">
					<Item
						name="email_verification_required"
						valuePropName="checked"
						className="mb-0"
					>
						<Checkbox className="mt-3">
							<div className="d-flex align-items-center">
								<div className="ml-2 checkbox-txt">
									Enable email verification requirement
								</div>
							</div>
						</Checkbox>
					</Item>
					<div className="my-3 ml-3">
						<div className="description">
							<InfoCircleFilled />
							<span className="ml-3">
								If enabled you must have an automated email service setup
								configured.
							</span>
						</div>
					</div>
				</div>
				<div>
					<Button
						type="primary"
						htmlType="submit"
						className="green-btn minimal-btn"
					>
						Save
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default EmailVerificationForm;
