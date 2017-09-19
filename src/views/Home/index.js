import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import { logout } from '../../actions/authAction'

class Home extends Component {
	componentWillMount() {
		if (!this.props.token) {
			this.props.router.replace('/login')
		}
	}
	logout = (e) => {
		this.props.logout();
	}

	render() {
    const { token, price } = this.props;
		return (
			<div className='pt-5 '>
				<h2 className='text-center'>This is Home page</h2>
				{price > 0 && <p>Last bitcoin price: {price}</p>}
				<Link to='/dashboard' style={{textDecoration:'none',color:'black'}} className='ml-4'>
					Go to dashboard
				</Link>
				<div className='text-right pr-5'>
					{(token)
						? <button onClick={this.logout}>Logout</button>
						: <button><Link to='/login'>Login</Link></button>
					}
				</div>
			</div>
		);
	}

}

const mapStateToProps = (store, ownProps) => ({
	price: store.orderbook.price,
	token: store.auth.token,
})

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
