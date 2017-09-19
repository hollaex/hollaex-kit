import React from 'react';
import { connect } from 'react-redux';

import { checkVerificationCode, verifyVerificationCode } from '../../actions/authAction'

import VerificationCodePage from './VerificationCodePage';
import VerificationEmailPage from './VerificationEmailPage';

const VerificationPage = ({ params, data, checkVerificationCode, verifyCode }) => params.code ?
  <VerificationCodePage
    code={params.code}
    checkVerification={checkVerificationCode}
    verifyCode={verifyCode}
    data={data}
  /> :
  <VerificationEmailPage
    checkVerification={checkVerificationCode}
    data={data}
  />;

const mapStateToProps = (state) => ({
  data: state.auth.verification,
});

const mapDispatchToProps = (dispatch) => ({
  checkVerificationCode: (data) => dispatch(checkVerificationCode(data)),
  verifyCode: (data) => dispatch(verifyVerificationCode(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerificationPage);
