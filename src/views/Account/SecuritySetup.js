import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { Link } from 'react-router';

class SecuritySetup extends Component {
	render() {
		var error = require('./images/error.jpg');
		var success = require('./images/sucess.png');
		var arrow = require('./images/arrow.png');
		var shield = require('./images/shield.png');
		return (
			<div className='col-lg-10 offset-lg-1 '>
				<div className='d-flex'>
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
				</div>
			</div>
		);
	}
}
const mapDispatchToProps = dispatch => ({
    
})
const mapStateToProps = (store, ownProps) => ({
	user: store.user
})
export default connect(mapStateToProps, mapDispatchToProps)(SecuritySetup);