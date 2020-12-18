import React, { Component } from 'react';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import { Helmet } from 'react-helmet';
import { FIT_SCREEN_HEIGHT } from 'config/constants';
import { isBrowser, isMobile } from 'react-device-detect';
import isEqual from 'lodash.isequal';
import debounce from 'lodash.debounce';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import {
	NOTIFICATIONS,
	CONTACT_FORM,
	HELPFUL_RESOURCES_FORM,
	FEES_STRUCTURE_AND_LIMITS,
	RISK_PORTFOLIO_ORDER_WARING,
	RISKY_ORDER,
	LOGOUT_CONFORMATION,
} from '../../actions/appActions';

import {
	getThemeClass,
	getChatMinimized,
	setChatMinimized,
} from '../../utils/theme';
import { checkUserSessionExpired } from '../../utils/utils';
import { getTokenTimestamp, isLoggedIn, isAdmin } from '../../utils/token';
import {
	AppBar,
	AppMenuBar,
	Sidebar,
	SidebarBottom,
	Dialog,
	Notification,
	MessageDisplay,
	SnackNotification,
	SnackDialog,
	PairTabs,
} from '../../components';
import {
	ContactForm,
	HelpfulResourcesForm,
	Chat as ChatComponent,
	DepositFunds,
	ThemeProvider,
} from '../';
import ReviewEmailContent from '../Withdraw/ReviewEmailContent';
import FeesAndLimits from '../Summary/components/FeesAndLimits';
import SetOrderPortfolio from '../UserSettings/SetOrderPortfolio';
import LogoutConfirmation from '../Summary/components/LogoutConfirmation';
import RiskyOrder from '../Trade/components/RiskyOrder';
import AppFooter from '../../components/AppFooter';
import OperatorControls from 'containers/OperatorControls';

import {
	getClasesForLanguage,
	getFontClassForLanguage,
} from '../../utils/string';
import { getExchangeInitialized } from '../../utils/initialize';

import Socket from './Socket';
import Container from './Container';
import GetSocketState from './GetSocketState';
import withEdit from 'components/EditProvider/withEdit';
import withConfig from 'components/ConfigProvider/withConfig';

class App extends Component {
	state = {
		appLoaded: false,
		isSocketDataReady: false,
		dialogIsOpen: false,
		chatIsClosed: false,
		publicSocket: undefined,
		privateSocket: undefined,
		idleTimer: undefined,
		ordersQueued: [],
		limitFilledOnOrder: '',
		sidebarFitHeight: false,
		isSidebarOpen: true,
	};
	ordersQueued = [];
	limitTimeOut = null;

	componentWillMount() {
		const chatIsClosed = getChatMinimized();
		this.setState({
			chatIsClosed,
		});
		if (isLoggedIn() && checkUserSessionExpired(getTokenTimestamp())) {
			this.logout('Token is expired');
		}
	}

	componentDidMount() {
		const initialized = getExchangeInitialized();

		if (
			initialized === 'false' ||
			(typeof initialized === 'boolean' && !initialized)
		) {
			this.props.router.push('/init');
		}

		if (this.props.location && this.props.location.pathname) {
			this.checkPath(this.props.location.pathname);
			this.handleFitHeight(this.props.location.pathname);
		}

		setTimeout(
			() => this.props.setPricesAndAsset(this.props.balance, this.props.coins),
			5000
		);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { balance, prices, coins } = this.props;
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
		// if (
		// 	!this.props.verification_level &&
		// 	nextProps.verification_level !== this.props.verification_level &&
		// 	nextProps.verification_level === 1
		// ) {
		// this.goToAccountPage();
		// }

		if (
			this.props.location &&
			nextProps.location &&
			this.props.location.pathname !== nextProps.location.pathname
		) {
			this.checkPath(nextProps.location.pathname);
			this.handleFitHeight(nextProps.location.pathname);
		}

		if (
			!isEqual(prices, nextProps.prices) ||
			!isEqual(balance, nextProps.balance) ||
			!isEqual(coins, nextProps.coins)
		) {
			debounce(
				() => this.props.setPricesAndAsset(nextProps.balance, nextProps.coins),
				15000
			);
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
		clearTimeout(this.limitTimeOut);
	}

	checkPath = (path) => {
		var sheet = document.createElement('style');
		if (
			path === 'login' ||
			path === 'signup' ||
			path === '/reset-password' ||
			path.includes('/withdraw') ||
			path.includes('/init')
		) {
			sheet.innerHTML = '.grecaptcha-badge { visibility: visible !important;}';
			sheet.id = 'addCap';
			if (document.getElementById('rmvCap') !== null) {
				document.body.removeChild(document.getElementById('rmvCap'));
			}
		} else {
			sheet.innerHTML = '.grecaptcha-badge { visibility: hidden !important;}';
			sheet.id = 'rmvCap';
			if (document.getElementById('addCap') !== null) {
				document.body.removeChild(document.getElementById('addCap'));
			}
		}
		document.body.appendChild(sheet);
	};

	handleFitHeight = (path) => {
		let pathname = this.getClassForActivePath(path);
		if (path.indexOf('/trade/add/tabs') !== -1) {
			pathname = '/trade/add/tabs';
		}
		this.setState({ sidebarFitHeight: FIT_SCREEN_HEIGHT.includes(pathname) });
	};

	goToPage = (path) => {
		if (this.props.location.pathname !== path) {
			this.props.router.push(path);
		}
	};

	goToAccountPage = () => this.goToPage('/account');
	goToVerificationPage = () => this.goToPage('/verification');
	goToDashboard = () => this.goToPage('/');
	goToXHTTrade = () => this.goToPage('/trade/xht-usdt');

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
			case '/home':
				return 'home';
			default:
		}
		if (path.indexOf('/trade/') === 0) {
			return 'trade';
		} else if (path.indexOf('/quick-trade/') === 0) {
			return 'quick-trade';
		}

