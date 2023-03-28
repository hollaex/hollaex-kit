import React from 'react';
import { Button, Input, Form, message } from 'antd';
import { requestAddUser } from '../User/actions';

const { Item } = Form;

const AddUser = ({ onCancel }) => {
	const onFinish = (values) => {
		const { password, confirmPassword, userEmail } = values;

		if (password === confirmPassword) {
			requestAddUser({ email: userEmail, password: password });
		} else {
			message.error('Password and confirm password should be same');
		}

		return onCancel();
	};

	return (
		<div>
			<div className="header-txt mb-5">
				<span>Add new users</span>
				<p> Create a new user account and have it added to your platform</p>
			</div>

			<Form name="addUser" onFinish={onFinish} layout="vertical">
				<Item
					label="Email"
					name="userEmail"
					rules={[
						{
							required: true,
							message: 'Please input your mail!',
						},
					]}
				>
					<Input />
				</Item>

				<Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: 'Please input your password!',
						},
					]}
				>
					<Input.Password />
				</Item>

				<Item
					label="Confirm Password"
					name="confirmPassword"
					rules={[
						{
							required: true,
							message: 'Please input your password!',
						},
					]}
				>
					<Input.Password />
				</Item>

				<div className="footer mt-5">
					<Button
						className="mr-5"
						onClick={() => this.setState({ isVisible: false })}
						type="sucess"
					>
						Back
					</Button>
					<Button type="sucess" htmlType="submit">
						Next
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default AddUser;
