import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { Link } from 'react-router';
import { getMe } from '../../actions/userAction'

class AccountSetup extends Component {
	componentDidMount() {
		 this.props.getMe();
	}
	render() {
		const { verification_level }=this.props.user
		console.log('verification',verification_level);
		var error = require('./images/error.jpg');
		var success = require('./images/sucess.png');
		var arrow = require('./images/arrow.png');
		return (
			<div>
				<div className='d-flex col-lg-10 offset-lg-1'>
					<div><h4>Account setup 2 of 3 completed:</h4></div>
					<div className='ml-3'>
						<img src={error} className='errorImage' /> 
						<span className='ml-2'>
							{verification_level==1?
								<Link to='/dashboard/verification/2' className='red'> 
									Add a Identity to complete your identity verification
								</Link>
								:verification_level==2?
									<Link to='/dashboard/verification/3' className='red'> 
										Add a bank account to complete your bank verification
									</Link>
								:verification_level==3?
									 <Link to='/dashboard/support'>'Add a VIP account'</Link>
								:<div className='green'>Verification completed</div>
							}
						</span>
					</div>
				</div>
				<div className="row mt-5 pb-5 ml-2 mr-2">
					<div className='col-lg-3'>
						<div className='successBorder p-2'>1.Verify Email Address
							<div style={{float:'right'}}><img src={success} className='errorImage'/></div> 
						</div>
					</div>
					<div className='col-lg-3'>
						{verification_level<2?
							<div className='errorBorder'>
								<div className='p-2 errorHead'>2.Verify Identity
									<div style={{float:'right'}}><img src={arrow} className='errorImage'/></div> 
								</div>
								<div className='pl-3 pt-1'>
									Add user Detail
									<div className='p-2 pb-3'>
										 <Link to='/dashboard/verification/2'>Go to Identity Verify</Link>
									</div>
								</div>
							</div>
							:
							<div className='successBorder p-2'>2.Verify Identity
								<div style={{float:'right'}}><img src={success} className='errorImage'/></div> 
							</div>
						}
					</div>
					<div className='col-lg-3'>
					{verification_level<3?
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
							<div className='p-2 pb-3'>
								 <Link to='/dashboard/verification/3'>Go to Bank Account</Link>
							</div>
						</div>
						:
						<div className='successBorder p-2'>3.Add a Bank Account
							<div style={{float:'right'}}><img src={success} className='errorImage'/></div> 
						</div>
					}
					</div>
					<div className='col-lg-3'>
					{verification_level<4?
						<div className='errorBorder'>
							<div className='p-2 errorHead'>4.VIP Account
								<div style={{float:'right'}}><img src={arrow} className='errorImage'/></div> 
							</div>
							<div className='pl-3 pt-1'>
								After further screening VIP's can access:
								<div className='p-2 pb-3'>
									<li>Lower trading fees</li>
									<li>Unlimited BTC withdrawals</li>
									<li>$30,000 a day USD withdrawal daily limit</li>
								</div>
							</div>
							<div className='p-2 pb-3'>
								 <Link to='/dashboard/support'>Click here to add VIP Account</Link>
							</div>
						</div>
						:
						<div className='successBorder p-2'>4.VIP Account
							<div style={{float:'right'}}><img src={success} className='errorImage'/></div> 
						</div>
					}
					</div>
				</div>
			</div>
		);
	}
}
const mapDispatchToProps = dispatch => ({
    getMe: bindActionCreators(getMe, dispatch),   
})
const mapStateToProps = (store, ownProps) => ({
	user: store.user
})
export default connect(mapStateToProps, mapDispatchToProps)(AccountSetup);