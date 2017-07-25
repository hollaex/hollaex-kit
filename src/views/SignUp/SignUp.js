import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import { login,signup } from '../../actions/authAction'

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
	<div>
	    <div><label className='pr-3'>{label}</label></div>
	    <div><input  {...input} type={type} placeholder={label}/></div>
	    <div style={{color: 'red'}}>
	      { touched ? error : '' }
	    </div>
	</div>
);
const mapStateToProps = (state, ownProps) => ({
    user: state.auth.user,
})
const mapDispatchToProps = dispatch => ({
    login: bindActionCreators(login, dispatch),
    signup:bindActionCreators(signup, dispatch),
})
class SignUp extends Component {
	state= {
         isUser:false,
    }
    componentWillReceiveProps(nextProps) {
    	if(nextProps.user.verification_code){
			this.setState({isUser:true,count:0})
    	}
	}
	render() {
		const { handleSubmit } = this.props;
		const customStyles = {
		  content : {
		    top                   : '50%',
		    left                  : '50%',
		    right                 : 'auto',
		    bottom                : 'auto',
		    marginRight           : '-50%',
		    transform             : 'translate(-50%, -50%)'
		  }
		};
		const onSubmit = formProps => {
            this.props.signup(formProps);
        }
		return (	
			<div className='alignCenter'>
				<form onSubmit={handleSubmit(onSubmit)}  id="input">
					<h1 className='pt-5'><label>SignUp</label></h1>
					<div className='alignTop pt-5' >
				         <Field
				            name="email"
				            component={ renderInput }
				            type="email"
				            label="Email/Phone"
				         />       
			        </div>
			        <div className='alignTop'>
				        <Field
				            name="password"
				            component={ renderInput }
				            type="password"
				            label="Password"
				            className=''
				         />       
			        </div>
			        <div className='alignTop'><button type="submit">Submit</button></div>
			    </form>
			     <Modal
		          isOpen={this.state.isUser}
		          // onAfterOpen={this.afterOpenModal}
		          onRequestClose={this.handleClose}
		          style={customStyles}
		          contentLabel="Success"
		        >
			        <h6 className="pt-5 pb-2">Your Verification code</h6>   
			        <div className='alignCenter pb-2'>{this.props.user.verification_code}</div>
			        <button onClick={this.handleClose}>OK</button>   
		        </Modal>
			</div>
			
		);
	}
	handleClose=()=>{
		this.setState({isUser:false})
	}
}
SignUp.defaultProps = {
     user:{}
};
SignUp.propTypes = {
     user:PropTypes.object
};
const form = reduxForm({
  form: 'SignUp',
  validate
});
export default connect(mapStateToProps, mapDispatchToProps)(form(SignUp));