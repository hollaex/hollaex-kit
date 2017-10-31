import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import { WS_URL, ICONS, SESSION_TIME } from '../../config/constants';

import { logout } from '../../actions/authAction';
import { setMe, setBalance, updateUser } from '../../actions/userAction';
import { addUserTrades } from '../../actions/walletActions';
import { setUserOrders, addOrder, updateOrder, removeOrder } from '../../actions/orderAction';
import { setOrderbook, addTrades, changeSymbol } from '../../actions/orderbookAction';
import {
	setNotification, closeNotification, openContactForm,
	NOTIFICATIONS, CONTACT_FORM,
} from '../../actions/appActions';

import { checkUserSessionExpired, getToken } from '../../utils/utils';
import { AppBar, Sidebar, Dialog, Loader, Notification, MessageDisplay } from '../../components';
import { ContactForm } from '../';

class Container extends Component {
	state = {
		appLoaded: false,
		dialogIsOpen: false,
		publicSocket: undefined,
		privateSocket: undefined,
		idleTimer: undefined
	}

	componentWillMount() {
		if (checkUserSessionExpired(localStorage.getItem('time'))) {
			this.setState({ appLoaded: false });
			this.props.logout();
		} else {
			this.addListeners();
		}
	}

	componentDidMount() {
		if (!this.props.fetchingAuth) {
			this.initSocketConnections();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.fetchingAuth && nextProps.fetchingAuth !== this.props.fetchingAuth) {
			if (!this.state.publicSocket) {
				this.initSocketConnections();
			}
		}
		if (nextProps.activeNotification.timestamp !== this.props.activeNotification.timestamp) {
			if (nextProps.activeNotification.type !== '') {
				this.onOpenDialog();
			} else {
				this.onCloseDialog();
			}
		} else if (!nextProps.activeNotification.timestamp && this.state.dialogIsOpen) {
			this.onCloseDialog();
		}
	}

	componentWillUnmount() {
		this.removeListeners();

		if (this.state.publicSocket) {
			this.state.publicSocket.close();
		}

		if (this.state.privateSocket) {
			this.state.privateSocket.close();
		}

		if (this.state.idleTimer) {
			clearTimeout(this.state.idleTimer);
		}
	}

	addListeners = () => {
		window.addEventListener("keydown", this._handleKeyboard, false); // Trade Executions
		window.addEventListener("scroll", this._resetTimer, false);
		window.addEventListener("mousemove", this._resetTimer, false);
		window.addEventListener("click", this._resetTimer, false);
		window.addEventListener("keypress", this._resetTimer, false);
		window.addEventListener("beforeunload", this._handleWindowClose, false); // before closing the window
	}

	removeListeners = () => {
		window.removeEventListener('keydown', this._handleKeyboard);
		window.removeEventListener("scroll", this._resetTimer);
		window.removeEventListener("mousemove", this._resetTimer);
		window.removeEventListener("click", this._resetTimer);
		window.removeEventListener("keypress", this._resetTimer);
		window.removeEventListener("beforeunload", this._handleWindowClose);
	}

	resetTimer = () => {
		if (this.state.idleTimer) {
			clearTimeout(this.idleTimer);
		}
		const idleTimer = setTimeout(this._logout, SESSION_TIME); // no activity will log the user out automatically
		this.setState({ idleTimer });
	}

	initSocketConnections = () => {
		this.setPublicWS();
		this.setUserSocket(localStorage.getItem('token'));
		this.setState({ appLoaded: true });
	}

