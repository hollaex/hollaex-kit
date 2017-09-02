import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Sidebar from './Sidebar'
import io from 'socket.io-client';
import { getMe, setMe } from '../../actions/userAction'
import { setUserOrders, addOrder } from '../../actions/orderAction'
import { logout } from '../../actions/authAction'
import constants from '../../config/constants'
import './styles/dashboard.css'

const sessionTime = 60 * 60 * 1000 // one hour

const mapDispatchToProps = dispatch => ({
    setMe: bindActionCreators(setMe, dispatch),
    logout:bindActionCreators(logout, dispatch),
    setUserOrders: bindActionCreators(setUserOrders, dispatch),
    addOrder: bindActionCreators(addOrder, dispatch)
})

class Dashboard extends Component {
	componentWillMount () {
		window.scrollTo(0, 0)
		this._resetTimer();
		window.addEventListener("keydown", this._handleKeyboard, false); // Trade Executions
		window.addEventListener("scroll", this._resetTimer, false);
		window.addEventListener("mousemove", this._resetTimer, false);
		window.addEventListener("click", this._resetTimer, false);
		window.addEventListener("keypress", this._resetTimer, false);
		window.addEventListener("beforeunload", this._handleWindowClose, false); // before closing the window

		// this.props.dispatch(getOrderbook())
		// this.props.dispatch(getTrades())
		// this.props.dispatch(getMe())
		const privateSocket = io.connect(`${constants.WS_URL}/user`, {
			query: {
				token: `Bearer ${this.props.token}`
			}
		})
		privateSocket.on('user', (data) => {
			this.props.setMe(data)
		});
		privateSocket.on('orders', (data) => {
			this.props.setUserOrders(data)
		});
		privateSocket.on('update', (data) => {
			console.log('update', data)
			switch(data.type) {
				case 'order_added':
					this.props.addOrder(this.props.order.activeOrders, data.data)
					break;
				case 'order_updated':
					break;
				case 'order_remove':
					// "data": [
				 //    {
				 //      "id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd"
				 //    },
				 //    {
				 //      "id": "bc7717d4-04e9-4430-a21b-08d32b2c34cd"
				 //    },
					break;
				case 'trade':
				 console.log('private trade', data.data)
				 // "data": [
				 //    {
				 //      "price": 999,
				 //      "side": "sell",
				 //      "size": 3,
				 //      "fee": 0,
				 //      "timestamp": "2017-07-26T13:20:40.464Z"          
				 //    },
				 //    ...
				 //  ],
				 //  "balance": {
				 //    "fiat_balance": 0,
				 //    "btc_balance": 300000,
				 //    "updated_at": "2017-07-26T13:20:40.464Z"          
				 //  }
					break;
				case 'deposit':
					break;
				case 'withdrawal':
					break;					
			}
		});
		var time_now = (new Date()).getTime();
		// Check to see when the user logged in
		var loginTime = localStorage.getItem('time');
		if ((time_now - loginTime) > sessionTime) {
			this.props.logout();
		}
	}

	render() {	
		return (
			<div className="row dashboard-container">
				<div className='col-md-10'>
					{this.props.children}
				</div>
				<Sidebar />
			</div>
		);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this._handleResize);
		window.removeEventListener("scroll", this._resetTimer);
		window.removeEventListener("mousemove", this._resetTimer);
		window.removeEventListener("click", this._resetTimer);
		window.removeEventListener("keypress", this._resetTimer);
		window.removeEventListener("beforeunload", this._handleWindowClose);
		clearTimeout(this.idleTime)
	}
	_logout = () =>{
        clearTimeout(this.idleTime);
        this.props.logout();
    }
   	_resetTimer=()=> {
		clearTimeout(this.idleTime);
    	this.idleTime = setTimeout(this._logout, sessionTime) // no activity will log the user out automatically
    }
}

const mapStateToProps = (store, ownProps) => ({
	token: store.auth.token,
	user: store.user,
	order: store.order
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
