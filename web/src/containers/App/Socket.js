import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { notification } from 'antd';
import {
	BellOutlined,
	ExclamationCircleOutlined,
	FireFilled,
	MailOutlined,
} from '@ant-design/icons';
import debounce from 'lodash.debounce';
import math from 'mathjs';

import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { WS_URL, SESSION_TIME, BASE_CURRENCY } from 'config/constants';
import { setWsHeartbeat } from 'ws-heartbeat/client';
import {
	getMe,
	setMe,
	setBalance,
	updateUser,
	updateUserSettings,
	setUserData,
} from 'actions/userAction';
import { addUserTrades } from 'actions/walletActions';
import {
	setUserOrders,
	addOrder,
	updateOrder,
	removeOrder,
} from 'actions/orderAction';
import {
	setTrades,
	setOrderbook,
	addTrades,
	setPairsTradesFetched,
} from 'actions/orderbookAction';
import {
	setTickers,
	setNotification,
	closeNotification,
	openContactForm,
	openHelpfulResourcesForm,
	setLanguage,
	changeTheme,
	closeAllNotification,
	setChatUnreadMessages,
	NOTIFICATIONS,
	setSnackDialog,
	requestTiers,
} from 'actions/appActions';
import { p2pAddMessage, p2pGetStatus } from 'actions/p2pAction';
import { playBackgroundAudioNotification } from 'utils/utils';
import { getToken, isLoggedIn } from 'utils/token';
import { NORMAL_CLOSURE_CODE, isIntentionalClosure } from 'utils/webSocket';
import { ERROR_TOKEN_EXPIRED } from 'components/Notification/Logout';
import { EditWrapper, Image } from 'components';
import { formatBaseAmount, formatToCurrency } from 'utils/currency';
import { subtract } from 'containers/Trade/utils';
import { formatCurrency } from 'utils';

class Container extends Component {
	constructor(props) {
		super(props);
		this.state = {
			publicSocket: undefined,
			privateSocket: undefined,
			idleTimer: undefined,
			ordersQueued: [],
			limitFilledOnOrder: '',
			isUserFetched: false,
			isOrderStatus: null,
			selectedPair: null,
		};
		this.orderCache = {};
		this.wsInterval = null;
		this.openNotifications = [];
	}

	limitTimeOut = null;

	componentDidMount() {
		if (!this.props.fetchingAuth) {
			this.initSocketConnections();
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			!nextProps.fetchingAuth &&
			nextProps.fetchingAuth !== this.props.fetchingAuth
		) {
			if (!this.state.publicSocket) {
				this.initSocketConnections();
			}
		}
	}

	componentWillUnmount() {
		if (this.state.publicSocket) {
			this.state.publicSocket.close();
		}

		if (this.state.privateSocket) {
			this.state.privateSocket.close(NORMAL_CLOSURE_CODE);
		}

		if (this.state.idleTimer) {
			clearTimeout(this.state.idleTimer);
		}
		clearTimeout(this.limitTimeOut);
		if (this.wsInterval) {
			clearInterval(this.wsInterval);
		}
	}

	_resetTimer = () => {
		if (this.state.idleTimer) {
			clearTimeout(this.idleTimer);
		}
		if (this.state.appLoaded) {
			const idleTimer = setTimeout(
				() => this.props.logout('Inactive'),
				SESSION_TIME
			); // no activity will log the user out automatically
			this.setState({ idleTimer });
		}
	};

	resetTimer = debounce(this._resetTimer, 250);

	initSocketConnections = async () => {
		await this.setPublicWS();
		this.setUserSocket();
		this.setState({ appLoaded: true }, () => {
			this.props.connectionCallBack(true);
			this._resetTimer();
		});
	};

	setPublicWS = () => {
		this.props.requestTiers();
	};

