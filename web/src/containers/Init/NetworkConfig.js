import React from 'react';
import { Input, Form, Button, message } from 'antd';
import { ReactSVG } from 'react-svg';

import { storeAdminKey } from '../../actions/authAction';

const { Item } = Form;

const NetworkConfig = (props) => {
	const handleSubmit = (values) => {
		storeAdminKey(values)
			.then((res) => {
				props.onChangeStep('email');
			})
			.catch((error) => {
				let errMsg = '';
				if (error.response) {
					errMsg = error.response.data.message;
				} else {
					errMsg = error.message;
				}
				message.error(errMsg);
			});
		props.onChangeStep('email');
	};
	return (
		<div className="setup-container">
			<div className="content info-container">
				<div>
					<ReactSVG src={props.icon} className="email-icon" />
				</div>
				<div className="wrapper">
					<div className="header">Exchange operator network keys</div>
					<div className="description">
						<div>
							Your exchange network keys are required before creating your admin
							account.
						</div>
						<div>If you don't have the keys you can obtain them here.</div>
					</div>
					<Form name="network-config-form" onFinish={handleSubmit}>
						<div className="setup-field-wrapper setup-field-content">
							<div className="setup-field-label">Public key</div>
							<Item
								name="api_key"
								rules={[
									{
										required: true,
										message: 'Please input public key',
									},
								]}
							>
								<Input />
							</Item>
							<div className="setup-field-label">Secret key</div>
							<Item
								name="api_secret"
								rules={[
									{
										required: true,
										message: 'Please input secret key',
									},
								]}
							>
								<Input />
							</Item>
						</div>
						<div className="btn-container">
							<Button htmlType="submit">Proceed</Button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default NetworkConfig;
