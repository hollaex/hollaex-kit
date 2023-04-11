import React from 'react';
import { Button, Input, Form, message } from 'antd';
import { requestAddUser } from '../User/actions';

const { Item } = Form;

const AddUser = ({ onCancel, requestFullUsers }) => {
	const onFinish = (values) => {
		const { password, confirmPassword, userEmail } = values;

		if (password === confirmPassword) {
			requestAddUser({ email: userEmail, password: password })
				.then((res) => {
					onCancel();
					requestFullUsers();
				})
				.catch((error) => {
					message.error(error.data.message);
				});
		} else {
			message.error('Password do not match');
		}
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
					initialValue=""
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
					initialValue=""
					rules={[
						{
							required: true,
							message:
								'Invalid password. It has to contain at least 8 characters, at least one digit and one character.',
							pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
						},
					]}
				>
					<Input.Password />
				</Item>

				<Item
					label="Confirm Password"
					name="confirmPassword"
					initialValue=""
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
					<Button className="mr-5" onClick={onCancel} type="sucess">
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
