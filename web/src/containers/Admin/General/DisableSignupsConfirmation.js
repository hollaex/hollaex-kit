import React from 'react';
import { Button, Modal } from 'antd';
import { WarningFilled } from '@ant-design/icons';

const DisableSignupsConfirmation = ({ onConfirm, ...rest }) => (
	<Modal footer={null} width={350} {...rest}>
		<div>
			<h3 style={{ color: '#ffffff' }}>Turn off sign ups</h3>
			<div className="d-flex mb-3">
				<div>
					<WarningFilled
						style={{ color: 'red', fontSize: '25px', marginRight: '10px' }}
					/>
				</div>
				<div>
					Turning off sign ups will mean no new users will be able to sign up on
					your platform. Are you sure you want to do this?
				</div>
			</div>
			<div>
				<Button className="green-btn w-100" onClick={onConfirm}>
					Yes, proceed
				</Button>
			</div>
		</div>
	</Modal>
);

export default DisableSignupsConfirmation;
