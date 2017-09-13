import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'
import VerifiedStatus from './VerifiedStatus'
import { renderText } from './ReduxFields';
import { userIdentity } from '../../actions/userAction'

import BankAccountForm from './BankAccountForm';

class BankDetails extends Component {

  submitBankInformation = (values) => {
    this.props.userIdentity(values)
  }

	render() {
		return (
			<div className="ml-5 mr-5 mb-5">
        <BankAccountForm
          onSubmit={this.submitBankInformation}
          fetching={this.props.fetching}
        />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
  userIdentity: bindActionCreators(userIdentity, dispatch),
})

const mapStateToProps = (state, ownProps) => ({
  userData: state.user.userData,
  fetching: state.user.fetching,
})

export default connect(mapStateToProps, mapDispatchToProps)(BankDetails);
