import React from 'react';
import { Button, Modal } from 'antd';
import { ReactSVG } from 'react-svg';
import { STATIC_ICONS } from 'config/icons';

const VerifyEmailConfirmation = ({ userData = {}, onConfirm, ...rest }) => (
	<Modal footer={null} width={350} {...rest}>
		<div>
			<div className="d-flex mb-2">
				<div>
					<ReactSVG src={STATIC_ICONS.USER_EMAIL} className={'about-icon'} />
				</div>
				<h3 className="ml-3 pt-2" style={{ color: '#ffffff' }}>
					Email verification
				</h3>
			</div>
			<div className="mb-4">
				<div className="mb-3">
					<span className="bold">Email:</span>
					<span className="pl-2">{userData.email}</span>
				</div>
				<div>Are you sure you want to mark this email as verified?</div>
			</div>
			<div>
				<Button className="green-btn w-100" onClick={onConfirm}>
					Confirm
				</Button>
			</div>
		</div>
	</Modal>
);

export default VerifyEmailConfirmation;
