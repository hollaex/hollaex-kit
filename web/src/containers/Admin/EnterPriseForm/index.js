import React from 'react';
import { Form, Button, Input, Radio } from 'antd';

import './index.scss';

const { TextArea } = Input;

const EnterpriseForm = (props) => {
	const [form] = Form.useForm();
	const handleSubmit = () => {
		form
			.validateFields()
			.then((values) => {
				const { fiat_system_description, ...rest } = values;
				let formValues = {
					...rest,
				};
				props.onSubmitEnterprise(formValues);
			})
			.catch((error) => {});
	};

	return (
		<div>
			<div className="fiat-section">
				<b>Fiat Ramp application</b>
				<div className="warning-text">
					It is important to complete the form with correct and detailed
					information to avoid delays.
				</div>
				<div className="w-75">
					After completing the form below a sales representative will email you
					within 24/48 hours with further instructions of how to proceed.
				</div>
			</div>
			<Form
				onFinish={handleSubmit}
				className="enterprise-form"
				requiredMark={false}
				form={form}
			>
				<div className="form-container">
					<Form.Item
						name="name"
						rules={[
							{
								required: true,
								message: 'Required value',
							},
						]}
						label="Full Name"
						labelCol={{ span: 24 }}
						labelAlign={'left'}
					>
						<Input placeholder="Write your full name" />
					</Form.Item>
					<Form.Item
						name="company"
						rules={[
							{
								required: true,
								message: 'Required value',
							},
						]}
						label="Company"
						labelCol={{ span: 24 }}
						labelAlign={'left'}
					>
						<Input placeholder="Company" />
					</Form.Item>
					<Form.Item
						name="country"
						rules={[
							{
								required: true,
								message: 'Required value',
							},
						]}
						label="Country"
						labelCol={{ span: 24 }}
						labelAlign={'left'}
					>
						<Input placeholder="Country" />
					</Form.Item>
					<Form.Item
						name="website"
						rules={[
							{
								required: true,
								message: 'Required value',
							},
						]}
						label="Website"
						labelCol={{ span: 24 }}
						labelAlign={'left'}
					>
						<Input placeholder="Website" />
					</Form.Item>
					<Form.Item
						name="phone"
						rules={[
							{
								required: true,
								message: 'Required value',
							},
						]}
						label="Phone"
						labelCol={{ span: 24 }}
						labelAlign={'left'}
					>
						<Input placeholder="Phone" />
					</Form.Item>
					<Form.Item
						name="business_intro"
						rules={[
							{
								required: true,
								message: 'Required value',
							},
						]}
						label={
							<div>
								<h4>Exchange Buisness Intro</h4>
								<span>
									Short introduction of your exchange buisness such as expected
									user-base, fiat or crypto only and the trading volumes
									expected.
								</span>
							</div>
						}
						labelCol={{ span: 24 }}
						labelAlign={'left'}
					>
						<TextArea
							placeholder="Describe your exchange business idea in detail"
							rows={5}
						/>
					</Form.Item>
					<Form.Item
						name="team"
						rules={[
							{
								required: true,
								message: 'Required value',
							},
						]}
						label={
							<div>
								<h4>Do you have a tech team?</h4>
								<span>
									Are any of your team members developers or have a background
									in technology?{' '}
								</span>
							</div>
						}
						labelCol={{ span: 24 }}
						labelAlign={'left'}
					>
						<Radio.Group>
							<Radio value={true}>Yes</Radio>
							<Radio value={false}>No</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item
						name="has_fiat_system"
						rules={[
							{
								required: true,
								message: 'Required value',
							},
						]}
						label={
							<div>
								<h4>Fiat systems</h4>
								<span>Do you have a bank account or other payment system?</span>
							</div>
						}
						labelCol={{ span: 24 }}
						labelAlign={'left'}
					>
						<Radio.Group>
							<Radio value={true}>Yes</Radio>
							<Radio value={false}>No</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item
						name="fiat_system_description"
						rules={[
							{
								required: true,
								message: 'Required value',
							},
						]}
					>
						<Input placeholder="If yes, provide a brief overview of the fiat systems" />
					</Form.Item>
					<Form.Item
						name="budget"
						rules={[
							{
								required: true,
								message: 'Required value',
							},
						]}
						label={
							<div>
								{' '}
								<h4>Budget</h4>
								<span>
									What is your funding/budget for running an exchange?
								</span>
							</div>
						}
						labelCol={{ span: 24 }}
						labelAlign={'left'}
					>
						{/* <div> */}
						<Radio.Group name="budget" className="budget-options">
							<Radio value={'low'}>Under $9,600</Radio>
							<Radio value={'low-medium'}>Between $9,600 to $50,000</Radio>
							<Radio value={'medium'}>Between $50,000 to $250,000</Radio>
							<Radio value={'high'}>Over $250,000</Radio>
						</Radio.Group>
						{/* </div> */}
					</Form.Item>
				</div>
				<div className="btn-area">
					<Button block type="primary" htmlType="submit">
						submit
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default EnterpriseForm;