	getUserDetails = () => {
		const { themeOptions } = this.props;
		const isValidTheme = themeOptions.some(
			(option) => option.value === this.props?.router?.location?.query?.theme
		);
		return this.props
			.getMe()
			.then(({ value }) => {
				if (value && value.data && value.data.id) {
					const data = value.data;
					const { defaults = {} } = this.props.constants;
					const params = new URLSearchParams(window.location.search);
					let userData = { ...data };
					if (data.settings) {
						if (
							data.settings.interface &&
							data.settings.interface.display_currency
						) {
							localStorage.setItem(
								'base_currnecy',
								data.settings.interface.display_currency
							);
						}
						if (
							!data.settings.language &&
							!this.props.activeLanguage &&
							defaults.language
						) {
							this.props.changeLanguage(defaults.language);
							userData = {
								...data,
								settings: {
									...data.settings,
									language: defaults.language,
								},
							};
						} else if (data.settings.language !== this.props.activeLanguage) {
							this.props.changeLanguage(data.settings.language);
						}
						if (data.settings.interface) {
							if (
								!data.settings.interface.theme &&
								!this.props.activeTheme &&
								defaults.theme
							) {
								this.props.changeTheme(defaults.theme);
								localStorage.setItem('theme', defaults.theme);
								userData = {
									...data,
									settings: {
										...data.settings,
										interface: {
											...data.settings.interface,
											theme: defaults.theme,
										},
									},
								};
							}
							if (
								data.settings.interface.theme !== this.props.activeTheme &&
								this.props?.router?.location?.query?.theme &&
								this.props?.router?.location?.query?.theme ===
									data.settings.interface.theme &&
								isValidTheme
							) {
								params.set('theme', data.settings.interface.theme);
								const currentUrl = window.location.href.split('?')[0];
								const newUrl = `${currentUrl}?${params.toString()}`;
								this.props.router.replace(newUrl);
								this.props.changeTheme(data.settings.interface.theme);
								localStorage.setItem('theme', data.settings.interface.theme);
							} else if (
								this.props?.router?.location?.query?.theme !==
									data.settings.interface.theme &&
								isValidTheme
							) {
								const { settings = { interface: {} } } = this.props.user;
								const settingsObj = { interface: { ...settings.interface } };
								const theme = (
									themeOptions.find(
										({ value }) =>
											value === this.props?.router?.location?.query?.theme
									) || themeOptions[0]
								).value;
								settingsObj.interface.theme = theme;
								return updateUserSettings(settingsObj)
									.then(({ data }) => {
										this.props.setUserData(data);
										this.props.setMe(data);
										if (data.settings && data.settings.interface) {
											this.props.changeTheme(
												this.props?.router?.location?.query?.theme
											);
											localStorage.setItem(
												'theme',
												this.props?.router?.location?.query?.theme
											);
										}
									})
									.catch((err) => {
										const error = { _error: err.message };
										if (err.response && err.response.data) {
											error._error = err.response.data.message;
										}
									});
							}
						}
					}
					this.props.setMe(userData);
				}
			})
			.catch((err) => {
				if (!err.response) {
					this.props.logout(ERROR_TOKEN_EXPIRED);
				} else if (err.response && err.response.status === 400) {
					this.props.setNotification(NOTIFICATIONS.UNDEFINED_ERROR);
				} else {
					const message = err.message || JSON.stringify(err);
					this.props.setNotification(NOTIFICATIONS.ERROR, message);
				}
			})
			.finally(() => this.setState({ isUserFetched: true }));
	};

