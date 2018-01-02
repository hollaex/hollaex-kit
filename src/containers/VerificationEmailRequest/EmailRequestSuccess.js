import React from 'react';
import { IconTitle, Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

const EmailRequestSuccess = ({ onClick, ...rest }) => {
  return (
    <div className="signup_success-wrapper auth_wrapper">
      <IconTitle
        iconPath={ICONS.VERIFICATION_SENT}
        text={STRINGS.VERIFICATION_EMAIL_REQUEST_SUCCESS.TITLE}
        textType="title"
        className="w-100"
      />
      <div className="signup_success-content">
        <p>{STRINGS.VERIFICATION_EMAIL_REQUEST_SUCCESS.TEXT_1}</p>
      </div>
      <Button label={STRINGS.CONTACT_US_TEXT} onClick={onClick} />
    </div>
  )
}
export default EmailRequestSuccess;
