import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import EventListener from 'react-event-listener';
import { debounce } from 'lodash';
import { WS_URL, ICONS, SESSION_TIME, APP_TITLE } from '../../config/constants';

import { logout } from '../../actions/authAction';
import { setMe, setBalance, updateUser } from '../../actions/userAction';
import { addUserTrades } from '../../actions/walletActions';
import { setUserOrders, addOrder, updateOrder, removeOrder } from '../../actions/orderAction';
import { setOrderbook, addTrades, changeSymbol } from '../../actions/orderbookAction';
import {
	setNotification, closeNotification, openContactForm,
	setLanguage, closeAllNotification,
	NOTIFICATIONS, CONTACT_FORM,
} from '../../actions/appActions';

import { checkUserSessionExpired } from '../../utils/utils';
import { getToken } from '../../utils/token';
import { AppBar, Sidebar, Dialog, Loader, Notification, MessageDisplay } from '../../components';
import { ContactForm } from '../';

import { getClasesForLanguage, getFontClassForLanguage } from '../../utils/string';

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
		}
	}

	componentDidMount() {
		if (!this.props.fetchingAuth) {
			this.initSocketConnections();
		}
		this._resetTimer();
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
		if (
			!this.props.verification_level &&
			nextProps.verification_level !== this.props.verification_level &&
			nextProps.verification_level === 1
		) {
			this.goToAccountPage();
		}
	}

	componentWillUnmount() {
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

	_resetTimer = () => {
		if (this.state.idleTimer) {
			clearTimeout(this.idleTimer);
		}
		if (this.state.appLoaded) {
			const idleTimer = setTimeout(this._logout, SESSION_TIME); // no activity will log the user out automatically
			this.setState({ idleTimer });
		}
	}

	resetTimer = debounce(this._resetTimer, 250);

	initSocketConnections = () => {
		this.setPublicWS();
		this.setUserSocket(getToken());
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
			// console.log('orderbook', data)
			this.props.setOrderbook(data[symbol])
		});

		publicSocket.on('trades', (data) => {
			// console.log('trades', data[symbol])
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
      if (error && typeof error === 'string' && error.indexOf('Access Denied') > -1) {
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

		privateSocket.on('trades', (data) => {
			this.props.addUserTrades(data)
		});

		privateSocket.on('wallet', (data) => {
			this.props.setBalance(data.balance)
		});

		privateSocket.on('update', ({ type, data }) => {
			// console.log('update', type, data)
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
					const show = data.status || data.currency !== 'fiat';
					this.props.setNotification(
						NOTIFICATIONS.DEPOSIT,
						data,
						show
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
		if (this.props.location.pathname !== path) {
			this.props.router.push(path);
		}
  }

  goToAccountPage = () => this.goToPage('/account');
	goToWalletPage = () => this.goToPage('/wallet');
	goToTradePage = () => this.goToPage('/trade');
	goToQuickTradePage = () => this.goToPage('/quick-trade');
  goToDashboard = () => this.goToPage('/');

	logout = () => {
		this.setState({ appLoaded: false }, () => {
			this.props.logout();
		})
	}

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
			case '/quick-trade':
				return 'quick-trade';
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
				return <Notification type={type} data={data} openContactForm={this.props.openContactForm} />;
			case NOTIFICATIONS.DEPOSIT:
				return <Notification
					type={type}
					data={{
						...data,
						 price: prices[data.currency],
					}}
					onClose={this.onCloseDialog}
					goToPage={this.goToPage}
					openContactForm={this.props.openContactForm}
				/>;
			case NOTIFICATIONS.ERROR:
				return <MessageDisplay
					iconPath={ICONS.RED_WARNING}
					onClick={this.onCloseDialog}
					text={data}
				/>;
			case CONTACT_FORM:
				return <ContactForm onSubmitSuccess={this.onCloseDialog} />;
			default:
				return <div></div>
		}
	}

	onChangeLanguage = (language) => () => {
    return this.props.changeLanguage(language);
  }

	render() {
		const {
			symbol, children, activeNotification, changeSymbol, notifications, prices, verification_level, activeLanguage,
		} = this.props;
		const { dialogIsOpen, appLoaded } = this.state;
		const languageClasses = getClasesForLanguage(activeLanguage, 'array');
		const fontClass = getFontClassForLanguage(activeLanguage);

		const shouldCloseOnOverlayClick = activeNotification.type !== CONTACT_FORM;
		const activePath = !appLoaded ? '' : this.getClassForActivePath(this.props.location.pathname);
		return (
			<div className={classnames('app_container', activePath, symbol, fontClass, languageClasses[0])}>
				<EventListener
					target="window"
					onResize={this.resetTimer}
					onScroll={this.resetTimer}
					onMouseMove={this.resetTimer}
					onClick={this.resetTimer}
					onKeyPress={this.resetTimer}
				/>
				<AppBar
					title={APP_TITLE}
					goToAccountPage={this.goToAccountPage}
					goToDashboard={this.goToDashboard}
					acccountIsActive={activePath === 'account'}
					changeSymbol={changeSymbol}
					activeSymbol={symbol}
					changeLanguage={this.onChangeLanguage}
					activeLanguage={activeLanguage}
				/>
        <div className="app_container-content d-flex justify-content-between">
          <div className={classnames(
						'app_container-main', 'd-flex', 'flex-column', 'justify-content-between', 'overflow-y',
					)}>
            {appLoaded && verification_level > 0 ? children : <Loader />}
          </div>
          <div className="app_container-sidebar">
            <Sidebar
							activePath={activePath}
							goToAccountPage={this.goToAccountPage}
							goToWalletPage={this.goToWalletPage}
							goToTradePage={this.goToTradePage}
							goToQuickTradePage={this.goToQuickTradePage}
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
	verification_level: store.user.verification_level,
  activeLanguage: store.app.language,
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
		closeAllNotification: bindActionCreators(closeAllNotification, dispatch),
		openContactForm: bindActionCreators(openContactForm, dispatch),
		setNotification: bindActionCreators(setNotification, dispatch),
		changeSymbol: bindActionCreators(changeSymbol, dispatch),
		changeLanguage: bindActionCreators(setLanguage, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
