import React from 'react';
import { IconTitle, Button } from '../../components';
import { RESET_PASSWORD_SUCCESS } from './constants';
import { ICONS } from '../../config/constants';

const { TITLE, TEXT_1, TEXT_2, BUTTON, ICON } = RESET_PASSWORD_SUCCESS;

const ResetPasswordSuccess = ({ onClick, ...rest }) => {
  return (
    <div className="auth_wrapper">
      <IconTitle
        iconPath={ICONS.SUCCESS_BLACK}
        text={TITLE}
        textType="title"
        className="w-100"
      />
      <div className="text-center">
        {TEXT_1}<br />
        {TEXT_2}
      </div>
      <Button
        label={BUTTON}
        onClick={onClick}
        className="button-margin"
      />
    </div>
  )
}
export default ResetPasswordSuccess;
