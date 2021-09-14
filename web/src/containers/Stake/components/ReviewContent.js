import React from 'react';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import { getEstimatedRemainingTime } from 'utils/eth';

const ReviewContent = ({
	tokenData,
	onCancel,
	onProceed,
	currentBlock,
	period,
	amount,
}) => {
	const { symbol } = tokenData;
	return (
		<div>
			<IconTitle
				stringId="STAKE.REVIEW_MODAL_TITLE"
				text={STRINGS['STAKE.REVIEW_MODAL_TITLE']}
				textType="title"
				underline={false}
				className="w-100"
			/>
			<div className="secondary-text">
				{STRINGS.formatString(
					STRINGS['STAKE.CURRENT_ETH_BLOCK'],
					<span className="blue-link">{currentBlock}</span>
				)}
			</div>
			<div>{`${amount} ${symbol}`}</div>
			<div>{getEstimatedRemainingTime(period).join(' ')}</div>
			<div className="d-flex">
				<div className="w-50">
					<EditWrapper stringId="STAKE.CANCEL" />
					<Button label={STRINGS['STAKE.CANCEL']} onClick={onCancel} />
				</div>
				<div className="separator" />
				<div className="w-50">
					<EditWrapper stringId="STAKE.PROCEED" />
					<Button label={STRINGS['STAKE.PROCEED']} onClick={onProceed} />
				</div>
			</div>
		</div>
	);
};

export default ReviewContent;
