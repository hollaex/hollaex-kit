import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ICONS } from '../../config/constants';
import { Accordion, Loader } from '../../components';
import Form from './Form';
import { generateFormValues as generateMobileFormValues, generateEmailFormValues } from './MobileFormValues';
import { prepareInitialValues, generateFormValues as generateDataFormValues } from './IdentificationFormValues';
import { generateFormValues as generateBankFormValues } from './BankAccountFormValues';

import STRINGS from '../../config/localizedStrings';

const EmailForm = Form('EmailForm');
const MobileForm = Form('MobileForm');
const InformationForm = Form('InformationForm');
const BankForm = Form('BankForm');

class UserVerification extends Component {
  state = {
    sections: [],
    dataFormValues: {},
    mobileFormValues: {},
    bankFormValues: {},
    emailFormValues: {},
  }

  componentDidMount() {
    this.calculateFormValues(this.props.activeLanguage, this.props.verification_level, this.props.email, this.props.userData);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeLanguage !== this.props.activeLanguage) {
      this.calculateFormValues(nextProps.activeLanguage, nextProps.verification_level, nextProps.email, nextProps.userData);
      this.calculateSections(nextProps.verification_level, nextProps.email, nextProps.userData);
    } else if (
      nextProps.verification_level !== this.props.verification_level ||
      nextProps.userData.timestamp !== this.props.userData.timestamp
    ) {
      this.calculateSections(nextProps.verification_level, nextProps.email, nextProps.userData);
    }
  }

  calculateNotification = (activeStep, step, verifyText, verified = false, value = '') => {
    const notification = {
      text: verified ? STRINGS.USER_VERIFICATION.COMPLETED : (activeStep > step ? STRINGS.USER_VERIFICATION.PENDING_VERIFICATION : verifyText),
      status: verified ? 'success' : (activeStep > step ? 'information' : 'warning'),
      iconPath: verified ? ICONS.GREEN_CHECK : (activeStep > step ? ICONS.BLUE_QUESTION : ICONS.RED_ARROW),
      allowClick: activeStep === step
    };
    return notification;
  }

  calculateFormValues = (language, verification_level, email, userData) => {
    const dataFormValues = generateDataFormValues(language);
    const bankFormValues = generateBankFormValues();
    const mobileFormValues = generateMobileFormValues();
    const emailFormValues = generateEmailFormValues();
    this.setState({ dataFormValues, mobileFormValues, bankFormValues, emailFormValues }, () => {
      this.calculateSections(verification_level, email, userData);
    });
  }

  calculateSections = (verification_level, email, userData) => {
    const { dataFormValues, mobileFormValues, bankFormValues, emailFormValues } = this.state;
    const { phone_number, full_name, bank_data } = userData

    const sections = [
      {
        title: STRINGS.USER_VERIFICATION.TITLE_EMAIL,
        subtitle: email,
        content: <EmailForm
          initialValues={{ email }}
          formValues={emailFormValues}
        />,
        // notification: this.calculateNotification(activeStep, 0, STRINGS.USER_VERIFICATION.VERIFY_EMAIL, true)
      },
      {
        title: STRINGS.USER_VERIFICATION.TITLE_MOBILE_PHONE,
        subtitle: phone_number,
        content: <MobileForm
          initialValues={userData}
          formValues={mobileFormValues}
        />,
        // notification: this.calculateNotification(activeStep, 0, STRINGS.USER_VERIFICATION.VERIFY_EMAIL, true)
      },
      {
        title: STRINGS.USER_VERIFICATION.TITLE_PERSONAL_INFORMATION,
        subtitle: full_name,
        content: <InformationForm
          initialValues={prepareInitialValues(userData)}
          formValues={dataFormValues}
        />,
        // notification: this.calculateNotification(activeStep, 1, STRINGS.USER_VERIFICATION.VERIFY_USER_DOCUMENTATION, verification_level >= 2, userData.first_name)
      },
      {
        title: STRINGS.USER_VERIFICATION.TITLE_BANK_ACCOUNT,
        subtitle: bank_data ? bank_data.account_number : '',
        content: <BankForm
          initialValues={userData.bank_account}
          formValues={bankFormValues}
        />,
        // notification: this.calculateNotification(activeStep, 3, STRINGS.USER_VERIFICATION.VERIFY_BANK_ACCOUNT, userData.bank_account.verified, userData.bank_account.type)
      },
      {
        title: STRINGS.USER_VERIFICATION.TITLE_ID_DOCUMENTS,
        content: <div>no content</div>,
        // notification: this.calculateNotification(activeStep, 2, STRINGS.USER_VERIFICATION.VERIFY_ID_DOCUMENTS, userData.id_data.verified, userData.id_data.type)
      },
    ];

    this.setState({ sections });
  }

  render() {
    if (!this.props.id) {
      return <Loader />;
    }
    const { sections } = this.state;

    return (
      <div>
        <Accordion
          sections={sections}
          allowMultiOpen={true}
          wrapperId="app_container-main"
          doScroll={false}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  id: state.user.id,
  verification_level: state.user.verification_level,
  userData: state.user.userData,
  email: state.user.email,
  activeLanguage: state.app.language,
});

export default connect(mapStateToProps)(UserVerification);