	toastNotification = (data) => {
		const { coins } = this.props;
		const remaining = formatToCurrency(
			subtract(data?.data?.size, data?.data?.filled)
		);
		const fullfilled = formatBaseAmount(
			math.chain(remaining).divide(data?.data?.size).multiply(100).done()
		);
		const tradeSymbol = data?.data?.symbol?.split('-')[0];
		const date = new Date();
		const currentTime = date?.toLocaleTimeString();
		const key = `order-toast-${Date.now()}`;
		const selectedIcon = coins[tradeSymbol]?.logo;

		return notification.open({
			key,
			message: (
				<div className="market-order-title font-weight-bold">
					<EditWrapper stringId="PARTIALLY_FILLED">
						{STRINGS.formatString(
							data?.data?.status === 'pfilled'
								? STRINGS['PARTIALLY_FILLED']
								: data?.data?.status === 'filled'
								? STRINGS['ORDER_COMPLETE_FILLED']
								: STRINGS['NEW_ORDER_CREATED'],
							<span className="ml-1 caps-first secondary-text">
								{data?.data?.type}
							</span>,
							<span
								className={
									data?.data?.side === 'buy'
										? 'ml-1 caps-first order-buy-side'
										: 'ml-1 caps-first order-sell-side'
								}
							>
								{data?.data?.side}
							</span>
						)}
					</EditWrapper>
					<span className="secondary-text order-time">{currentTime}</span>
				</div>
			),
			description: (
				<div className="market-order-description">
					<span className="size-content">
						<EditWrapper stringId="SIZE">
							<span className="font-weight-bold">{STRINGS['SIZE']}:</span>
						</EditWrapper>
						<span className="ml-1 secondary-text">{data?.data?.size}</span>
						<span className="ml-1 secondary-text">
							{tradeSymbol?.toUpperCase()}
						</span>
						<Image icon={selectedIcon} wrapperClassName="selected-coin" />
					</span>
					{data?.data?.status === 'pfilled' && (
						<span className="price-content">
							<EditWrapper stringId="REMAINING">
								<span className="font-weight-bold">
									{STRINGS['REMAINING']}:
								</span>
							</EditWrapper>
							<span className="ml-1 secondary-text">
								{formatToCurrency(
									subtract(data?.data?.size, data?.data?.filled)
								)}
							</span>
							<span className="ml-1 secondary-text">
								{tradeSymbol?.toUpperCase()}
							</span>
							<Image
								icon={selectedIcon}
								wrapperClassName="selected-coin ml-1"
							/>
							<span className="ml-1 secondary-text">({fullfilled}%)</span>
						</span>
					)}
					<span className="price-content">
						<EditWrapper stringId="PRICE">
							<span className="font-weight-bold">{STRINGS['PRICE']}:</span>
						</EditWrapper>
						<span className="ml-1 secondary-text">
							{formatCurrency(
								data?.data?.price ? data?.data?.price : data?.data?.average
							)}
						</span>
					</span>
					<span className="mt-2" onClick={() => notification.close(key)}>
						<EditWrapper stringId="CLOSE_TEXT">
							<span className="close-text text-decoration-underline">
								{STRINGS['CLOSE_TEXT']?.toUpperCase()}
							</span>
						</EditWrapper>
					</span>
				</div>
			),
			placement: isMobile ? 'bottomLeft' : 'bottomRight',
			duration: 4,
			className: isMobile
				? 'market-trade-notification market-trade-notification-mobile'
				: 'market-trade-notification',
		});
	};

