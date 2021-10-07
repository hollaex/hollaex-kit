import React, { Fragment } from 'react';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const WarningContent = ({ icons: ICONS, onBack, onReview }) => {
	return (
		<Fragment>
			<div className="dialog-content">
				<IconTitle
					iconPath={ICONS['STAKING_ERROR']}
					iconId="STAKING_ERROR"
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
			</div>

			<div className="dialog-content bottom w-100">
				<div className="d-flex mt-4 pt-3">
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
		</Fragment>
	);
};

export default withConfig(WarningContent);
