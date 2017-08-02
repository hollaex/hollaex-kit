import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'
import { logout } from '../../actions/authAction'

const mapDispatchToProps = dispatch => ({
    logout:bindActionCreators(logout, dispatch),
})

class Sidebar extends Component {
	_logout(e){
		this.props.logout();
	}

	render() {
		return (
			<div className="col-md-2 sidebar">
				<img src={require('./images/user.png')} width="50" height="50" style={{borderRadius:'30px'}}/> 
				<ul>
					<li><Link to='/dashboard/account'>Account</Link></li>
					<li><Link to='/dashboard/deposit'>Deposit</Link></li>
					<li><Link to='/dashboard/withdraw'>Withdraw</Link></li>
					<li onClick={this._logout.bind(this)}>Logout</li>
				</ul>
			</div>
		);
	}
}

export default connect(null, mapDispatchToProps)(Sidebar);