import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'

import { logout } from '../../actions/authAction'

const mapDispatchToProps = dispatch => ({
    logout:bindActionCreators(logout, dispatch),
})
class Home extends Component {
	logout(e){
		this.props.logout();
	}
	render() {
		return (
			<div className='pt-5 '>
				<h2 className='text-center'>This is Home page</h2>
				<p>Last bitcoin price: {(this.props.trades.length > 0) ? this.props.trades[0].price : null}</p>
				<Link to='/dashboard' style={{textDecoration:'none',color:'black'}} className='ml-4'>
					Go to dashboard
				</Link>
				<div className='text-right pr-5'>
					{(this.props.token)
						? <button onClick={this.logout.bind(this)}>Logout</button>
						: <button><Link to='/login'>Login</Link></button>
					}
				</div>
			</div>
		);
	}

}

const mapStateToProps = (store, ownProps) => ({
	trades: store.orderbook.trades,
	token: store.auth.token
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);