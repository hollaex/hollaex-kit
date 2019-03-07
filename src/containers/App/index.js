import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import EventListener from 'react-event-listener';
import { debounce } from 'lodash';
import { WS_URL, ICONS, SESSION_TIME } from '../../config/constants';
import { isBrowser, isMobile } from 'react-device-detect';

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
	setOrderbooks,
	setTrades,
	setOrderbook,
	addTrades,
	setPairsData
} from '../../actions/orderbookAction';
import {
	setTickers,
	setPairs,
	changePair,
	setNotification,
	closeNotification,
	openContactForm,
	openHelpfulResourcesForm,
	setLanguage,
	changeTheme,
	closeAllNotification,
	setChatUnreadMessages,
	setOrderLimits,
	NOTIFICATIONS,
	CONTACT_FORM,
	HELPFUL_RESOURCES_FORM,
	FEES_STRUCTURE_AND_LIMITS,
	RISK_PORTFOLIO_ORDER_WARING
} from '../../actions/appActions';

import {
	getThemeClass,
	getChatMinimized,
	setChatMinimized
} from '../../utils/theme';
import { checkUserSessionExpired } from '../../utils/utils';
import { getToken, getTokenTimestamp, isLoggedIn } from '../../utils/token';
import {
	AppBar,
	AppMenuBar,
	Sidebar,
	SidebarBottom,
	Dialog,
	Loader,
	Notification,
	MessageDisplay,
	CurrencyList,
	SnackNotification
} from '../../components';
import { ContactForm, HelpfulResourcesForm, Chat as ChatComponent } from '../';
import ReviewEmailContent from '../Withdraw/ReviewEmailContent';
import FeesAndLimits from '../Summary/components/FeesAndLimits';
import SetOrderPortfolio from '../UserSettings/SetOrderPortfolio';

import {
	getClasesForLanguage,
	getFontClassForLanguage
} from '../../utils/string';

class Container extends Component {
	state = {
		appLoaded: false,
		dialogIsOpen: false,
		chatIsClosed: false,
		publicSocket: undefined,
		privateSocket: undefined,
		idleTimer: undefined,
		ordersQueued: []
	};

	componentWillMount() {
		const chatIsClosed = getChatMinimized();
		this.setState({
			chatIsClosed
		});
		if (isLoggedIn() && checkUserSessionExpired(getTokenTimestamp())) {
			this.logout('Token is expired');
		}
	}

