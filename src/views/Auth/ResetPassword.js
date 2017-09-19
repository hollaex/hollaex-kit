import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { Field, reduxForm } from 'redux-form';
import { renderInput } from './Login';

import { resetPassword } from '../../actions/authAction'

const validate = (values = {}) => {
  const errors = {};

  if (!values.new_password) {
    errors.new_password = 'Required field';
  }

  return errors;
}

const ResetPassword = (props) => {
  if (props.pending) {
    return <div className='text-center'>Requesting</div>;
  } else if (props.complete) {
    return (
      <div className='text-center'>
        <div className='pt-5'><h3>Reset Password Complete</h3></div>
        <Link to='/login'>Go to loing page</Link>
      </div>
    )
  }

  const { resetPassword, handleSubmit, pristine, valid, errorMessage, params: { code } } = props;
  const onSubmit = ({ new_password }) => {
    resetPassword({
      new_password,
      code,
    });
  }

  return (
    <div className='text-center'>
      <div className='pt-5'><h3>Reset Password</h3></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="new_password"
          component={ renderInput }
          type="password"
          label="Password"
         />
         {errorMessage && <div>{errorMessage}</div>}
         <div className='pt-3'>
           <button
            type="submit"
            disabled={pristine || !valid}
          >
            Reset Password
          </button>
         </div>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.error,
  pending: state.auth.resetPasswordPending,
  complete: state.auth.resetPasswordComplete,
})

const mapDispatchToProps = (dispatch) => ({
  resetPassword: (values) => dispatch(resetPassword(values)),
});

const ResetPasswordWithProps = connect(mapStateToProps, mapDispatchToProps)(ResetPassword);

export default reduxForm({
  form: 'resetPassword',
  validate
})(ResetPasswordWithProps);
