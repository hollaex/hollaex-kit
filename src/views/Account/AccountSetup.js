import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { Link } from 'react-router';

class AccountSetup extends Component {
	render() {
		var error = require('./images/error.jpg');
		var success = require('./images/sucess.png');
		var arrow = require('./images/arrow.png');
		return (
			<div>
				<div className='d-flex'>
					<h4>Account setup 2 of 3 completed:</h4>
					<div className='ml-3'>
						<img src={error} className='errorImage' /> 
						<span className='ml-2'>
							<a href='#' className='red'>Add a bank account to complete your verification</a>
						</span>
					</div>
				</div>
				<div className="row mt-5 pb-5">
					<div className='col-lg-4'>
						<div className='successBorder p-2'>1.Verify Email Address
							<div style={{float:'right'}}><img src={success} className='errorImage'/></div> 
						</div>
					</div>
					<div className='col-lg-4'>
						<div className='successBorder p-2'>2.Verify Identity
							<div style={{float:'right'}}><img src={success} className='errorImage'/></div> 
						</div>
					</div>
					<div className='col-lg-4'>
						<div className='errorBorder'>
							<div className='p-2 errorHead'>3.Add a Bank Account
								<div style={{float:'right'}}><img src={arrow} className='errorImage'/></div> 
							</div>
							<div className='pl-3 pt-1'>
								By adding a bank account you enable:
								<div className='p-2 pb-3'>
									<li>Fiat withdrawal</li>
									<li>Fiat deposits</li>
									<li>Increase your withdrawal limit to $10,000 a day </li>
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
export default connect(mapStateToProps, mapDispatchToProps)(AccountSetup);