	componentDidMount() {
		if (!this.props.fetchingAuth) {
			this.initSocketConnections();
		}
		this._resetTimer();
		this.updateThemeToBody(this.props.activeTheme);
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
		if (this.props.activeTheme !== nextProps.activeTheme) {
			this.updateThemeToBody(nextProps.activeTheme);
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

	updateThemeToBody = theme => {
		const themeName = theme === 'dark' ? 'dark-app-body' : '';
		if (document.body) {
			document.body.className = themeName;
		}
	};

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
		if(isLoggedIn()) {
			this.setUserSocket(getToken());
		}
		this.setState({ appLoaded: true }, () => {
			this._resetTimer();
		});
	};

	setPublicWS = () => {
		// TODO change when added more cryptocurrencies

		const publicSocket = io(`${WS_URL}/realtime`, {
			query: {
				// symbol: 'btc'
			}
		});

		this.setState({ publicSocket });

		publicSocket.on('initial', (data) => {
			// console.log('initial', data);
			if (!this.props.pair) {
				const pair = Object.keys(data.pairs)[0];
				this.props.changePair(pair);
			}
			this.props.setPairs(data.pairs);
			this.props.setPairsData(data.pairs);
			const orderLimits = {};
			Object.keys(data.pairs).map((pair, index) => {
				orderLimits[pair] = {
					PRICE: {
						MIN: data.pairs[pair].min_price,
						MAX: data.pairs[pair].max_price,
						STEP: data.pairs[pair].tick_size
					},
					SIZE: {
						MIN: data.pairs[pair].min_size,
						MAX: data.pairs[pair].max_size,
						STEP: data.pairs[pair].tick_size
					}
				}
			});
			this.props.setOrderLimits(orderLimits);
		});

		publicSocket.on('orderbook', (data) => {
			// console.log('orderbook', data);
			this.props.setOrderbooks(data);
		});

		publicSocket.on('trades', (data) => {
			// console.log('trades', data);
			this.props.setTrades(data);
		});

		publicSocket.on('ticker', (data) => {
			// console.log('ticker', data);
			this.props.setTickers(data);
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

		privateSocket.on('user', ({ action, data }) => {
			// console.log('user', action, data);
			// if (!data.phone_number) {
			// 	return this.goToVerificationPage();
			// }
			this.props.setMe(data);
			if (
				data.settings &&
				data.settings.language !== this.props.activeLanguage
			) {
				this.props.changeLanguage(data.settings.language);
			}
			if (data.settings && data.settings.theme !== this.props.activeTheme) {
				this.props.changeTheme(data.settings.theme);
				localStorage.setItem("theme", data.settings.theme);
			}
		});

		privateSocket.on('orders', ({ action, data }) => {
			// console.log('orders', action, data);
			this.props.setUserOrders(data);
		});

		privateSocket.on('trades', ({ action, data }) => {
			// console.log('trades', action, data);
			this.props.addUserTrades(data);
		});

		privateSocket.on('wallet', ({ action, balance }) => {
			// console.log('wallet', action, balance);
			this.props.setBalance(balance);
		});

		privateSocket.on('update', ({ action, type, data }) => {
			// console.log('update', action, type, data);
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
					// this.props.setNotification(NOTIFICATIONS.ORDERS, { type, data });
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
					this.props.addUserTrades(data.reverse());
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

	minimizeChat = () => {
		const chatIsClosed = !this.state.chatIsClosed;
		if (chatIsClosed === false) {
			this.props.setChatUnreadMessages();
		}
		setChatMinimized(chatIsClosed);
		this.setState({ chatIsClosed });
	};

	onConfirmEmail = () => {
		this.onCloseDialog();
		this.props.router.push('/wallet');
	};

	getClassForActivePath = (path) => {
		switch (path) {
			case '/wallet':
				return 'wallet';
			case '/account':
			case '/developers':
			case '/security':
			case '/verification':
			case '/settings':
			case '/summary':
			case '/api':
				return 'account';
			case '/quick-trade':
				return 'quick-trade';
			case '/trade':
				return 'trade';
			case '/chat':
				return 'chat';
			default:
		}
		if (path.indexOf('/trade/') === 0) {
			return 'trade';
		} else if (path.indexOf('/quick-trade/') === 0) {
			return 'quick-trade';
		}

		return '';
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
						data={data}
					/>
				);
			case HELPFUL_RESOURCES_FORM:
				return (
					<HelpfulResourcesForm
						onSubmitSuccess={this.onCloseDialog}
						onClose={this.onCloseDialog}
						data={data}
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
			case NOTIFICATIONS.WITHDRAWAL_EMAIL_CONFIRMATION:
				return (
					<ReviewEmailContent
						onConfirmEmail={this.onConfirmEmail}
						onClose={this.onCloseDialog}
					/>
				);
			case FEES_STRUCTURE_AND_LIMITS:
				return (
					<FeesAndLimits
						type={type}
						data={data}
						onClose={this.onCloseDialog}
						activeTheme={this.props.activeTheme}
					/>
				);
			case RISK_PORTFOLIO_ORDER_WARING:
					return (
						<SetOrderPortfolio
							data={data}
							onClose={this.onCloseDialog}
						/>
					)
			default:
				return <div />;
		}
	};

	onChangeLanguage = (language) => () => {
		return this.props.changeLanguage(language);
	};

	isSocketDataReady(){
		const {
			orderbooks,
			pairsTrades,
			pair
		} = this.props;
		// return (Object.keys(orderbooks).length && orderbooks[pair] && Object.keys(orderbooks[pair]).length && 
		// 	Object.keys(pairsTrades).length);
		return (Object.keys(orderbooks).length && orderbooks[pair] &&
			Object.keys(pairsTrades).length);
	};

	render() {
		const {
			symbol,
			pair,
			children,
			activeNotification,
			prices,
			verification_level,
			activeLanguage,
			openContactForm,
			openHelpfulResourcesForm,
			activeTheme,
			unreadMessages,
			router,
			location,
			user
		} = this.props;
		const { dialogIsOpen, appLoaded, chatIsClosed } = this.state;
		const languageClasses = getClasesForLanguage(activeLanguage, 'array');
		const fontClass = getFontClassForLanguage(activeLanguage);

		const shouldCloseOnOverlayClick = activeNotification.type !== CONTACT_FORM;
		const activePath = !appLoaded
			? ''
			: this.getClassForActivePath(this.props.location.pathname);
		const isMenubar = activePath === 'account' || activePath === 'wallet';
		return (
			<div
				className={classnames(
					getThemeClass(activeTheme),
					activePath,
					symbol,
					fontClass,
					languageClasses[0],
					{
						'layout-mobile': isMobile,
						'layout-desktop': isBrowser
					}
				)}
			>
				<div
					className={classnames(
						'app_container',
						'd-flex',
						getThemeClass(activeTheme),
						activePath,
						symbol,
						fontClass,
						languageClasses[0],
						{
							'layout-mobile': isMobile,
							'layout-desktop': isBrowser
						}
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
						<AppBar
							router={router}
							location={location}
							goToDashboard={this.goToDashboard}
							logout={this.logout}
							activePath={activePath}
							rightChildren={
								<CurrencyList
									className="horizontal-currency-list justify-content-end"
									activeLanguage={activeLanguage}
								/>
							}
						/>
						{isBrowser &&
							(isMenubar) && 
								<AppMenuBar router={router} location={location} />}
						<div
							className={classnames(
								"app_container-content",
								"d-flex",
								"justify-content-between",
								{
									"app_container-secondary-content": isMenubar
								}
							)}
						>
							<div
								className={classnames(
									'app_container-main',
									'd-flex',
									'flex-column',
									'justify-content-between',
									{
										'overflow-y': !isMobile
									}
								)}
							>
								{appLoaded && this.isSocketDataReady() ? children : <Loader background={false} />}
							</div>
							{isBrowser && (
								<div className="app_container-sidebar">
									<Sidebar
										activePath={activePath}
										logout={this.logout}
										// help={openContactForm}
										theme={activeTheme}
										isLogged={isLoggedIn()}
										help={openHelpfulResourcesForm}
										pair={pair}
										minimizeChat={this.minimizeChat}
										chatIsClosed={chatIsClosed}
										unreadMessages={unreadMessages}
									/>
								</div>
							)}
							<Dialog
								isOpen={dialogIsOpen}
								label="hollaex-modal"
								className="app-dialog"
								onCloseDialog={this.onCloseDialog}
								shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
								theme={activeTheme}
								showCloseText={
									!(
										activeNotification.type === CONTACT_FORM ||
										activeNotification.type === HELPFUL_RESOURCES_FORM ||
										activeNotification.type === NOTIFICATIONS.NEW_ORDER ||
										activeNotification.type === NOTIFICATIONS.ERROR
									)
								}
								compressed={
									activeNotification.type === NOTIFICATIONS.ORDERS ||
									activeNotification.type === NOTIFICATIONS.TRADES
								}
								style={{ 'z-index': 100 }}
							>
								{dialogIsOpen &&
									this.renderDialogContent(activeNotification, prices, activeTheme)}
							</Dialog>
							{!isMobile && (
								<ChatComponent
									minimized={chatIsClosed}
									onMinimize={this.minimizeChat}
									chatIsClosed={chatIsClosed}
								/>
							)}
						</div>
						{isMobile && (
							<div className="app_container-bottom_bar">
								<SidebarBottom isLogged={isLoggedIn()} activePath={activePath} pair={pair} />
							</div>
						)}
					</div>
				</div>
				<SnackNotification />
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	pair: store.app.pair,
	symbol: store.orderbook.symbol,
	prices: store.orderbook.prices,
	fetchingAuth: store.auth.fetching,
	activeNotification: store.app.activeNotification,
	verification_level: store.user.verification_level,
	activeLanguage: store.app.language,
	activeTheme: store.app.theme,
	orders: store.order.activeOrders,
	user: store.user,
	unreadMessages: store.app.chatUnreadMessages,
	orderbooks: store.orderbook.pairsOrderbooks,
	pairsTrades: store.orderbook.pairsTrades
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
	openHelpfulResourcesForm: bindActionCreators(openHelpfulResourcesForm, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	setPairs: bindActionCreators(setPairs, dispatch),
	setPairsData: bindActionCreators(setPairsData, dispatch),
	setOrderbooks: bindActionCreators(setOrderbooks, dispatch),
	setTrades: bindActionCreators(setTrades, dispatch),
	setTickers: bindActionCreators(setTickers, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	setChatUnreadMessages: bindActionCreators(setChatUnreadMessages, dispatch),
	setOrderLimits: bindActionCreators(setOrderLimits, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
