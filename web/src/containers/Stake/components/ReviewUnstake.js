import React from 'react';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';

const ReviewEarlyUnstake = ({ stakeData, onCancel, onProceed }) => {
	const { amount, reward } = stakeData;
	return (
		<div className="w-100">
			<IconTitle
				stringId="UNSTAKE.TITLE"
				text={STRINGS['UNSTAKE.TITLE']}
				textType="title"
				underline={false}
				className="w-100"
			/>
			<div>amount: {amount}</div>
			<div>reward: {reward}</div>
			<div className="d-flex">
				<div className="w-50">
					<EditWrapper stringId="UNSTAKE.CANCEL" />
					<Button label={STRINGS['UNSTAKE.CANCEL']} onClick={onCancel} />
				</div>
				<div className="separator" />
				<div className="w-50">
					<EditWrapper stringId="UNSTAKE.PROCEED" />
					<Button label={STRINGS['UNSTAKE.PROCEED']} onClick={onProceed} />
				</div>
			</div>
		</div>
	);
};

export default ReviewEarlyUnstake;
