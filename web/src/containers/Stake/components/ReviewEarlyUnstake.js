import React from 'react';
import { EditWrapper, Button, IconTitle, ProgressBar } from 'components';
import STRINGS from 'config/localizedStrings';

const ReviewEarlyUnstake = ({ stakeData, onCancel, onProceed }) => {
	const { partial, total, progressStatusText } = stakeData;
	return (
		<div>
			<IconTitle
				stringId="UNSTAKE.EARLY_TITLE"
				text={STRINGS['UNSTAKE.EARLY_TITLE']}
				textType="title"
				underline={false}
				className="w-100"
			/>
			<div>
				<EditWrapper stringId="UNSTAKE.DURATION">
					{STRINGS['UNSTAKE.DURATION']}
				</EditWrapper>
			</div>
			<div className="d-flex">
				<ProgressBar partial={partial} total={total} />
				<div className="px-2 align-center">{progressStatusText}</div>
			</div>

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
