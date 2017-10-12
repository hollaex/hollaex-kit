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
    if (this.props.user.verification_level) {
      this.calculateSections(this.props.user);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.verification_level !== this.props.user.verification_level) {
      this.calculateSections(nextProps.user);
    }
  }

  activeStep = (verification_level, userData) => {
    if (verification_level < 1) {
      return 0;
    } else if (!userData.first_name) {
      return 1;
    } else if (verification_level < 2) {
      return 2;
    } else if (!userData.bank_account_number) {
      return 3
    } else {
      return 4;
    }
  }

  calculateSections = (user) => {
    let { verification_level, userData: { bank_name, bank_account_number }, email } = user;
    const activeStep = this.activeStep(verification_level, user.userData);

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
        initialValues={user.userData}
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
        initialValues={prepareInitialValues(user.userData)}
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
        this.accordion.openNextSection();
      }).catch((err) => {
        console.log()
        const _error = err.data ? err.data.message : err.message
        throw new SubmissionError({ _error })
      })
  }

  onSubmitUserDocuments = (values) => {
    return updateDocuments(values)
      .then((res) => {
        this.accordion.openNextSection();
      }).catch((err) => {
        console.log(err.data, err.message)
        const _error = err.data ? err.data.message : err.message
        throw new SubmissionError({ _error })
      })
  }

  onSubmitBankAccount = this.onSubmitUserInformation;

  setRef = (el) => {
    this.accordion = el;
  }

  render() {
    if (this.props.user.verification_level === 0) {
      return <div>Loading</div>;
    }
    const { sections } = this.state;

    return (
      <div>
        <Accordion
          sections={sections}
          ref={this.setRef}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setMe: (data) => dispatch(setMe(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserVerification);
