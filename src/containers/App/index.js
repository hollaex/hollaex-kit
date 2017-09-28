import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { WS_URL } from '../../config/constants';

import { logout } from '../../actions/authAction';
import { setMe, setBalance, addTrades as addUserTrades, updateUser } from '../../actions/userAction';
import { setUserOrders, addOrder, updateOrder, removeOrder } from '../../actions/orderAction';
import { setOrderbook, addTrades } from '../../actions/orderbookAction';

import { checkUserSessionExpired, getToken } from '../../utils/utils';
import { AppBar, Sidebar, Dialog, Loader } from '../../components';
import { ContactForm } from '../';

class Container extends Component {
	state = {
		dialogIsOpen: false,
	}

	componentWillMount() {
		if (checkUserSessionExpired(localStorage.getItem('time'))) {
			this.props.logout();
		}
	}

	componentDidMount() {
		if (!this.props.fetchingAuth) {
			this.initSocketConnections();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.fetchingAuth && nextProps.fetchingAuth !== this.props.fetchingAuth) {
			this.initSocketConnections();
		}
	}

	initSocketConnections = () => {
		this.setPublicWS();
		this.setUserSocket(localStorage.getItem('token'));
	}

	setPublicWS = () => {
		const { symbol } = this.props;
		const publicSocket = io(`${WS_URL}/realtime`, {
			query: {
				symbol,
			}
		});

		publicSocket.on('orderbook', (data) => {
			console.log('orderbook', data)
			this.props.setOrderbook(data[symbol])
		});

		publicSocket.on('trades', (data) => {
			console.log('trades', data[symbol])
			if (data[symbol].length > 0) {
				this.props.addTrades(data[symbol]);
			}
		});
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
         this.props.addUserTrades(data);
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

	goToPage = (path) => {
    this.props.router.push(path)
  }

  goToAccountPage = () => this.goToPage('/account');
	goToWalletPage = () => this.goToPage('/wallet');
	goToTradePage = () => this.goToPage('/trade');
  goToDashboard = () => this.goToPage('/');

	logout = () => this.props.logout();

	onOpenDialog = () => {
		this.setState({ dialogIsOpen: true });
	}

	onCloseDialog = () => {
		this.setState({ dialogIsOpen: false });
	}

	getClassForActivePath = (path) => {
		switch (path) {
			case '/wallet':
				return 'wallet';
			case '/account':
				return 'account';
			case '/trade':
				return 'trade';
			default:
				return '';
		}
	}

	render() {
		const { fetchingAuth, symbol, children } = this.props;
		const { dialogIsOpen } = this.state;

		const activePath = fetchingAuth ? '' : this.getClassForActivePath(this.props.location.pathname);
		return (
			<div className={`app_container ${activePath} ${symbol}`}>
				{fetchingAuth && <Loader />}
				<AppBar
					title={
						<div onClick={this.onOpenDialog}>exir-exchange</div>
					}
					goToAccountPage={this.goToAccountPage}
					goToDashboard={this.goToDashboard}
					acccountIsActive={activePath === 'account'}
				/>
        <div className="app_container-content">
          <div className="app_container-main">
            {!fetchingAuth && children}
          </div>
          <div className="app_container-sidebar">
            <Sidebar
							activePath={activePath}
							goToAccountPage={this.goToAccountPage}
							goToWalletPage={this.goToWalletPage}
							goToTradePage={this.goToTradePage}
							logout={this.logout}
						/>
          </div>
        </div>
				<Dialog
					isOpen={dialogIsOpen}
					label="exir-modal"
					onCloseDialog={this.onCloseDialog}
				>
					<ContactForm onSubmitSuccess={this.onCloseDialog} />
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	orderbook: store.orderbook,
  symbol: store.orderbook.symbol,
	fetchingAuth: store.auth.fetching,
})

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
		addTrades: (trades) => dispatch(addTrades(trades)),
		setOrderbook: (orderbook) => dispatch(setOrderbook(orderbook)),
		setMe: (user) => dispatch(setMe(user)),
		setBalance: (balance) => dispatch(setBalance(balance)),
		setUserOrders: (orders) => dispatch(setUserOrders(orders)),
		addOrder: (order) => dispatch(addOrder(order)),
		updateOrder: (order) => dispatch(updateOrder(order)),
		removeOrder: (order) => dispatch(removeOrder(order)),
		addUserTrades: (trades) => dispatch(addUserTrades(trades)),
		updateUser: (userData) => dispatch(updateUser(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
