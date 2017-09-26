import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import { updateUser } from '../../actions/userAction';
import { Accordion } from '../../components';
import IdentificationForm from './IdentificationForm';

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
    const { verification_level, userData: { bank_name, bank_account_number }, email } = user;

    const sections = [{
      title: 'Email',
      content: <div>{email}</div>,
      isDisabled: verification_level >= 1,
    },
    {
      title: 'Identification',
      content: <IdentificationForm onSubmit={this.onSubmit} initialValues={user.userData} />,
      isDisabled: !!user.userData.first_name,
    },
    {
      title: 'Bank Account',
      content: <div>{JSON.stringify(user.userData)}</div>,
      isDisabled: !!bank_name && !!bank_account_number,
    }];

    this.setState({ sections });
  }

  onSubmit = (values) => {
    return updateUser(values)
      .then((res) => {

      }).catch((err) => {
        console.log(err.data, err.message)
        const _error = err.date ? err.data.message : err.message
        throw new SubmissionError({ _error })
      })
  }

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
});

export default connect(mapStateToProps, mapDispatchToProps)(UserVerification);