	setPublicWS = () => {
		const { symbol } = this.props;
		const publicSocket = io(`${WS_URL}/realtime`, {
			query: {
				symbol,
			}
		});

		this.setState({ publicSocket });

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
					this.props.setNotification(
						NOTIFICATIONS.ORDERS,
						data
					);
					break;
        case 'order_partialy_filled':
          // alert(`order partially filled ${data.id}`);
					this.props.updateOrder(data);
					this.props.setNotification(
						NOTIFICATIONS.ORDERS,
						data
					);
  				break;
				case 'order_updated':
					this.props.updateOrder(data);
					this.props.setNotification(
						NOTIFICATIONS.ORDERS,
						data
					);
					break;
        case 'order_filled':
          // alert(`orders filled: ${data.length}`);
          this.props.removeOrder(data);
					this.props.setNotification(
						NOTIFICATIONS.ORDERS,
						data
					);
          break;
				case 'order_removed':
          this.props.removeOrder(data);
					this.props.setNotification(
						NOTIFICATIONS.ORDERS,
						data
					);
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
				 this.props.setNotification(
					 NOTIFICATIONS.TRADES,
					 data
				 );
         this.props.addUserTrades(data);
					break;
				case 'deposit':
					this.props.setNotification(
						NOTIFICATIONS.DEPOSIT,
						data
					);
					break;
				case 'withdrawal':
					this.props.setNotification(
						NOTIFICATIONS.WITHDRAWAL,
						data
					);
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
		this.props.closeNotification();
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

	renderDialogContent = ({ type, data }, prices) => {
		switch (type) {
			case NOTIFICATIONS.ORDERS:
			case NOTIFICATIONS.TRADES:
			case NOTIFICATIONS.WITHDRAWAL:
				return <Notification type={type} data={data} />;
			case NOTIFICATIONS.DEPOSIT:
				return <Notification
					type={type}
					data={{
						...data,
						 price: prices[data.currency],
					}}
					onClose={this.onCloseDialog}
					goToPage={this.goToPage}
				/>;
			case NOTIFICATIONS.ERROR:
				return <MessageDisplay
					iconPath={ICONS.RED_WARNING}
					onClick={this.onCloseDialog}
					text={`error`}
				/>;
			case CONTACT_FORM:
				return <ContactForm onSubmitSuccess={this.onCloseDialog} />;
			default:
				return <div></div>
		}
	}

	render() {
		const { symbol, children, activeNotification, changeSymbol, notifications, prices } = this.props;
		const { dialogIsOpen, appLoaded } = this.state;

		const shouldCloseOnOverlayClick = activeNotification.type !== CONTACT_FORM;
		const activePath = !appLoaded ? '' : this.getClassForActivePath(this.props.location.pathname);
		return (
			<div className={`app_container ${activePath} ${symbol}`}>
				{!appLoaded && <Loader />}
				<AppBar
					title="exir-exchange"
					goToAccountPage={this.goToAccountPage}
					goToDashboard={this.goToDashboard}
					acccountIsActive={activePath === 'account'}
					changeSymbol={changeSymbol}
					activeSymbol={symbol}
				/>
        <div className="app_container-content">
          <div className="app_container-main">
            {appLoaded && children}
          </div>
          <div className="app_container-sidebar">
            <Sidebar
							activePath={activePath}
							goToAccountPage={this.goToAccountPage}
							goToWalletPage={this.goToWalletPage}
							goToTradePage={this.goToTradePage}
							logout={this.logout}
							notifications={notifications}
							symbol={symbol}
						/>
          </div>
        </div>
				<Dialog
					isOpen={dialogIsOpen}
					label="exir-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
					showCloseText={!shouldCloseOnOverlayClick}
					style={{ 'z-index': 100 }}
				>
					{this.renderDialogContent(activeNotification, prices)}
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	orderbook: store.orderbook,
	symbol: store.orderbook.symbol,
  prices: store.orderbook.prices,
	fetchingAuth: store.auth.fetching,
	activeNotification: store.app.activeNotification,
	notifications: store.app.notifications,
});

const mapDispatchToProps = (dispatch) => ({
    logout: bindActionCreators(logout, dispatch),
		addTrades: bindActionCreators(addTrades, dispatch),
		setOrderbook: bindActionCreators(setOrderbook, dispatch),
		setMe: bindActionCreators(setMe, dispatch),
		setBalance: bindActionCreators(setBalance, dispatch),
		setUserOrders: bindActionCreators(setUserOrders, dispatch),
		addOrder: bindActionCreators(addOrder, dispatch),
		updateOrder: bindActionCreators(updateOrder, dispatch),
		removeOrder: bindActionCreators(removeOrder, dispatch),
		addUserTrades: bindActionCreators(addUserTrades, dispatch),
		updateUser: bindActionCreators(updateUser, dispatch),
		closeNotification: bindActionCreators(closeNotification, dispatch),
		openContactForm: bindActionCreators(openContactForm, dispatch),
		setNotification: bindActionCreators(setNotification, dispatch),
		changeSymbol: bindActionCreators(changeSymbol, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
