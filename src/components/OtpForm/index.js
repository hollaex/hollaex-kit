import React from 'react';
import { reduxForm } from 'redux-form';
import { required } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle, ActionNotification } from '../';
import { TEXTS } from './constants';

const FormValues = {
  otp_code: {
    type: 'number',
    label: TEXTS.OTP_LABEL,
    placeholder: TEXTS.OTP_PLACEHOLDER,
    validate: [required],
    fullWidth: true,
  },
};

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid, onClickHelp } = props;
  return (
    <div className="otp_form-wrapper">
      <IconTitle
        text={TEXTS.OTP_TITLE}
        iconPath={TEXTS.OTP_TITLE_ICON}
      />
      <div className="otp_form-title-wrapper">
        <span className="otp_form-title-text">Enter your authentication code to continue</span>
        {onClickHelp &&
          <ActionNotification
            text={TEXTS.OTP_HELP}
            onClick={onClickHelp}
            iconPath={TEXTS.OTP_HELP_ICON}
            status="information"
          />
        }
      </div>
      <form onSubmit={handleSubmit} className="w-100">
        <div className="w-100 otp_form-fields">
          {renderFields(FormValues)}
          {error && <div className="warning_text">{error}</div>}
        </div>
        <Button
          label={TEXTS.OTP_BUTTON}
          disabled={pristine || submitting || !valid}
        />
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'OtpForm',
})(Form);
