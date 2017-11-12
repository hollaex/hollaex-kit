import React from 'react';
import { IconTitle, Button } from '../../components';
import { VERIFICATION_RESEND_TEXTS } from './constants';

const { TITLE, TEXT_1, BUTTON, ICON } = VERIFICATION_RESEND_TEXTS;

const EmailRequestSuccess = ({ onClick, ...rest }) => {
  return (
    <div className="signup_success-wrapper auth_wrapper">
      <IconTitle
        iconPath={ICON}
        text={TITLE}
        textType="title"
        className="w-100"
      />
      <div className="signup_success-content">
        <p>{TEXT_1}</p>
      </div>
      <Button label={BUTTON} onClick={onClick} />
    </div>
  )
}
export default EmailRequestSuccess;
