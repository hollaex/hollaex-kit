import React from 'react';
import { reduxForm } from 'redux-form';
import { required } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle, ActionNotification } from '../';
import { ICONS } from '../../config/constants';

const FormValues = {
  otp_code: {
    type: 'number',
    label: 'OTP Code',
    placeholder: 'Enter the authentication code',
    validate: [required],
    fullWidth: true,
  },
};

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid, onClickHelp } = props;
  return (
    <div className="otp_form-wrapper">
      <IconTitle
        text="Authenticator Code"
        iconPath={ICONS.SQUARE_DOTS}
      />
      <div className="otp_form-title-wrapper">
        <span className="otp_form-title-text">Enter your authentication code to continue</span>
        {onClickHelp &&
          <ActionNotification
            text="Help"
            onClick={onClickHelp}
            iconPath={ICONS.BLUE_QUESTION}
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
          label="Submit"
          disabled={pristine || submitting || !valid}
        />
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'OtpForm',
})(Form);
