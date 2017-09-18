import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router'

import { signup,getEmail } from '../../actions/authAction'

const validate = formProps => {
  const errors = {}
  if (!formProps.email) {
    errors.email = 'Required'
  }
  if (!formProps.password) {
    errors.password = 'Required'
  }
  return errors
}

const renderInput = ({ input, label, type, meta: {touched, invalid, error }}) => (
	<div className='row'>
 		<div className='col-lg-3'>
 			<div><label className="pr-2 pt-3">{label}</label></div>
 		</div>
 		<div className='col-lg-8'>
 			<div className='pt-3'>
 				<input  {...input} type={type} placeholder={label}/>
 				<div style={{color: 'red'}}>
 			      { touched ? error : '' }
 			    </div>
 			</div>
 		</div>
 	</div>
);

const SignUpPage = ({ errorMessage, fetching, fetched, handleSubmit, pristine, signup }) => {
  if (fetching) {
    return <div>Loading</div>;
  } else if (fetched && !errorMessage) {
    return <div>Check your email to verify your account</div>;
  }

  return (
    <div className='col-lg-4 offset-4'>
      <form className=' pt-5'  onSubmit={handleSubmit(signup)}>
        <div className='row'>
          <div className='col-lg-6 text-right'><h1>SignUp/</h1></div>
          <div><Link to='/login' style={{textDecoration:'none'}}><h5>Login</h5></Link></div>
        </div>
        <div>
          <Field
            name="email"
            component={ renderInput }
            type="text"
            label="Email/Phone"
          />
        </div>
        <div>
          <Field
            name="password"
            component={ renderInput }
            type="password"
            label="Password"
          />
        </div>
        <div className='pt-3'>
          {errorMessage && <span style={{color:'red'}} className='pl-3'>{errorMessage}</span>}
          <button type="submit" disabled={pristine || fetching}>SignUp</button>
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => ({
    errorMessage: state.auth.error,
    fetching: state.auth.fetching,
    fetched: state.auth.fetched,
});

const mapDispatchToProps = (dispatch) => ({
    signup: bindActionCreators(signup, dispatch),
})

SignUpPage.defaultProps = {
    errorMessage: '',
    fetching: false,
    fetched: false,
};

SignUpPage.propTypes = {
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool,
    fetched: PropTypes.bool,
};

const SignUpForm = reduxForm({
  form: 'SignUp',
  validate
})(SignUpPage);

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
