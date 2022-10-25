import React from 'react';
import { Button, EditWrapper } from 'components';
import { ClockCircleOutlined } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';

const PendingDeposit = ({ onOkay }) => {
	return (
		<div style={{ width: '48rem' }}>
			<div
				className="d-flex align-items-baseline"
				style={{ 'font-size': '2.2rem' }}
			>
				<div>
					<ClockCircleOutlined className="pr-3" />
				</div>
				<div className="important-text">
					<EditWrapper stringId="PENDING_DEPOSIT_TITLE">
						{STRINGS['PENDING_DEPOSIT_TITLE']}
					</EditWrapper>
				</div>
			</div>

			<div className="secondary-text pt-3" style={{ 'font-size': '1.1rem' }}>
				<EditWrapper stringId="PENDING_DEPOSIT_TEXT_1">
					{STRINGS['PENDING_DEPOSIT_TEXT_1']}
				</EditWrapper>
			</div>

			<div className="secondary-text pt-3" style={{ 'font-size': '1.1rem' }}>
				<EditWrapper stringId="PENDING_DEPOSIT_TEXT_2">
					{STRINGS['PENDING_DEPOSIT_TEXT_2']}
				</EditWrapper>
			</div>

			<div className="d-flex mt-4 pt-3">
				<EditWrapper stringId="DONE" />
				<Button label={STRINGS['DONE']} onClick={onOkay} className="mb-3" />
			</div>
		</div>
	);
};

export default PendingDeposit;
