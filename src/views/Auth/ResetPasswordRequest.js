import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { renderInput } from './Login';

import { requestResetPassword } from '../../actions/authAction'

const validate = (values = {}) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required email';
  } else if (values.email.indexOf('@') === -1) {
    errors.email = 'Invalid email';
  }

  return errors;
}

const ResetPasswordRequest = (props) => {
  if (props.pending) {
    return <div>Requesting</div>;
  } else if (props.complete) {
    return <div>Check your email</div>;
  }

  const { requestResetPassword, handleSubmit, pristine, valid, errorMessage } = props;

  return (
    <div className='text-center'>
      <div className='pt-5'><h3>Reset Password</h3></div>
      <form onSubmit={handleSubmit((values) => requestResetPassword(values.email))}>
        <Field
          name="email"
          component={ renderInput }
          type="email"
          label="Email"
         />
         {errorMessage && <div>{errorMessage}</div>}
         <div className='pt-3'>
           <button
            type="submit"
            disabled={pristine || !valid}
          >
            Request Reset Password
          </button>
         </div>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.error,
  pending: state.auth.requestResetPasswordPending,
  complete: state.auth.requestResetPasswordComplete,
})

const mapDispatchToProps = (dispatch) => ({
  requestResetPassword: (values) => dispatch(requestResetPassword(values)),
});

const ResetPasswordRequestWithProps = connect(mapStateToProps, mapDispatchToProps)(ResetPasswordRequest);

export default reduxForm({
  form: 'requestResetPassword',
  validate
})(ResetPasswordRequestWithProps);
