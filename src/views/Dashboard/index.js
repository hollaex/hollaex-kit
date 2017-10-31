import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Sidebar from './Sidebar'
import io from 'socket.io-client';
import { setMe, setBalance, addTrades } from '../../actions/userAction'
import { setUserOrders, addOrder, updateOrder, removeOrder } from '../../actions/orderAction'
import { logout } from '../../actions/authAction'
import { SESSION_TIME, WS_URL } from '../../config/constants'
import './styles/dashboard.css'

class Dashboard extends Component {
  state = {
    privateSocket: null,
  };

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

    if (this.props.token) {
      this.setUserSocket(this.props.token);
    }
	}

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.verification_level !== 0 && nextProps.user.verification_level !== this.props.user.verification_level) {
      if (nextProps.user.verification_level === 1) {
        this.props.router.replace(`/dashboard/verification/${nextProps.user.verification_level}`)
      }
    }
  }

	componentWillUnmount() {
		window.removeEventListener('resize', this._handleResize);
		window.removeEventListener("scroll", this._resetTimer);
		window.removeEventListener("mousemove", this._resetTimer);
		window.removeEventListener("click", this._resetTimer);
		window.removeEventListener("keypress", this._resetTimer);
		window.removeEventListener("beforeunload", this._handleWindowClose);
		clearTimeout(this.idleTime)
    if (this.state.privateSocket) {
      this.state.privateSocket.close();
    }
	}

  setUserSocket = (token) => {
		const privateSocket = io.connect(`${WS_URL}/user`, {
			query: {
				token: `Bearer ${token}`
			}
		});

    this.setState({ privateSocket });

		privateSocket.on('error', (error) => {
      if (error.indexOf('Access Denied') > -1) {
        this.props.logout();
      } else {
        console.error(error)
      }
		});

		privateSocket.on('user', (data) => {
			this.props.setMe(data)
		});

		privateSocket.on('orders', (data) => {
			this.props.setUserOrders(data)
		});

		privateSocket.on('wallet', (data) => {
			this.props.setBalance(data.balance)
		});

		privateSocket.on('update', ({ type, data }) => {
			console.log('update', type, data)
			switch(type) {
        case 'order_queued':
          break;
        case 'order_processed':
          break;
				case 'order_added':
					this.props.addOrder(data);
					break;
        case 'order_partialy_filled':
          alert(`order partially filled ${data.id}`);
					this.props.updateOrder(data);
  				break;
				case 'order_updated':
					this.props.updateOrder(data);
					break;
        case 'order_filled':
          alert(`orders filled: ${data.length}`);
          this.props.removeOrder(data);
          break;
				case 'order_removed':
          this.props.removeOrder(data);
          break;
				case 'trade':
				 console.log('private trade', data)
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
         this.props.addTrades(data);
					break;
				case 'deposit':
					break;
				case 'withdrawal':
					break;
        default:
        	break;
			}
		});
  }

  _logout = () => {
    clearTimeout(this.idleTime);
    this.props.logout();
  }

  _resetTimer=()=> {
	   clearTimeout(this.idleTime);
     this.idleTime = setTimeout(this._logout, SESSION_TIME) // no activity will log the user out automatically
  }

	render() {
    const { user } = this.props;
		return (
			<div className="dashboard-container">
				<div className='col-md-10'>
					{user.id
            ? this.props.children
            : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading</div>
          }
				</div>
				<Sidebar />
			</div>
		);
	}
}


const mapStateToProps = (store) => ({
  token: store.auth.token,
  user: store.user,
});

const mapDispatchToProps = dispatch => ({
    setMe: bindActionCreators(setMe, dispatch),
    setBalance: bindActionCreators(setBalance, dispatch),
    logout:bindActionCreators(logout, dispatch),
    setUserOrders: bindActionCreators(setUserOrders, dispatch),
    addOrder: bindActionCreators(addOrder, dispatch),
    updateOrder: bindActionCreators(updateOrder, dispatch),
    removeOrder: bindActionCreators(removeOrder, dispatch),
    addTrades: bindActionCreators(addTrades, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
