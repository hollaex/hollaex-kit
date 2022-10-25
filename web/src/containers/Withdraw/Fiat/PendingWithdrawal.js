import React from 'react';
import { Button, EditWrapper } from 'components';
import { ClockCircleOutlined } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';

const PendingWithdrawal = ({ onOkay }) => {
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
					<EditWrapper stringId="PENDING_WITHDRAWAL_TITLE">
						{STRINGS['PENDING_WITHDRAWAL_TITLE']}
					</EditWrapper>
				</div>
			</div>

			<div className="secondary-text pt-3" style={{ 'font-size': '1.1rem' }}>
				<EditWrapper stringId="PENDING_WITHDRAWAL_TEXT_1">
					{STRINGS['PENDING_WITHDRAWAL_TEXT_1']}
				</EditWrapper>
			</div>

			<div className="d-flex mt-4 pt-3">
				<EditWrapper stringId="BACK" />
				<Button label={STRINGS['BACK']} onClick={onOkay} className="mb-3" />
			</div>
		</div>
	);
};

export default PendingWithdrawal;