		return '';
	};

	openContactForm = (data = {}) => {
		const { links = {} } = this.props.constants;
		this.props.openContactForm({ ...data, helpdesk: links.helpdesk });
	};

	renderDialogContent = ({ type, data }, prices = {}) => {
		const { icons: ICONS } = this.props;
		switch (type) {
			case NOTIFICATIONS.ORDERS:
			case NOTIFICATIONS.TRADES:
			case NOTIFICATIONS.WITHDRAWAL:
				return (
					<Notification
						type={type}
						data={data}
						openContactForm={this.openContactForm}
						onClose={this.onCloseDialog}
					/>
				);
			case NOTIFICATIONS.DEPOSIT:
				return (
					<Notification
						type={type}
						data={{
							...data,
							// price: prices[data.currency],
							coins: this.props.coins,
						}}
						onClose={this.onCloseDialog}
						goToPage={this.goToPage}
						openContactForm={this.openContactForm}
					/>
				);
			case NOTIFICATIONS.ERROR:
				return (
					<MessageDisplay
						iconId="RED_WARNING"
						iconPath={ICONS['RED_WARNING']}
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
				return <SetOrderPortfolio data={data} onClose={this.onCloseDialog} />;
			case LOGOUT_CONFORMATION:
				return (
					<LogoutConfirmation
						data={data}
						onConfirm={() => {
							this.logout();
							this.onCloseDialog();
						}}
						onClose={this.onCloseDialog}
					/>
				);
			case RISKY_ORDER: {
				const { onConfirm, ...rest } = data;
				return (
					<RiskyOrder
						data={{
							coins: this.props.coins,
							...rest,
						}}
						onConfirm={onConfirm}
						onClose={this.onCloseDialog}
					/>
				);
			}
			case NOTIFICATIONS.INVITE_FRIENDS: {
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
			case NOTIFICATIONS.STAKE_TOKEN: {
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
			case NOTIFICATIONS.DEPOSIT_INFO: {
				const { gotoWallet, ...rest } = data;
				return <DepositFunds data={rest} gotoWallet={gotoWallet} />;
			}
			default:
				return <div />;
		}
	};

	onChangeLanguage = (language) => () => {
		return this.props.changeLanguage(language);
	};

	isSocketDataReady() {
		// const { orderbooks, pairsTrades, pair, router } = this.props;
		// let pairTemp = pair;
		// return (Object.keys(orderbooks).length && orderbooks[pair] && Object.keys(orderbooks[pair]).length &&
		// 	Object.keys(pairsTrades).length);
		// if (router && router.params && router.params.pair) {
		// 	pairTemp = router.params.pair;
		// }
		// return (
		// 	Object.keys(orderbooks).length &&
		// 	orderbooks[pairTemp] &&
		// 	Object.keys(pairsTrades).length
		// );
	}

	connectionCallBack = (value) => {
		this.setState({ appLoaded: value });
	};

	socketDataCallback = (value = false) => {
		this.setState({ isSocketDataReady: value });
	};

	toggleSidebar = () => {
		this.setState((prevState) => ({
			...prevState,
			isSidebarOpen: !prevState.isSidebarOpen,
		}));
	};

	render() {
		const {
			symbol,
			pair,
			children,
			activeNotification,
			// prices,
			// verification_level,
			activeLanguage,
			// openContactForm,
			openHelpfulResourcesForm,
			activeTheme,
			unreadMessages,
			router,
			location,
			enabledPlugins,
			constants = { captcha: {} },
			isEditMode,
			handleEditMode,
			// user,
		} = this.props;

		const {
			dialogIsOpen,
			appLoaded,
			chatIsClosed,
			sidebarFitHeight,
			isSocketDataReady,
			isSidebarOpen,
		} = this.state;

		const languageClasses = getClasesForLanguage(activeLanguage, 'array');
		const fontClass = getFontClassForLanguage(activeLanguage);

		const shouldCloseOnOverlayClick = activeNotification.type !== CONTACT_FORM;
		const activePath = !appLoaded
			? ''
			: this.getClassForActivePath(this.props.location.pathname);
		const isMenubar = true;
		return (
			<ThemeProvider>
				<div>
					<Helmet>
						<title>{constants.title}</title>
						<meta name="description" content={constants.description} />
					</Helmet>
					<Socket
						router={router}
						location={location}
						logout={this.logout}
						connectionCallBack={this.connectionCallBack}
					/>
					<GetSocketState
						router={router}
						isDataReady={isSocketDataReady}
						socketDataCallback={this.socketDataCallback}
					/>
					<div
						className={classnames(
							getThemeClass(activeTheme),
							activePath,
							symbol,
							fontClass,
							languageClasses[0],
							{
								'layout-mobile': isMobile,
								'layout-desktop': isBrowser,
								'layout-edit': isEditMode && isBrowser,
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
									'layout-desktop': isBrowser,
									'layout-edit': isEditMode && isBrowser,
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
									onHelp={openHelpfulResourcesForm}
								>
									{isBrowser && isMenubar && isLoggedIn() ? (
										<AppMenuBar router={router} location={location} />
									) : null}
								</AppBar>
								{isBrowser && isLoggedIn() && (
									<PairTabs
										activePath={activePath}
										location={location}
										router={router}
									/>
								)}
								<div
									className={classnames(
										'app_container-content',
										'd-flex',
										'justify-content-between',
										{
											'app_container-secondary-content': isMenubar,
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
												'overflow-y': !isMobile,
											}
										)}
									>
										<Container
											router={router}
											children={children}
											appLoaded={appLoaded}
											isReady={isSocketDataReady}
										/>
									</div>
									{isBrowser && (
										<div
											className={classnames('app_container-sidebar', {
												'close-sidebar': !isSidebarOpen,
											})}
										>
											<div className="sidebar-toggle-wrapper">
												<Button
													type="primary"
													size="small"
													icon={
														isSidebarOpen ? (
															<CaretRightOutlined />
														) : (
															<CaretLeftOutlined />
														)
													}
													onClick={this.toggleSidebar}
													className="sidebar-toggle"
												/>
											</div>
											<Sidebar
												activePath={activePath}
												logout={this.logout}
												// help={this.openContactForm}
												theme={activeTheme}
												isLogged={isLoggedIn()}
												help={openHelpfulResourcesForm}
												pair={pair}
												enabledPlugins={enabledPlugins}
												minimizeChat={this.minimizeChat}
												chatIsClosed={chatIsClosed}
												unreadMessages={unreadMessages}
												sidebarFitHeight={sidebarFitHeight}
											/>
										</div>
									)}
									<Dialog
										isOpen={dialogIsOpen}
										label="hollaex-modal"
										className={classnames('app-dialog', {
											'app-dialog-flex':
												activeNotification.type === NOTIFICATIONS.DEPOSIT_INFO,
										})}
										onCloseDialog={this.onCloseDialog}
										shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
										theme={activeTheme}
										showCloseText={
											!(
												activeNotification.type === CONTACT_FORM ||
												activeNotification.type === HELPFUL_RESOURCES_FORM ||
												activeNotification.type === NOTIFICATIONS.NEW_ORDER ||
												(activeNotification.type === NOTIFICATIONS.TRADES &&
													!isMobile) ||
												(activeNotification.type === NOTIFICATIONS.ORDERS &&
													!isMobile) ||
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
											this.renderDialogContent(
												activeNotification
												// prices,
												// activeTheme
											)}
									</Dialog>
									{!isMobile && enabledPlugins.includes('chat') && (
										<ChatComponent
											activeLanguage={activeLanguage}
											minimized={chatIsClosed}
											onMinimize={this.minimizeChat}
											chatIsClosed={chatIsClosed}
										/>
									)}
								</div>
								{isMobile && (
									<div className="app_container-bottom_bar">
										<SidebarBottom
											isLogged={isLoggedIn()}
											activePath={activePath}
											pair={pair}
											enabledPlugins={enabledPlugins}
										/>
									</div>
								)}
							</div>
						</div>
						<SnackNotification />
						<SnackDialog />
					</div>
					<div
						className={classnames(
							getThemeClass(activeTheme),
							languageClasses[0],
							{
								'layout-mobile': isMobile,
								'layout-desktop': isBrowser,
							}
						)}
					>
						{!isMobile && (
							<AppFooter theme={activeTheme} constants={constants} />
						)}
					</div>
				</div>
				{isAdmin() && isBrowser && (
					<OperatorControls
						onChangeEditMode={handleEditMode}
						editMode={isEditMode}
						initialData={this.props.location}
					/>
				)}
			</ThemeProvider>
		);
	}
}

export default withEdit(withConfig(App));
