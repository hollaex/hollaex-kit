import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import { ICONS } from '../../config/constants';
import { updateUser, updateDocuments, setMe } from '../../actions/userAction';
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

  calculateSections = (verification_level, email, userData) => {
    const activeStep = this.activeStep(verification_level, userData);

    const sections = [{
      title: 'Email',
      content: <div>{email}</div>,
      disabled: activeStep !== 0,
      notification: {
        text: activeStep > 0 ? 'completed' : 'verify email',
        status: activeStep > 0 ? 'success' : 'warning',
        iconPath: activeStep > 0 ? ICONS.GREEN_CHECK : ICONS.RED_ARROW,
        allowClick: activeStep === 0
      }
    },
    {
      title: 'Identification',
      content: <IdentificationForm
        onSubmit={this.onSubmitUserInformation}
        initialValues={prepareInitialValues(userData)}
      />,
      disabled: activeStep !== 1,
      notification: {
        text: activeStep > 1 ? 'completed' : 'verify user documentation',
        status: activeStep > 1 ? 'success' : 'warning',
        iconPath: activeStep > 1 ? ICONS.GREEN_CHECK : ICONS.RED_ARROW,
        allowClick: activeStep === 1
      }
    },
    {
      title: 'Documents',
      content: <DocumentsForm
        onSubmit={this.onSubmitUserDocuments}
        initialValues={userData.id_data}
      />,
      disabled: activeStep !== 2,
      notification: {
        text: activeStep > 2 ? 'completed' : 'verify id documents',
        status: activeStep > 2 ? 'success' : 'warning',
        iconPath: activeStep > 2 ? ICONS.GREEN_CHECK : ICONS.RED_ARROW,
        allowClick: activeStep === 2
      }
    },
    {
      title: 'Bank Account',
      content: <BankAccountForm
        onSubmit={this.onSubmitBankAccount}
        initialValues={userData.bank_account}
      />,
      disabled: activeStep !== 3,
      notification: {
        text: activeStep > 3 ? 'completed' : 'verify bank account',
        status: activeStep > 3 ? 'success' : 'warning',
        iconPath: activeStep > 3 ? ICONS.GREEN_CHECK : ICONS.RED_ARROW,
        allowClick: activeStep === 3
      }
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
});

export default connect(mapStateToProps, mapDispatchToProps)(UserVerification);
