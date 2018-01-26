import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import EventListener from 'react-event-listener';
import { debounce } from 'lodash';
import { WS_URL, ICONS, SESSION_TIME } from '../../config/constants';

import { logout } from '../../actions/authAction';
import { setMe, setBalance, updateUser } from '../../actions/userAction';
import { addUserTrades } from '../../actions/walletActions';
import {
	setUserOrders,
	addOrder,
	updateOrder,
	removeOrder
} from '../../actions/orderAction';
import {
	setOrderbook,
	addTrades,
	changeSymbol
} from '../../actions/orderbookAction';
import {
	setNotification,
	closeNotification,
	openContactForm,
	setLanguage,
	closeAllNotification,
	NOTIFICATIONS,
	CONTACT_FORM
} from '../../actions/appActions';

import { checkUserSessionExpired } from '../../utils/utils';
import { getToken, getTokenTimestamp } from '../../utils/token';
import {
	AppBar,
	Sidebar,
	Dialog,
	Loader,
	Notification,
	MessageDisplay
} from '../../components';
import { ContactForm } from '../';

import {
	getClasesForLanguage,
	getFontClassForLanguage
} from '../../utils/string';

class Container extends Component {
	state = {
		appLoaded: false,
		dialogIsOpen: false,
		publicSocket: undefined,
		privateSocket: undefined,
		idleTimer: undefined,
		ordersQueued: []
	};

	componentWillMount() {
		if (checkUserSessionExpired(getTokenTimestamp())) {
			this.logout('Token is expired');
		}
	}

	componentDidMount() {
		if (!this.props.fetchingAuth) {
			this.initSocketConnections();
		}
		this._resetTimer();
	}

	componentWillReceiveProps(nextProps) {
		if (
			!nextProps.fetchingAuth &&
			nextProps.fetchingAuth !== this.props.fetchingAuth
		) {
			if (!this.state.publicSocket) {
				this.initSocketConnections();
			}
		}
		if (
			nextProps.activeNotification.timestamp !==
			this.props.activeNotification.timestamp
		) {
			if (nextProps.activeNotification.type !== '') {
				this.onOpenDialog();
			} else {
				this.onCloseDialog();
			}
		} else if (
			!nextProps.activeNotification.timestamp &&
			this.state.dialogIsOpen
		) {
			this.onCloseDialog();
		}
		if (
			!this.props.verification_level &&
			nextProps.verification_level !== this.props.verification_level &&
			nextProps.verification_level === 1
		) {
			// this.goToAccountPage();
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
			const idleTimer = setTimeout(() => this.logout('Inactive'), SESSION_TIME); // no activity will log the user out automatically
			this.setState({ idleTimer });
		}
	};

	resetTimer = debounce(this._resetTimer, 250);

	initSocketConnections = () => {
		this.setPublicWS();
		this.setUserSocket(getToken());
		this.setState({ appLoaded: true }, () => {
			this._resetTimer();
		});
	};

	setPublicWS = () => {
		// TODO change when added more cryptocurrencies
		// const { symbol } = this.props;
		const symbol = 'btc';

		const publicSocket = io(`${WS_URL}/realtime`, {
			query: {
				symbol
			}
		});

		this.setState({ publicSocket });

		publicSocket.on('orderbook', (data) => {
			// console.log('orderbook', data)
			this.props.setOrderbook(data[symbol]);
		});

		publicSocket.on('trades', (data) => {
			// console.log('trades', data);
			if (data[symbol].length > 0) {
				this.props.addTrades(symbol, data[symbol]);
			}
		});
	};

