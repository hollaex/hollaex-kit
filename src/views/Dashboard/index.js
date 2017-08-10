import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import io from 'socket.io-client';
import { getOrderbook, getTrades, setOrderbook, setTrades } from '../../actions/orderbookAction'
import { getMe, setMe } from '../../actions/userAction'
import { logout } from '../../actions/authAction'
import './styles/dashboard.css'

const mapDispatchToProps = dispatch => ({
    setMe: bindActionCreators(setMe, dispatch),
    logout:bindActionCreators(logout, dispatch),
})
class Dashboard extends Component {
	componentWillMount () {
		this.resetTimer();
		window.onload = this.resetTimer;
	    document.onload = this.resetTimer;
	    document.onkeypress = this.resetTimer;
		document.onmousemove = this.resetTimer;
		document.onmousedown = this.resetTimer;  
		document.onclick = this.resetTimer; 
		document.onscroll = this.resetTimer;
		window.scrollTo(0, 0)
		// this.props.dispatch(getOrderbook())
		// this.props.dispatch(getTrades())
		// this.props.dispatch(getMe())
		const privateSocket = io.connect('http://35.158.6.83/user', {
			query: {
				token: `Bearer ${this.props.token}`
			}
		})
		privateSocket.on('user', (data) => {
			this.props.setMe(data)
		});
		var time_now  = (new Date()).getTime();
		var loginTime=localStorage.getItem('time');
		console.log('time_now',time_now);
			if ((time_now - loginTime) >86400000) {
			     this.props.logout();
			 } 
			 // 86400000 miliseconds for 24 hours
	}

	render() {	
		return (
			<div className="row dashboard-container">
				<div className='col-md-10'>
					<Navbar />
					{this.props.children}
				</div>
				<Sidebar />
			</div>
		);
	}
	componentWillUnmount() {
		clearTimeout(this.idleTime)
	}
	logout = () =>{
        clearTimeout(this.idleTime);
        this.props.logout();
    }
   	resetTimer=()=> {
   		var token=localStorage.getItem('token');
   		if(token){
   			clearTimeout(this.idleTime);
        	this.idleTime = setTimeout(this.logout,1800000)
        	// 1800000 miliseconds for 30 minutes
   		}
    }
}

const mapStateToProps = (store, ownProps) => ({
	token: store.auth.token,
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
