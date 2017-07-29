import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router'
import { Field, reduxForm } from 'redux-form';

import { login } from '../../actions/authAction'

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

const mapStateToProps = (state, ownProps) => ({
    errorMsg: state.auth.error,
})
const mapDispatchToProps = dispatch => ({
    login: bindActionCreators(login, dispatch),
})
class Login extends Component {
	render() {
		const { handleSubmit } = this.props;
		const onSubmit = formProps => {
            this.props.login(formProps);
        }
		return (	
			<div className='col-lg-4 offset-4'>
				<form className='pt-5 ' onSubmit={ handleSubmit(onSubmit)}>
					<div className='row'>
						<div className='col-lg-6 text-right'><h1> Login/ </h1></div>
						<div><Link to='/signup' style={{textDecoration:'none'}}><h5>SignUp</h5></Link></div>
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
			        	<button type="submit">Login</button>
			        	{this.props.errorMsg?
							<span style={{color:'red'}} className='pl-3'>{this.props.errorMsg}</span>
						: null
			        	}
			        </div>
			    </form>
			</div>
			
		);
	}
}
Login.defaultProps = {
     errorMsg:''
};
Login.propTypes = {
     errorMsg:PropTypes.string
};
const form = reduxForm({
  form: 'Login',
  validate
});
export default connect(mapStateToProps, mapDispatchToProps)(form(Login));