	setUserSocket = (token) => {
		const privateSocket = io.connect(`${WS_URL}/user`, {
			query: {
				token: `Bearer ${token}`
			}
		});

		this.setState({ privateSocket });

		privateSocket.on('error', (error) => {
			if (
				error &&
				typeof error === 'string' &&
				error.indexOf('Access Denied') > -1
			) {
				this.logout('Token is expired');
			} else {
				// console.error(error);
			}
		});

		privateSocket.on('user', (data) => {
			if (!data.phone_number) {
				return this.goToVerificationPage();
			}
			this.props.setMe(data);
			// if (data.settings && data.settings.language !== this.props.activeLanguage) {
			// 	this.props.changeLanguage(data.settings.language);
			// }
		});

		privateSocket.on('orders', (data) => {
			this.props.setUserOrders(data);
		});

		privateSocket.on('trades', (data) => {
			this.props.addUserTrades(data);
		});

		privateSocket.on('wallet', (data) => {
			this.props.setBalance(data.balance);
		});

		privateSocket.on('update', ({ type, data }) => {
			// console.log('update', type, data);
			switch (type) {
				case 'order_queued':
					// TODO add queued orders to the store
					this.setState({ ordersQueued: this.state.ordersQueued.concat(data) });
					break;
				case 'order_processed':
				case 'order_canceled': {
					const ordersQueued = [].concat(this.state.ordersQueued);
					const indexOfOrder = ordersQueued.findIndex(
						(order) => order.id === data.id
					);
					if (indexOfOrder > -1) {
						ordersQueued.splice(indexOfOrder, 1);
					}
					this.setState({ ordersQueued });
					break;
				}
				case 'order_added': {
					const { ordersQueued } = this.state;
					const indexOfOrder = ordersQueued.findIndex(
						({ id }) => id === data.id
					);
					if (indexOfOrder > -1) {
						ordersQueued.splice(indexOfOrder, 1);
						this.setState({ ordersQueued });
					}
					this.props.addOrder(data);
					this.props.setNotification(NOTIFICATIONS.ORDERS, { type, data });
					break;
				}
				case 'order_partialy_filled': {
					this.props.updateOrder(data);
					this.props.setNotification(
						NOTIFICATIONS.ORDERS,
						{ type, data },
						false
					);
					break;
				}
				case 'order_updated':
					this.props.updateOrder(data);
					this.props.setNotification(
						NOTIFICATIONS.ORDERS,
						{ type, data },
						false
					);
					break;
				case 'order_filled': {
					const ordersDeleted = this.props.orders.filter((order, index) => {
						return (
							data.findIndex((deletedOrder) => deletedOrder.id === order.id) >
							-1
						);
					});
					this.props.removeOrder(data);
					ordersDeleted.forEach((orderDeleted) => {
						this.props.setNotification(NOTIFICATIONS.ORDERS, {
							type,
							data: {
								...orderDeleted,
								filled: orderDeleted.size
							}
						});
					});
					break;
				}
				case 'order_removed':
					this.props.removeOrder(data);
					this.props.setNotification(
						NOTIFICATIONS.ORDERS,
						{ type, data },
						false
					);
					break;
				case 'trade': {
					this.props.addUserTrades(data);
					const tradeOrdersIds = new Set();
					data.forEach((trade) => {
						if (trade.order) {
							tradeOrdersIds.add(trade.order.id);
						}
					});
					if (tradeOrdersIds.size === 1) {
						const orderIdFromTrade = Array.from(tradeOrdersIds)[0];
						const { ordersQueued } = this.state;
						let order = ordersQueued.find(({ id }) => id === orderIdFromTrade);
						if (!order) {
							const { orders } = this.props;
							order = orders.find(({ id }) => id === orderIdFromTrade);
						}
						if (order) {
							this.props.setNotification(NOTIFICATIONS.TRADES, { data, order });
						}
					}
					break;
				}
				case 'deposit': {
					const show = data.status || data.currency !== 'fiat';
					this.props.setNotification(NOTIFICATIONS.DEPOSIT, data, show);
					break;
				}
				case 'withdrawal': {
					// TODO FIX when notification is defined
					// console.log(data, !data.amount);
					const show = data.amount;
					this.props.setNotification(NOTIFICATIONS.WITHDRAWAL, data, !show);
					break;
				}
				default:
					break;
			}
		});
	};

