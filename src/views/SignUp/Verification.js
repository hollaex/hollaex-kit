import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'
import PropTypes from 'prop-types';

import { verify } from '../../actions/authAction'

const mapStateToProps = (state, ownProps) => ({
    message: state.auth.message,
    user: state.auth.user
})
const mapDispatchToProps = dispatch => ({
    verify: bindActionCreators(verify, dispatch),
})
class Verification extends Component {

	componentDidMount() {
		console.log('user',this.props.user.verification_code);
		var email=localStorage.getItem('email');
		if(this.props.params.code){
			 this.props.verify({
            	email:email,
            	verification_code:this.props.params.code
            });
		}
	}
	render() {
		return (	
			<div className='text-center'>
				{this.props.message?
					<div>
						<div className='pt-5'><h3>{this.props.message}</h3></div>
						<div><Link to='/login'>Go to Login</Link></div>
					</div>
					:
					<h3 className='pt-5'> Please check your email to verify your account</h3>
				}
				{this.props.params.code? null
					:
					<a href={`/verify/${this.props.user.verification_code}`}>Temporary Link</a>
				}
				
			</div>
			
		);
	}
}
Verification.defaultProps = {
     message:'',
      user:{},
};
Verification.propTypes = {
     user:PropTypes.object,
     message:PropTypes.string
};
export default connect(mapStateToProps, mapDispatchToProps)(Verification);