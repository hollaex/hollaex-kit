import React from 'react';
import { IconTitle } from '../../components';
import { VERIFICATION_TEXTS } from './constants';

const { TITLE, TEXT_1, TEXT_2, BUTTON, ICON } = VERIFICATION_TEXTS;

const SignupSuccess = ({ ...rest }) => {
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
        <p>{TEXT_2}</p>
      </div>
    </div>
  )
}
export default SignupSuccess;
