import React from 'react';
import { Button, IconTitle } from '../../components';
import { EditWrapper } from 'components';

import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ReviewEmailContent = ({ onConfirmEmail, icons: ICONS }) => {
	return (
		<div className="d-flex flex-column review_email-wrapper">
			<IconTitle
				stringId="WITHDRAW_PAGE.CONFIRM_VIA_EMAIL"
				text={STRINGS['WITHDRAW_PAGE.CONFIRM_VIA_EMAIL']}
				iconId="WITHDRAW_MAIL_CONFIRMATION"
				iconPath={ICONS['WITHDRAW_MAIL_CONFIRMATION']}
				textType="title"
			/>
			<div className="review_email-content">
				<div>
					<EditWrapper stringId="WITHDRAW_PAGE.CONFIRM_VIA_EMAIL_1">
						{STRINGS['WITHDRAW_PAGE.CONFIRM_VIA_EMAIL_1']}
					</EditWrapper>
				</div>
				<div>
					<EditWrapper stringId="WITHDRAW_PAGE.CONFIRM_VIA_EMAIL_2">
						{STRINGS['WITHDRAW_PAGE.CONFIRM_VIA_EMAIL_2']}
					</EditWrapper>
				</div>
				<div>
					<EditWrapper stringId="WITHDRAW_PAGE.CONFIRM_VIA_EMAIL_3">
						{STRINGS['WITHDRAW_PAGE.CONFIRM_VIA_EMAIL_3']}
					</EditWrapper>
				</div>
			</div>
			<Button
				label={STRINGS['NOTIFICATIONS.BUTTONS.OKAY']}
				onClick={onConfirmEmail}
			/>
		</div>
	);
};

export default withConfig(ReviewEmailContent);