	setUserSocket = () => {
		const { isUserFetched } = this.state;
		let url = `${WS_URL}/stream`;
		const token = isLoggedIn() && getToken();

		if (token) {
			url = `${WS_URL}/stream?authorization=Bearer ${token}`;
		}
		const privateSocket = new WebSocket(url);

		this.setState({ privateSocket });

		if (isLoggedIn() && !isUserFetched) {
			this.getUserDetails();
		}

		privateSocket.onopen = (evt) => {
			privateSocket.send(
				JSON.stringify({
					op: 'subscribe',
					args: ['trade', 'wallet', 'order', 'deposit', 'usertrade', `p2pChat`],
				})
			);
			// this.wsInterval = setInterval(() => {
			// 	privateSocket.send(
			// 		JSON.stringify({
			// 			op: 'ping',
			// 		})
			// 	);
			// }, 55000);
			setWsHeartbeat(privateSocket, JSON.stringify({ op: 'ping' }), {
				pingTimeout: 60000,
				pingInterval: 25000,
			});
		};

		privateSocket.onmessage = (evt) => {
			const data = JSON.parse(evt.data);
			switch (data.topic) {
				case 'trade':
					if (data.action === 'partial' || 'insert') {
						const tradesData = {
							...data,
							[data.symbol]: data.data,
						};
						delete tradesData.data;
						this.props.setTrades(tradesData);
						this.props.setTickers(tradesData);
						this.props.setPairsTradesFetched();
					}
					if (data.action === 'update') {
						if (
							this.props.settings.audio &&
							this.props.settings.audio.public_trade &&
							this.props.location.pathname.indexOf('/trade/') === 0 &&
							this.props.router.params.pair
						) {
							playBackgroundAudioNotification(
								'public_trade',
								this.props.settings
							);
						}
					}
					break;
				case 'order':
					if (data.action === 'partial') {
						this.props.setUserOrders(data.data);
					} else if (data.action === 'insert') {
						const isNotification =
							(data?.data?.status === 'filled' &&
								this.state.selectedPair !== data?.data?.symbol) ||
							!this.state.isOrderStatus ||
							data?.data?.status === 'new';
						if (isNotification) {
							this.toastNotification(data);
						}
						if (data.data.type === 'limit') {
							playBackgroundAudioNotification(
								'orderbook_limit_order',
								this.props.settings
							);
							this.setState({ limitFilledOnOrder: data.data.id });
							this.limitTimeOut = setTimeout(() => {
								if (this.state.limitFilledOnOrder)
									this.setState({ limitFilledOnOrder: '' });
							}, 1000);
						}
						if (data.data.status !== 'filled') {
							this.setState({
								isOrderStatus: null,
								selectedPair: data?.data?.symbol,
							});
							this.props.addOrder(data.data);
						}
						break;
					} else if (data.action === 'update') {
						if (data.data.status === 'pfilled') {
							this.setState({
								isOrderStatus: data?.data?.status,
								selectedPair: data?.data?.symbol,
							});
							this.props.updateOrder(data.data);
							this.toastNotification(data);
							if (
								this.props.settings.notification &&
								this.props.settings.notification.popup_order_partially_filled
							) {
								// data.filled = data.filled - filled;
								// if (isMobile) {
								// 	this.props.setSnackDialog({
								// 		isDialog: true,
								// 		type: 'order',
								// 		data: {
								// 			type: data.data.status,
								// 			order: data.data,
								// 			data: data.data,
								// 		},
								// 	});
								// } else {
								this.props.setNotification(NOTIFICATIONS.ORDERS, {
									type: data.data.status,
									order: data.data,
									data: data.data,
								});
								// }
							}
							if (
								this.props.settings.audio &&
								this.props.settings.audio.order_partially_completed
							) {
								playBackgroundAudioNotification('pfilled', this.props.settings);
							}
						} else if (data.data.status === 'filled') {
							this.setState({
								isOrderStatus: data?.data?.status,
								selectedPair: data?.data?.symbol,
							});
							this.toastNotification(data);
							const ordersDeleted = this.props.orders.filter((order, index) => {
								return data.data.id === order.id;
							});
							this.props.removeOrder(data.data);
							if (
								this.props.settings.notification &&
								this.props.settings.notification.popup_order_completed
							) {
								ordersDeleted.forEach((orderDeleted) => {
									// if (isMobile) {
									// 	this.props.setSnackDialog({
									// 		isDialog: true,
									// 		type: 'order',
									// 		data: {
									// 			type: data.data.status,
									// 			data: {
									// 				...orderDeleted,
									// 				filled: orderDeleted.size,
									// 			},
									// 		},
									// 	});
									// } else {
									this.props.setNotification(NOTIFICATIONS.ORDERS, {
										type: data.data.status,
										data: {
											...orderDeleted,
											filled: orderDeleted.size,
										},
									});
									// }
								});
							}
							if (
								this.props.settings.audio &&
								this.props.settings.audio.order_completed
							) {
								playBackgroundAudioNotification('filled', this.props.settings);
							}
						} else if (data.data.status === 'canceled') {
							this.props.removeOrder(data.data);
							this.setState({
								isOrderStatus: null,
								selectedPair: null,
							});
							this.props.setNotification(
								NOTIFICATIONS.ORDERS,
								{ type: data.data.status, data: data.data },
								false
							);
						} else if (data.data.status === 'triggered') {
							this.props.removeOrder(data.data);
						}
					}
					break;
				case 'usertrade':
					this.props.addUserTrades(data.data);
					break;
				case 'wallet':
					this.props.setBalance(data.data);
					break;
				case 'deposit':
					if (data.data.status === 'COMPLETED') {
						// only send the notification when the deposit is confirmed
						const show =
							data.data.status || data.data.currency !== BASE_CURRENCY;
						data.data.coins = this.props.coins;
						this.props.setNotification(NOTIFICATIONS.DEPOSIT, data.data, show);
					}
					break;
				case 'p2pChat':
					if (data.action === 'getStatus') {
						this.props.p2pGetStatus(data.data);
					} else {
						this.props.p2pAddMessage(data.data);
					}
					if (
						!isMobile
							? !this.props?.router?.location?.pathname?.includes('/p2p/order/')
							: !this.props?.isChat
					) {
						const key = `notification_${Date.now()}`;

						const notificationDetails = {
							key,
							message: (
								<div className="d-flex flex-direction-column">
									<span>
										{data.action === 'getStatus' &&
										data?.data?.status === 'appeal'
											? STRINGS['P2P.APPEAL_STATUS_MESSAGE']
											: data?.action === 'getStatus' &&
											  data?.data?.status === 'cancelled' &&
											  data?.data?.title === 'admin cancel'
											? STRINGS['P2P.ADMIN_ORDER_CANCELLATION_MESSAGE']
											: data?.action === 'getStatus' &&
											  data?.data?.status === 'cancelled'
											? STRINGS['P2P.CANCEL_STATUS_MESSAGE']
											: data?.action === 'getStatus' &&
											  data?.data?.status === 'confirmed' &&
											  data?.data?.title === 'crypto'
											? STRINGS['P2P.CRYPTO_RELEASE_STATUS_MESSAGE']
											: data?.data?.status === 'confirmed'
											? STRINGS['P2P.CONFIRM_STATUS_MESSAGE']
											: data?.data?.status === 'created'
											? STRINGS['P2P.NEW_ORDER_CREATED']
											: data?.action === 'getStatus'
											? STRINGS['P2P.STATUS_UPDATE']
											: STRINGS['P2P.NEW_MESSAGE']}
									</span>
									{data?.data?.message && (
										<span className="d-flex align-items-center">
											<span className="sender-name">
												{data?.data?.sender_name}:{' '}
											</span>
											<span className="ml-2 chat-message">
												{data?.data?.message}
											</span>
										</span>
									)}
								</div>
							),
							description: (
								<div>
									<div
										className="blue-link"
										style={{
											textDecoration: 'underline',
											fontWeight: 'bold',
											cursor: 'pointer',
										}}
										onClick={() => {
											window.location.href = `${window.location.origin}/p2p/order/${data.data.id}`;
											data?.data?.type === 'message' &&
												localStorage.setItem('isChat', true);
										}}
									>
										{STRINGS['P2P.CLICK_TO_VIEW']}
									</div>
								</div>
							),
							className: isMobile
								? 'p2p-chat-notification-wrapper p2p-chat-notification-wrapper-mobile'
								: 'p2p-chat-notification-wrapper',
							placement: isMobile ? 'bottomLeft' : 'bottomRight',
							type: 'info',
							duration: 0,
							icon: <FireFilled className="p2p-fire-icon" />,
							onClose: () => {
								this.openNotifications = this.openNotifications?.filter(
									(notification) => notification?.key !== key
								);

								if (
									this.openNotifications?.length > 0 &&
									this.openNotifications[this.openNotifications?.length - 1]
										?.key !== key
								) {
									const newLastNotification = this.openNotifications[
										this.openNotifications?.length - 1
									];
									const {
										message: {
											props: {
												children: [firstNotificationMessage],
											},
										},
									} = newLastNotification;
									const {
										props: { children: newLastNotificationMessage },
									} = firstNotificationMessage;

									notification.close(newLastNotification?.key);
									notification.open({
										...newLastNotification,
										icon: [
											STRINGS['P2P.CANCEL_STATUS_MESSAGE'],
											STRINGS['P2P.ADMIN_ORDER_CANCELLATION_MESSAGE'],
											STRINGS['P2P.APPEAL_STATUS_MESSAGE'],
										]?.includes(newLastNotificationMessage) ? (
											<ExclamationCircleOutlined />
										) : newLastNotificationMessage ===
										  STRINGS['P2P.NEW_MESSAGE'] ? (
											<MailOutlined />
										) : (
											<BellOutlined />
										),
										className: isMobile
											? 'p2p-chat-notification-wrapper p2p-chat-notification-wrapper-mobile'
											: 'p2p-chat-notification-wrapper',
									});
								}
							},
						};

						this.openNotifications = [
							...this.openNotifications,
							notificationDetails,
						];

						if (this.openNotifications?.length > 1) {
							const previousNotification = this.openNotifications[
								this.openNotifications?.length - 2
							];
							const {
								message: {
									props: {
										children: [firstNotificationMessage],
									},
								},
							} = previousNotification;
							const {
								props: { children: previousNotificationMessage },
							} = firstNotificationMessage;

							notification.close(previousNotification?.key);
							notification.open({
								...previousNotification,
								icon: [
									STRINGS['P2P.CANCEL_STATUS_MESSAGE'],
									STRINGS['P2P.ADMIN_ORDER_CANCELLATION_MESSAGE'],
									STRINGS['P2P.APPEAL_STATUS_MESSAGE'],
								]?.includes(previousNotificationMessage) ? (
									<ExclamationCircleOutlined />
								) : previousNotificationMessage ===
								  STRINGS['P2P.NEW_MESSAGE'] ? (
									<MailOutlined />
								) : (
									<BellOutlined />
								),
								className: isMobile
									? 'p2p-chat-notification-wrapper p2p-chat-notification-wrapper-mobile p2p-chat-notification'
									: 'p2p-chat-notification-wrapper p2p-chat-notification',
							});
						}

						notification.open(notificationDetails);

						if (this.openNotifications?.length > 3) {
							const oldestNotification = this.openNotifications?.shift();
							notification.close(oldestNotification?.key);
						}
					}

					break;
				default:
					break;
			}
		};

		privateSocket.onerror = (evt) => {
			console.error('public socket error', evt);
		};

		privateSocket.onclose = (evt) => {
			if (!isIntentionalClosure(evt)) {
				setTimeout(() => {
					this.setUserSocket();
				}, 1000);
			}
		};
		// privateSocket.on('error', (error) => {
		// 	if (
		// 		error &&
		// 		typeof error === 'string' &&
		// 		error.indexOf('Access Denied') > -1
		// 	) {
		// 		this.props.logout('Token is expired');
		// 	}
		// });

		// privateSocket.on('orders', ({ action, data }) => {
		// 	this.props.setUserOrders(data);
		// });

		// privateSocket.on('trades', ({ action, data }) => {
		// 	// this.props.addUserTrades(data);
		// });

		// privateSocket.on('wallet', ({ action, balance }) => {
		// 	this.props.setBalance(balance);
		// });

		// privateSocket.on('update', ({ action, type, data }) => {
		// 	switch (type) {
		// 		case 'order_queued':
		// 			// TODO add queued orders to the store
		// 			// this.props.addOrder(data);
		// 			this.setState({
		// 				ordersQueued: this.state.ordersQueued.concat(data)
		// 			});
		// 			if (data.type === 'limit') {
		// 				playBackgroundAudioNotification('orderbook_limit_order', this.props.settings);
		// 				this.setState({ limitFilledOnOrder: data.id });
		// 				this.limitTimeOut = setTimeout(() => {
		// 					if (this.state.limitFilledOnOrder)
		// 						this.setState({ limitFilledOnOrder: '' });
		// 				}, 1000);
		// 			}
		// 			break;
		// 		case 'order_processed':
		// 		case 'order_canceled': {
		// 			const ordersQueued = [].concat(this.state.ordersQueued);
		// 			const indexOfOrder = ordersQueued.findIndex(
		// 				(order) => order.id === data.id
		// 			);
		// 			if (indexOfOrder > -1) {
		// 				ordersQueued.splice(indexOfOrder, 1);
		// 			}
		// 			this.setState({ ordersQueued });
		// 			break;
		// 		}
		// 		case 'order_added': {
		// 			const { ordersQueued } = this.state;
		// 			const indexOfOrder = ordersQueued.findIndex(
		// 				({ id }) => id === data.id
		// 			);
		// 			if (indexOfOrder > -1) {
		// 				ordersQueued.splice(indexOfOrder, 1);
		// 				this.setState({ ordersQueued });
		// 			}
		// 			this.props.addOrder(data);
		// 			// this.props.setNotification(NOTIFICATIONS.ORDERS, { type, data });
		// 			break;
		// 		}
		// 		case 'order_partialy_filled': {
		// 			// let filled = 0;
		// 			// const order = this.props.orders.find(order => order.id === data.id)
		// 			// if (order) {
		// 			// 	filled = order.filled;
		// 			// }
		// 			this.props.updateOrder(data);
		// 			if (
		// 				this.props.settings.notification &&
		// 				this.props.settings.notification.popup_order_partially_filled
		// 			) {
		// 				// data.filled = data.filled - filled;
		// 				if (isMobile) {
		// 					this.props.setSnackDialog({
		// 						isDialog: true,
		// 						type: 'order',
		// 						data: {
		// 							type,
		// 							order: data,
		// 							data
		// 						}
		// 					});
		// 				} else {
		// 					this.props.setNotification(NOTIFICATIONS.ORDERS, {
		// 						type,
		// 						order: data,
		// 						data
		// 					});
		// 				}
		// 			}
		// 			if (
		// 				this.props.settings.audio &&
		// 				this.props.settings.audio.order_partially_completed
		// 			) {
		// 				playBackgroundAudioNotification('order_partialy_filled', this.props.settings);
		// 			}
		// 			break;
		// 		}
		// 		case 'order_updated':
		// 			this.props.updateOrder(data);
		// 			this.props.setNotification(
		// 				NOTIFICATIONS.ORDERS,
		// 				{ type, data },
		// 				false
		// 			);
		// 			break;
		// 		case 'order_filled': {
		// 			const ordersDeleted = this.props.orders.filter((order, index) => {
		// 				return (
		// 					data.findIndex((deletedOrder) => deletedOrder.id === order.id) >
		// 					-1
		// 				);
		// 			});
		// 			this.props.removeOrder(data);
		// 			if (
		// 				this.props.settings.notification &&
		// 				this.props.settings.notification.popup_order_completed
		// 			) {
		// 				ordersDeleted.forEach((orderDeleted) => {
		// 					if (isMobile) {
		// 						this.props.setSnackDialog({
		// 							isDialog: true,
		// 							type: 'order',
		// 							data: {
		// 								type,
		// 								data: {
		// 									...orderDeleted,
		// 									filled: orderDeleted.size
		// 								}
		// 							}
		// 						});
		// 					} else {
		// 						this.props.setNotification(NOTIFICATIONS.ORDERS, {
		// 							type,
		// 							data: {
		// 								...orderDeleted,
		// 								filled: orderDeleted.size
		// 							}
		// 						});
		// 					}
		// 				});
		// 			}
		// 			if (
		// 				this.props.settings.audio &&
		// 				this.props.settings.audio.order_completed
		// 			) {
		// 				playBackgroundAudioNotification('order_filled', this.props.settings);
		// 			}
		// 			break;
		// 		}
		// 		case 'order_removed':
		// 			this.props.removeOrder(data);
		// 			this.props.setNotification(
		// 				NOTIFICATIONS.ORDERS,
		// 				{ type, data },
		// 				false
		// 			);
		// 			break;
		// 		case 'trade': {
		// 			this.props.addUserTrades(data.reverse());
		// 			const tradeOrdersIds = new Set();
		// 			data.forEach((trade) => {
		// 				if (trade.id) {
		// 					tradeOrdersIds.add(trade.id);
		// 				}
		// 			});
		// 			if (tradeOrdersIds.size === 1) {
		// 				const orderIdFromTrade = Array.from(tradeOrdersIds)[0];
		// 				const { ordersQueued } = this.state;
		// 				let order = ordersQueued.find(({ id }) => id === orderIdFromTrade);
		// 				if (!order) {
		// 					const { orders } = this.props;
		// 					order = orders.find(({ id }) => id === orderIdFromTrade);
		// 				}
		// 				if (
		// 					order &&
		// 					order.type === 'market' &&
		// 					this.props.settings.notification &&
		// 					this.props.settings.notification.popup_order_completed
		// 				) {
		// 					if (isMobile) {
		// 						this.props.setSnackDialog({
		// 							isDialog: true,
		// 							type: 'trade',
		// 							data: { order, data }
		// 						});
		// 					} else {
		// 						this.props.setNotification(NOTIFICATIONS.TRADES, {
		// 							data,
		// 							order
		// 						});
		// 					}
		// 				}
		// 			}
		// 			if (
		// 				this.state.limitFilledOnOrder &&
		// 				data.filter((limit) => limit.id === this.state.limitFilledOnOrder)
		// 					.length &&
		// 				this.props.settings.audio &&
		// 				this.props.settings.audio.order_completed
		// 			) {
		// 				setTimeout(() => {
		// 					playBackgroundAudioNotification('order_filled', this.props.settings);
		// 				}, 1000);
		// 			}
		// 			break;
		// 		}
		// 		case 'deposit': {
		// 			const show = data.status || data.currency !== BASE_CURRENCY;
		// 			data.coins = this.props.coins;
		// 			this.props.setNotification(NOTIFICATIONS.DEPOSIT, data, show);
		// 			break;
		// 		}
		// 		case 'withdrawal': {
		// 			// TODO FIX when notification is defined

		// 			const show = data.amount;
		// 			this.props.setNotification(NOTIFICATIONS.WITHDRAWAL, data, !show);
		// 			break;
		// 		}
		// 		default:
		// 			break;
		// 	}
		// 	});
	};

