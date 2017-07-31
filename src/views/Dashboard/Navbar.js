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
						<Link to='/dashboard/newtrade' style={{textDecoration:'none',color:'black'}} className='ml-4'>
							NEW TRADE
						</Link>
					</div>
				</div>
			</div>
		);
	}
}
export default connect(null, mapDispatchToProps)(Navbar);