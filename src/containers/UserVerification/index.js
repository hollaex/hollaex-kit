import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import { updateUser, updateDocuments, setMe } from '../../actions/userAction';
import { Accordion } from '../../components';
import IdentificationForm from './IdentificationForm';
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

  calculateSections = (user) => {
    let { verification_level, userData: { bank_name, bank_account_number }, email } = user;

    const sections = [{
      title: 'Email',
      content: <div>{email}</div>,
      // disabled: verification_level >= 1,
    },
    {
      title: 'Identification',
      content: <IdentificationForm
        onSubmit={this.onSubmitUserInformation}
        initialValues={user.userData}
      />,
      // disabled: !!user.userData.first_name,
    },
    {
      title: 'Documents',
      content: <DocumentsForm
        onSubmit={this.onSubmitUserDocuments}
      />,
      // disabled: verification_level >= 2,
    },
    {
      title: 'Bank Account',
      content: <BankAccountForm
        onSubmit={this.onSubmitBankAccount}
        initialValues={user.userData}
      />,
      // disabled: !!bank_name && !!bank_account_number,
    }];

    this.setState({ sections });
  }

  onSubmitUserInformation = (values) => {
    return updateUser(values)
      .then((res) => {
        this.props.setMe(res.data);
      }).catch((err) => {
        const _error = err.data ? err.data.message : err.message
        throw new SubmissionError({ _error })
      })
  }

  onSubmitUserDocuments = (values) => {
    return updateDocuments
      .then((res) => {

      }).catch((err) => {
        console.log(err.data, err.message)
        const _error = err.data ? err.data.message : err.message
        throw new SubmissionError({ _error })
      })
  }

  onSubmitBankAccount = this.onSubmitUserInformation;

  render() {
    if (this.props.user.verification_level === 0) {
      return <div>Loding</div>;
    }
    const { sections } = this.state;

    return (
      <div>
        <Accordion
          sections={sections}
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
