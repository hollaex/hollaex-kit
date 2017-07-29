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

const mapStateToProps = (state, ownProps) => ({
    err: state.auth.errMsg,
    user: state.auth.user
})
const mapDispatchToProps = dispatch => ({
    signup:bindActionCreators(signup, dispatch),
    getEmail:bindActionCreators(getEmail, dispatch),
})

class SignUp extends Component {
	 state={
	 	email:''
	 }
	render() {
		const { handleSubmit } = this.props;
		const onSubmit = formProps => {
			this.setState({email:formProps.email})
            this.props.signup(formProps);
        }
		return (	
			<div className='col-lg-4 offset-4'>
				<form className=' pt-5'  onSubmit={ handleSubmit(onSubmit)}>
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
			        	<button type="submit">SignUp</button>
			        	{this.props.err?
							<span style={{color:'red'}} className='pl-3'>{this.props.err.message}</span>
						: null
			        	}
			        </div>
				    		         
			    </form>
			</div>	
		);
	}
}
SignUp.defaultProps = {
     user:{},
     err:{}
};
SignUp.propTypes = {
     user:PropTypes.object,
     err:PropTypes.object
};
const form = reduxForm({
  form: 'SignUp',
  validate
});
export default connect(mapStateToProps, mapDispatchToProps)(form(SignUp));