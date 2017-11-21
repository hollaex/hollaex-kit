import React from 'react';
import { IconTitle } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

const SignupSuccess = ({ ...rest }) => {
  return (
    <div className="signup_success-wrapper auth_wrapper">
      <IconTitle
        iconPath={ICONS.CHECK}
        text={STRINGS.VERIFICATION_TEXTS.TITLE}
        textType="title"
        className="w-100"
      />
      <div className="signup_success-content">
        <p>{STRINGS.VERIFICATION_TEXTS.TEXT_1}</p>
        <p>{STRINGS.VERIFICATION_TEXTS.TEXT_2}</p>
      </div>
    </div>
  )
}
export default SignupSuccess;
