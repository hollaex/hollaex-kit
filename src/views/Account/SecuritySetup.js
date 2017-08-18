import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { Link } from 'react-router';
import QRCode from 'qrcode.react';
import { Field, reduxForm, reset } from 'redux-form';
import { requestOTP, activateOTP, deactivateOTP } from '../../actions/userAction'
import { renderText } from '.././UserVerification/ReduxFields';
 
const validate = formProps => {
  	const errors = {}
	if (!formProps.otpCode) {
	    errors.otpCode = 'Required'
	}
	return errors;
}
class SecuritySetup extends Component {
	render() {
		var error = require('./images/error.jpg');
		var success = require('./images/sucess.png');
		var arrow = require('./images/arrow.png');
		var shield = require('./images/shield.png');
		const { handleSubmit } = this.props;
		const onSubmit = formProps => {
             // console.log('formProps',formProps.otpCode);
             this.props.activateOTP({code:formProps.otpCode});
             this.props.reset();
	    }
		return (
			<div className='col-lg-10 offset-lg-1 '>
				<div className='d-flex mt-5'>
					<h4>Security setup 1 of 2 completed:</h4>
					<div className='ml-3'>
						<img src={error} className='errorImage' /> 
						<span className='ml-2'>
							<a href='#' className='red'>Enable 2 factor authentication to improve your security settings</a>
						</span>
					</div>
				</div>
				<div className="row mt-5 pb-5">
					<div className='col-lg-4'>
						<div className='successBorder p-2'>1.Add a Mobile Phone Number
							<div style={{float:'right'}}><img src={success} className='errorImage'/></div> 
						</div>
					</div>
					<div className='col-lg-4'>
						<div className='errorBorder'>
							<div className='p-2 errorHead'>2.Enable 2 factor Authentication
								<div style={{float:'right'}}><img src={arrow} className='errorImage'/></div> 
							</div>
							<div className='p-3 pt-1'>
								We highly recommend you setup 2 factor authentication(2FA).Doing so will 
								greatly increase the security of your funds.
								<div className='text-center p-2'>
									 <img src={shield} height='80' width='90'/>
								</div>
							</div>

						</div>
					</div>
					<div>
					  	<button 
					  		type="button" 
					  		onClick={this.requestOTP} 
					  		className="btn btn-info btn-sm" 
					  		data-toggle="modal" 
					  		data-target="#myModal">
					  		Request OTP
					  	</button>
					  	<div className="modal fade" id="myModal" role="dialog">
					    	<div className="modal-dialog modal-lg">
					      		<div className="modal-content">
					        		<div className="modal-header">
							          	<h4 className="modal-title">OTP Confirmation</h4>
							          	<button type="button" className="close" data-dismiss="modal">&times;</button>
							        </div>
							        <div className="modal-body text-center pb-5">
							          	{(this.props.user.otp)
											?
											<div>
								          		<p>{this.props.user.otp.secret}</p>
												<QRCode 
													value={`otpauth://totp/EXIR ali@bitholla.com?secret=${this.props.user.otp.secret}`}
													size={150}
												/>
												<form onSubmit={ handleSubmit(onSubmit)}>
													<Field
											            name="otpCode"
											            component={ renderText }
											            type="text"
											            label="OTPCODE"
											            style={{width:'70%'}}
											        />
											       <div className='mt-3'> 
											       		<button 
											       			type="submit" 
											       			className="btn btn-default" 
											       			data-dismiss=" ">
											       			activateOTP
											       		</button>
											       	</div>
											       	{this.props.user.otpError?
											       		<div className='mt-3 red'>{this.props.user.otpError}</div>
											       		:null
											       	}
												</form>
											</div>
											:
											null
										}
							        </div>
					    		</div>
					    	</div>
					  	</div>
					</div>
				</div>
			</div>
		);
	}
	requestOTP = () =>{
		this.props.requestOTP();
	}
}
const mapDispatchToProps = dispatch => ({
    requestOTP: bindActionCreators(requestOTP, dispatch),
    activateOTP: bindActionCreators(activateOTP, dispatch),  
    deactivateOTP: bindActionCreators(deactivateOTP, dispatch),    
})
const mapStateToProps = (state, ownProps) => ({
	user: state.user
})
const form = reduxForm({
	form: 'SecuritySetup',
	validate
});
 
export default connect(mapStateToProps, mapDispatchToProps)(form(SecuritySetup));