	render() {
		return <div />;
	}
}

const mapStateToProps = (store) => ({
	pair: store.app.pair,
	coins: store.app.coins,
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
	pairsTrades: store.orderbook.pairsTrades,
	settings: store.user.settings,
	constants: store.app.constants,
	info: store.app.info,
	token: store.auth.token,
	verifyToken: store.auth.verifyToken,
	isChat: store.app.isChat,
});

const mapDispatchToProps = (dispatch) => ({
	addTrades: bindActionCreators(addTrades, dispatch),
	setOrderbook: bindActionCreators(setOrderbook, dispatch),
	setMe: bindActionCreators(setMe, dispatch),
	setBalance: bindActionCreators(setBalance, dispatch),
	setUserOrders: bindActionCreators(setUserOrders, dispatch),
	p2pAddMessage: bindActionCreators(p2pAddMessage, dispatch),
	p2pGetStatus: bindActionCreators(p2pGetStatus, dispatch),
	addOrder: bindActionCreators(addOrder, dispatch),
	updateOrder: bindActionCreators(updateOrder, dispatch),
	removeOrder: bindActionCreators(removeOrder, dispatch),
	addUserTrades: bindActionCreators(addUserTrades, dispatch),
	updateUser: bindActionCreators(updateUser, dispatch),
	closeNotification: bindActionCreators(closeNotification, dispatch),
	closeAllNotification: bindActionCreators(closeAllNotification, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	openHelpfulResourcesForm: bindActionCreators(
		openHelpfulResourcesForm,
		dispatch
	),
	setNotification: bindActionCreators(setNotification, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	setTrades: bindActionCreators(setTrades, dispatch),
	setTickers: bindActionCreators(setTickers, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	setChatUnreadMessages: bindActionCreators(setChatUnreadMessages, dispatch),
	setSnackDialog: bindActionCreators(setSnackDialog, dispatch),
	getMe: bindActionCreators(getMe, dispatch),
	requestTiers: bindActionCreators(requestTiers, dispatch),
	setPairsTradesFetched: bindActionCreators(setPairsTradesFetched, dispatch),
	setUserData: bindActionCreators(setUserData, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Container));