	goToPage = (path) => {
		if (this.props.location.pathname !== path) {
			this.props.router.push(path);
		}
	};

	goToAccountPage = () => this.goToPage('/account');
	goToVerificationPage = () => this.goToPage('/verification');
	goToWalletPage = () => this.goToPage('/wallet');
	goToTradePage = () => this.goToPage('/trade');
	goToQuickTradePage = () => this.goToPage('/quick-trade');
	goToDashboard = () => this.goToPage('/');

	logout = (message = '') => {
		this.setState({ appLoaded: false }, () => {
			this.props.logout(typeof message === 'string' ? message : '');
		});
	};

	onOpenDialog = () => {
		this.setState({ dialogIsOpen: true });
	};

	onCloseDialog = () => {
		this.setState({ dialogIsOpen: false });
		this.props.closeNotification();
	};

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
	};

	renderDialogContent = ({ type, data }, prices) => {
		switch (type) {
			case NOTIFICATIONS.ORDERS:
			case NOTIFICATIONS.TRADES:
			case NOTIFICATIONS.WITHDRAWAL:
				return (
					<Notification
						type={type}
						data={data}
						openContactForm={this.props.openContactForm}
						onClose={this.onCloseDialog}
					/>
				);
			case NOTIFICATIONS.DEPOSIT:
				return (
					<Notification
						type={type}
						data={{
							...data,
							price: prices[data.currency]
						}}
						onClose={this.onCloseDialog}
						goToPage={this.goToPage}
						openContactForm={this.props.openContactForm}
					/>
				);
			case NOTIFICATIONS.ERROR:
				return (
					<MessageDisplay
						iconPath={ICONS.RED_WARNING}
						onClick={this.onCloseDialog}
						text={data}
					/>
				);
			case CONTACT_FORM:
				return (
					<ContactForm
						onSubmitSuccess={this.onCloseDialog}
						onClose={this.onCloseDialog}
					/>
				);
			case NOTIFICATIONS.NEW_ORDER: {
				const { onConfirm, ...rest } = data;
				return (
					<Notification
						type={type}
						data={rest}
						onConfirm={data.onConfirm}
						onBack={this.onCloseDialog}
					/>
				);
			}
			default:
				return <div />;
		}
	};

	onChangeLanguage = (language) => () => {
		return this.props.changeLanguage(language);
	};

	render() {
		const {
			symbol,
			children,
			activeNotification,
			changeSymbol,
			notifications,
			prices,
			verification_level,
			activeLanguage
		} = this.props;
		const { dialogIsOpen, appLoaded } = this.state;
		const languageClasses = getClasesForLanguage(activeLanguage, 'array');
		const fontClass = getFontClassForLanguage(activeLanguage);

		const shouldCloseOnOverlayClick = activeNotification.type !== CONTACT_FORM;
		const activePath = !appLoaded
			? ''
			: this.getClassForActivePath(this.props.location.pathname);
		return (
			<div
				className={classnames(
					'app_container',
					'd-flex',
					activePath,
					symbol,
					fontClass,
					languageClasses[0]
				)}
			>
				<EventListener
					target="window"
					onResize={this.resetTimer}
					onScroll={this.resetTimer}
					onMouseMove={this.resetTimer}
					onClick={this.resetTimer}
					onKeyPress={this.resetTimer}
				/>
				<div className="d-flex flex-column f-1">
					<AppBar goToDashboard={this.goToDashboard} />
					<div className="app_container-content d-flex justify-content-between">
						<div
							className={classnames(
								'app_container-main',
								'd-flex',
								'flex-column',
								'justify-content-between',
								'overflow-y'
							)}
						>
							{appLoaded && verification_level > 0 ? children : <Loader />}
						</div>
					</div>
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
						changeSymbol={changeSymbol}
						symbol={symbol}
					/>
				</div>
				<Dialog
					isOpen={dialogIsOpen}
					label="hollaex-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
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
	orders: store.order.activeOrders,
	user: store.user.userData
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
	changeLanguage: bindActionCreators(setLanguage, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
