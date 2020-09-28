import React from 'react';
import { Button, IconTitle } from '../../components';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

const ReviewEmailContent = ({ onConfirmEmail }) => {
    return (
        <div className="d-flex flex-column review_email-wrapper">
            <IconTitle
                text={STRINGS["WITHDRAW_PAGE.CONFIRM_VIA_EMAIL"]}
                iconPath={ICONS.WITHDRAW_MAIL_CONFIRMATION}
                useSvg={true}
                textType="title"
            />
            <div className="review_email-content">
                <div>{STRINGS["WITHDRAW_PAGE.CONFIRM_VIA_EMAIL_1"]}</div>
                <div>{STRINGS["WITHDRAW_PAGE.CONFIRM_VIA_EMAIL_2"]}</div>
                <div>{STRINGS["WITHDRAW_PAGE.CONFIRM_VIA_EMAIL_3"]}</div>
            </div>
            <Button label={STRINGS["NOTIFICATIONS.BUTTONS.OKAY"]} onClick={onConfirmEmail} />
        </div>
    );
}

export default ReviewEmailContent;
