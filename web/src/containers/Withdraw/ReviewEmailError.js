import React from 'react';
import { Button, IconTitle } from '../../components';
import { EditWrapper } from 'components';

import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ReviewEmailErrorContent = ({ onClose, icons: ICONS }) => {
	return (
		<div className="d-flex flex-column review_email_error-wrapper">
			<div className="pl-5 pr-5 pt-3 pb-5">
				<div className="d-flex justify-content-center align-items-center flex-direction-column">
					<EditWrapper iconId="WITHDRAWALS_EMAIL_ERROR_ICON">
						<div className="email_error-icon">
							<div>?!</div>
						</div>
					</EditWrapper>
					<IconTitle
						stringId="WITHDRAW_PAGE.WITHDRAWALS_FORM_ERROR_TITLE"
						text={STRINGS['WITHDRAW_PAGE.WITHDRAWALS_FORM_ERROR_TITLE']}
						textType="title"
					/>
				</div>
				<div className="review_email-error">
					<div>
						<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAWALS_FORM_ERROR">
							{STRINGS['WITHDRAW_PAGE.WITHDRAWALS_FORM_ERROR']}
						</EditWrapper>
					</div>
				</div>
			</div>
			<Button label={STRINGS['NOTIFICATIONS.BUTTONS.OKAY']} onClick={onClose} />
		</div>
	);
};

export default withConfig(ReviewEmailErrorContent);
