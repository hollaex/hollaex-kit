import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import AccountBalance from './AccountBalance';
import './styles/account.css'

class Account extends Component {
	state={
		buttonOne:true
	}
	render() {
			var img = require('./images/user.png');
		return (
			<div>
				<div className='text-center mt-5 mb-5'><h3>MY ACCOUNT</h3></div>
				<div className='tradeBorder mr-4 ml-4' style={{height:'35rem'}}>
					<div className="col-lg-8 offset-2">
						<div className="row ml-2" style={{position:'absolute',top:'-1.8rem'}}>
							<div className="ml-5"><button className='accountActive'><img src={img} width="50" height="50"  /></button></div>
							<div className="ml-3"><button><img src={img} width="50" height="50" /></button></div>
							<div className="ml-3"><button><img src={img} width="50" height="50"/></button></div>
							<div className="ml-3"><button><img src={img} width="50" height="50"/></button></div>
							<div className="ml-3"><button><img src={img} width="50" height="50"/></button></div>
							<div className="ml-3"><button><img src={img} width="50" height="50"/></button></div>
							<div className="ml-3"><button><img src={img} width="50" height="50"/></button></div>
						</div>
					</div>
					<div className="mt-5 pt-5 col-lg-10 offset-1">
							{this.state.buttonOne? <AccountBalance />
								: null
							}
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
export default connect(mapStateToProps, mapDispatchToProps)(Account);