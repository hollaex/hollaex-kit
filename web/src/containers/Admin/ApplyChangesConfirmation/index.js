import React from 'react';
import { Button, Modal } from 'antd';

import { STATIC_ICONS } from 'config/icons';
import './index.css';

const ApplyChangesConfirmation = ({ isVisible, handleApply, handleClose }) => {
	return (
		<Modal visible={isVisible} footer={null} onCancel={handleClose}>
			<div className="apply-confirm-container">
				<div className="apply-confirmation">
					<img
						src={STATIC_ICONS.RESTART_CIRCLE_ICON}
						className="apply-restart-icon"
						alt="apply_changes"
					/>
					<div className="title">Apply changes</div>
				</div>
				<div className="apply-confirm-info">
					Applying the changes now may cause a short disruption to your exchange
					service.
				</div>
				<div className="apply-confirm-info">
					Do you want to apply the changes to the live exchanges now?
				</div>
				<div className="btn-wrapper">
					<Button type="primary" className="apply-btn" onClick={handleClose}>
						Apply later
					</Button>
					<div className="separator"></div>
					<Button type="primary" className="apply-btn" onClick={handleApply}>
						Apply now
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ApplyChangesConfirmation;
