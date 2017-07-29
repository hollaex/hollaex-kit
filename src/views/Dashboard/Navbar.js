import React, { Component } from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../../actions/authAction'

const mapDispatchToProps = dispatch => ({
    logout:bindActionCreators(logout, dispatch),
})
class Navbar extends Component {
	logout(e){
		this.props.logout();
	}
	render() {
		var img = require('./user.png');
		return (
			<div>
				<div className='row pt-3 pl-4'>
					<div className='col-lg-2'>
						<h3>
							<Link to='#' style={{textDecoration:'none',color:'black'}}>EXIR</Link>
						</h3>
					</div>
					<div className='col-lg-3 offset-5 pt-2'>
						<Link to='/dashboard/quickbuy' style={{textDecoration:'underline',color:'black'}}>
							QUICK BUY & SELL
						</Link>
						<Link to='/dashboard/trade' style={{textDecoration:'none',color:'black'}} className='ml-4'>
							TRADE
						</Link>
						<button className='ml-4' onClick={this.logout.bind(this)}>
							LOGOUT
						</button>
					</div>
					<div className='cpl-lg-1 offset-1 text-right'>
						<img src={img} width="60" height="60" style={{borderRadius:'30px'}}/> 
					</div>
				</div>
			</div>
		);
	}
}
export default connect(null, mapDispatchToProps)(Navbar);