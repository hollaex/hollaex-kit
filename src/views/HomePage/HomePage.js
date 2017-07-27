import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { logout } from '../../actions/authAction'

const mapDispatchToProps = dispatch => ({
    logout:bindActionCreators(logout, dispatch),
})
class HomePage extends Component {
	logout(e){
		this.props.logout();
	}
	render() {
		return (
			<div className='pt-5 '>
				<h2 className='text-center'>This is Home page</h2>
				<div className='text-right pr-5'>
					<button  onClick={this.logout.bind(this)}>Logout</button>
				</div>
			</div>
		);
	}

}
export default connect(null, mapDispatchToProps)(HomePage);