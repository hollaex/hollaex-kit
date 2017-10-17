import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import { ICONS } from '../../config/constants';
import { updateUser, updateDocuments, setMe, setUserData } from '../../actions/userAction';
import { Accordion } from '../../components';
import IdentificationForm from './IdentificationForm';
import { prepareInitialValues } from './IdentificationFormValues';
import DocumentsForm from './DocumentsForm';
import BankAccountForm from './BankAccountForm';

class UserVerification extends Component {
  state = {
    sections: [],
  }

  componentDidMount() {
    this.calculateSections(this.props.verification_level, this.props.email, this.props.userData);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.verification_level !== this.props.verification_level ||
      nextProps.userData.timestamp !== this.props.userData.timestamp
    ) {
      this.calculateSections(nextProps.verification_level, nextProps.email, nextProps.userData);
    }
  }

  activeStep = (verification_level = 0, { first_name = '', id_data = {}, bank_account = {} }) => {
    if (verification_level < 1) {
      return 0;
    } else if (!first_name) {
      return 1;
    } else if (!id_data.type) {
      return 2;
    } else if (!bank_account.bank_name) {
      return 3
    } else {
      return 4;
    }
  }

  calculateNotification = (activeStep, step, verifyText, verified = false, value = '') => {
    const notification = {
      text: verified ? 'completed' : (activeStep > step ? 'pending verification' : verifyText),
      status: verified ? 'success' : (activeStep > step ? 'information' : 'warning'),
      iconPath: verified ? ICONS.GREEN_CHECK : (activeStep > step ? ICONS.BLUE_QUESTION : ICONS.RED_ARROW),
      allowClick: activeStep === step
    };
    return notification;
  }

  calculateSections = (verification_level, email, userData) => {
    const activeStep = this.activeStep(verification_level, userData);

    const sections = [{
      title: 'Email',
      content: <div>{email}</div>,
      disabled: activeStep !== 0,
      notification: this.calculateNotification(activeStep, 0, 'verify email', true)
    },
    {
      title: 'Identification',
      content: <IdentificationForm
        onSubmit={this.onSubmitUserInformation}
        initialValues={prepareInitialValues(userData)}
      />,
      disabled: activeStep !== 1,
      notification: this.calculateNotification(activeStep, 1, 'verify user documentation', verification_level >= 2, userData.first_name)
    },
    {
      title: 'Documents',
      content: <DocumentsForm
        onSubmit={this.onSubmitUserDocuments}
        initialValues={userData.id_data}
      />,
      disabled: activeStep !== 2,
      notification: this.calculateNotification(activeStep, 2, 'verify id documents', userData.id_data.verified, userData.id_data.type)
    },
    {
      title: 'Bank Account',
      content: <BankAccountForm
        onSubmit={this.onSubmitBankAccount}
        initialValues={userData.bank_account}
      />,
      disabled: activeStep !== 3,
      notification: this.calculateNotification(activeStep, 3, 'verify bank account', userData.bank_account.verified, userData.bank_account.type)
    }];

    this.setState({ sections });
  }

  onSubmitUserInformation = (values) => {
    return updateUser(values)
      .then((res) => {
        this.props.setMe(res.data);
        if (this.accordion) {
          this.accordion.openNextSection();
        }
      }).catch((err) => {
        console.log(err)
        const _error = err.data ? err.data.message : err.message
        throw new SubmissionError({ _error })
      })
  }

  onSubmitUserDocuments = (values) => {
    return updateDocuments(values)
      .then((res) => {
        this.props.setUserData({ id_data: values });
        if (this.accordion) {
          this.accordion.openNextSection();
        }
      }).catch((err) => {
        console.log(err.data, err.message)
        const _error = err.data ? err.data.message : err.message
        throw new SubmissionError({ _error })
      })
  }

  onSubmitBankAccount = (values) => {
    this.onSubmitUserInformation({ bank_account: values });
  };

  setRef = (el) => {
    this.accordion = el;
  }

  render() {
    if (!this.props.id) {
      return <div>Loading</div>;
    }
    const { sections } = this.state;

    return (
      <div>
        <Accordion
          sections={sections}
          ref={this.setRef}
          wrapperId="app_container-main"
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
});

const mapDispatchToProps = (dispatch) => ({
  setMe: (data) => dispatch(setMe(data)),
  setUserData: (data) => dispatch(setUserData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserVerification);
