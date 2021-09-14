import React from 'react';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';

const WarningContent = ({ onBack, onReview }) => {
	return (
		<div>
			<IconTitle
				stringId="UNSTAKE.EARLY_WARNING_TITLE"
				text={STRINGS['UNSTAKE.EARLY_WARNING_TITLE']}
				textType="title"
				underline={false}
				className="w-100"
			/>
			<div>
				<EditWrapper stringId="UNSTAKE.EARLY_WARNING_TEXT_1">
					{STRINGS['UNSTAKE.EARLY_WARNING_TEXT_1']}
				</EditWrapper>
			</div>
			<div>
				<EditWrapper stringId="UNSTAKE.EARLY_WARNING_TEXT_2">
					{STRINGS['UNSTAKE.EARLY_WARNING_TEXT_2']}
				</EditWrapper>
			</div>
			<div className="d-flex">
				<div className="w-50">
					<EditWrapper stringId="UNSTAKE.BACK" />
					<Button label={STRINGS['UNSTAKE.BACK']} onClick={onBack} />
				</div>
				<div className="separator" />
				<div className="w-50">
					<EditWrapper stringId="UNSTAKE.REVIEW" />
					<Button label={STRINGS['UNSTAKE.REVIEW']} onClick={onReview} />
				</div>
			</div>
		</div>
	);
};

export default WarningContent;
