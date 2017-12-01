import React from 'react';
import { ICONS } from '../../config/constants';

import { IconTitle, Button } from '../../components';

import { REQUEST_RESET_PASSWORD_SUCCESS } from './constants';

const RequestResetPasswordSuccess = ({ onLoginClick, onContactUs }) => (
  <div className="auth_wrapper">
    <IconTitle
      iconPath={ICONS.PASSWORD_RESET}
      text={REQUEST_RESET_PASSWORD_SUCCESS.TITLE}
      textType="title"
      className="w-100"
    />
    <div className="text-center">
      {REQUEST_RESET_PASSWORD_SUCCESS.TEXT}
    </div>
    <div className="button-margin d-flex">
      <Button
        label={REQUEST_RESET_PASSWORD_SUCCESS.BUTTON_1}
        onClick={onLoginClick}
      />
      <div className="separator"></div>
      <Button
        label={REQUEST_RESET_PASSWORD_SUCCESS.BUTTON_2}
        onClick={onContactUs}
      />
    </div>
  </div>
);

export default RequestResetPasswordSuccess;
