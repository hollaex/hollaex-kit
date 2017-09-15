import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userIdentity } from '../../actions/userAction'

import BankAccountForm from './BankAccountForm';

const BankDetails = ({ userIdentity, fetching }) => (
  <div className="ml-5 mr-5 mb-5">
    <BankAccountForm
      onSubmit={userIdentity}
      fetching={fetching}
    />
  </div>
);

const mapDispatchToProps = dispatch => ({
  userIdentity: bindActionCreators(userIdentity, dispatch),
})

const mapStateToProps = (state, ownProps) => ({
  userData: state.user.userData,
  fetching: state.user.fetching,
})

export default connect(mapStateToProps, mapDispatchToProps)(BankDetails);
