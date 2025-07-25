import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import { Helmet } from 'react-helmet';
import { FIT_SCREEN_HEIGHT } from 'config/constants';
import { isBrowser, isMobile } from 'react-device-detect';
import isEqual from 'lodash.isequal';
import debounce from 'lodash.debounce';
import { browserHistory, withRouter } from 'react-router';
import querystring from 'query-string';
// import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
// import { Button } from 'antd';
import { setSideBarState, getSideBarState } from 'utils/sideBar';
import AppMenuSidebar from 'components/AppMenuSidebar';
import { addElements, injectHTML } from 'utils/script';
import { SuccessDisplay } from 'components';

import {
	NOTIFICATIONS,
	CONTACT_FORM,
	HELPFUL_RESOURCES_FORM,
	FEES_STRUCTURE_AND_LIMITS,
	MARKET_SELECTOR,
	CONNECT_VIA_DESKTOP,
	RISK_PORTFOLIO_ORDER_WARING,
	RISKY_ORDER,
	LOGOUT_CONFORMATION,
	setError,
} from 'actions/appActions';
import { storeTools } from 'actions/toolsAction';
import STRINGS from 'config/localizedStrings';

import { getChatMinimized, setChatMinimized } from 'utils/theme';
// eslint-disable-next-line
import { isLoggedIn, isAdmin, hasPermissions } from 'utils/token';
import {
	AppBar,
	AppMenuBar,
	// Sidebar,
	SidebarBottom,
	Dialog,
	Notification,
	MessageDisplay,
	SnackNotification,
	SnackDialog,
	PairTabs,
} from 'components';
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
import MarketSelector from 'components/AppBar/MarketSelector';
import ConnectViaDesktop from 'containers/Stake/components/ConnectViaDesktop';
import ConfigureApps from 'containers/Apps/ConfigureApps';

import { getClasesForLanguage, getFontClassForLanguage } from 'utils/string';
import { getExchangeInitialized } from 'utils/initialize';

import Socket from './Socket';
import Container from './Container';
import GetSocketState from './GetSocketState';
import withEdit from 'components/EditProvider/withEdit';
import withConfig from 'components/ConfigProvider/withConfig';
import { ETHEREUM_EVENTS } from 'actions/stakingActions';
import { renderConfirmSignout } from 'components/AppBar/Utils';
import { setActiveBalanceHistory } from 'actions/walletActions';
import { browserTitleSelector } from 'config/browserTitle';

class App extends Component {
	state = {
		appLoaded: false,
		dialogIsOpen: false,
		chatIsClosed: false,
		publicSocket: undefined,
		privateSocket: undefined,
		idleTimer: undefined,
		ordersQueued: [],
		limitFilledOnOrder: '',
		sidebarFitHeight: false,
		isSidebarOpen: getSideBarState(),
		activeMenu: '',
		paramsData: {},
		isCustomNotification: false,
		isTradeTab: false,
		isProTrade: false,
		isQuickTrade: false,
		isLogout: false,
		isOnline: navigator.onLine,
	};
	ordersQueued = [];
	limitTimeOut = null;
	debouncedPricesAndAssets = null;
	assetsPrice = null;

	UNSAFE_componentWillMount() {
		const chatIsClosed = getChatMinimized();
		this.setState({
			chatIsClosed,
		});
	}

	componentDidMount() {
		const initialized = getExchangeInitialized();
		const {
			injected_values,
			injected_html,
			plugins_injected_html,
			initializeTools,
			loadBlockchainData,
			disconnectWallet,
		} = this.props;

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

		this.setActiveMenu();

		this.assetsPrice = setTimeout(
			() => this.props.setPricesAndAsset(this.props.balance, this.props.coins),
			5000
		);

		initializeTools();
		addElements(injected_values, 'body');
		injectHTML(injected_html, 'body');
		injectHTML(plugins_injected_html, 'body');
		const qs = querystring.parse(this.props.location.search);
		if (
			Object.keys(qs).length &&
			!this.props.location.pathname.includes('trade') &&
			!this.props.location.pathname.includes('quick-trade')
		) {
			const { success_alert, error_alert } = qs;
			if (success_alert) {
				const paramsData = { status: true, message: success_alert };
				this.setState({ paramsData, isCustomNotification: true });
			} else if (error_alert) {
				const paramsData = { status: false, message: error_alert };
				this.setState({ paramsData, isCustomNotification: true });
			}
		}

		if (!isMobile && window.ethereum) {
			window.ethereum.on(ETHEREUM_EVENTS.ACCOUNT_CHANGE, ([account]) => {
				loadBlockchainData();
				if (!account) {
					disconnectWallet();
				}
			});

			window.ethereum.on(ETHEREUM_EVENTS.NETWORK_CHANGE, () => {
				window.location.reload();
			});
		}
		window.addEventListener('online', this.updateNetworkStatus);
		window.addEventListener('offline', this.updateNetworkStatus);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { balance, prices, coins } = this.props;
		if (
			nextProps.activeNotification.timestamp !==
			this.props.activeNotification.timestamp
		) {
			if (
				nextProps.activeNotification.type !== '' &&
				nextProps.activeNotification.type !== NOTIFICATIONS.ORDERS
			) {
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
			this.debouncedPricesAndAssets = debounce(
				() => this.props.setPricesAndAsset(nextProps.balance, nextProps.coins),
				15000
			);
		}
	}

	componentDidUpdate(prevProps) {
		const { tools, activeTheme } = this.props;
		const params = new URLSearchParams(window.location.search);
		if (
			JSON.stringify(prevProps.location) !== JSON.stringify(this.props.location)
		) {
			this.setActiveMenu();
		}
		if (JSON.stringify(prevProps.tools) !== JSON.stringify(tools)) {
			storeTools(tools);
		}
		const { themeOptions, router } = this.props;
		const isValidTheme = themeOptions.some(
			(option) => option.value === this.props?.router?.location?.query?.theme
		);
		if (prevProps?.activeTheme !== activeTheme) {
			if (!params.has('theme')) {
				params.set('theme', activeTheme);
				const currentUrl = window.location.href.split('?')[0];
				const newUrl = `${currentUrl}?${params.toString()}`;
				router.replace(newUrl);
			}
		} else if (params.has('theme') && !isValidTheme) {
			params.set('theme', 'dark');
			const currentUrl = window.location.href.split('?')[0];
			const newUrl = `${currentUrl}?${params.toString()}`;
			this.props.router.replace(newUrl);
		}
		if (!this.state.isOnline) {
			this.props.setError({
				message: STRINGS['ERROR_TAB.NETWORK_ERROR_MESSAGE'],
			});
			return;
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
		clearInterval(this.assetsPrice);
		window.removeEventListener('online', this.updateNetworkStatus);
		window.removeEventListener('offline', this.updateNetworkStatus);
		this.debouncedPricesAndAssets && this.debouncedPricesAndAssets.cancel();
	}

	updateNetworkStatus = () => {
		this.setState({ isOnline: navigator.onLine });
	};

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
		if (path.indexOf('/markets') !== -1) {
			pathname = '/markets';
		}
		this.setState({ sidebarFitHeight: FIT_SCREEN_HEIGHT.includes(pathname) });
	};

	setActiveMenu = () => {
		const { location: { pathname = '' } = {} } = this.props;

		let activeMenu;
		if (pathname.includes('quick-trade')) {
			activeMenu = 'quick-trade';
		} else {
			activeMenu = pathname;
		}
		this.setState({ activeMenu });
	};

	handleMenuChange = (path = '', cb, enableTrade = false) => {
		if (enableTrade && path === '/trade') {
			this.setState({ isTradeTab: !this.state.isTradeTab });
		} else if (path === '/wallet') {
			this.props.setActiveBalanceHistory(false);
			this.props.router.replace('/wallet');
		} else {
			this.setState({
				isTradeTab: false,
				isQuickTrade: false,
				isProTrade: false,
			});
			const { router, pairs } = this.props;

			let pair = '';
			if (Object.keys(pairs).length) {
				pair = Object.keys(pairs)[0];
			} else {
				pair = this.props.pair;
			}

			switch (path) {
				case 'logout':
					this.setState({ isLogout: true });
					break;
				case 'help':
					this.props.openHelpfulResourcesForm();
					break;
				case 'quick-trade':
					router.push(`/quick-trade/${pair}`);
					break;
				case 'trades':
					break;
				default:
					router.push(path);
			}

			this.setState({ activePath: path }, () => {
				if (cb) {
					cb();
				}
			});
		}
	};

	goToPage = (path) => {
		if (this.props.location.pathname !== path) {
			this.props.router.push(path);
		}
	};

	goToPair = (pair, isQuickTrade) => {
		const { router } = this.props;

		if (isQuickTrade) {
			router.push(`/quick-trade/${pair}`);
		} else {
			router.push(`/trade/${pair}`);
		}
	};

	onViewMarketsClick = () => {
		const { setTradeTab } = this.props;
		setTradeTab(3);
	};

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
		if (path.indexOf('/trade/') === 0 || path.indexOf('trade/') === 0) {
			return 'trade';
		} else if (path.indexOf('/quick-trade/') === 0) {
			return 'quick-trade';
		} else if (path.indexOf('/chart-embed') === 0) {
			return 'chart-embed';
		} else if (path.indexOf('/stake') === 0) {
			return 'stake';
		}

		return '';
	};

	renderDialogContent = ({ type, data }, prices = {}) => {
		const { icons: ICONS, config_level, openContactForm } = this.props;
		switch (type) {
			// case NOTIFICATIONS.ORDERS:
			case NOTIFICATIONS.TRADES:
			case NOTIFICATIONS.WITHDRAWAL:
				return (
					<Notification
						type={type}
						data={data}
						openContactForm={openContactForm}
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
						openContactForm={openContactForm}
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
			case NOTIFICATIONS.UNDEFINED_ERROR:
				return (
					<MessageDisplay
						iconId="UNDEFINED_ERROR"
						iconPath={ICONS['UNDEFINED_ERROR']}
						onClick={() => window.location.reload(false)}
						buttonLabel={STRINGS['REFRESH']}
						text={STRINGS['UNDEFINED_ERROR']}
						title={STRINGS['UNDEFINED_ERROR_TITLE']}
						titleId="UNDEFINED_ERROR_TITLE"
						style={{ maxWidth: '40rem' }}
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
						coins={this.props.coins}
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
						tiers={config_level}
						type={type}
						data={data}
						onClose={this.onCloseDialog}
					/>
				);
			case MARKET_SELECTOR:
				return (
					<MarketSelector
						onViewMarketsClick={this.onViewMarketsClick}
						closeAddTabMenu={this.onCloseDialog}
						addTradePairTab={this.goToPair}
						wrapperClassName="modal-market-menu"
					/>
				);
			case NOTIFICATIONS.METAMASK_ERROR:
				return (
					<MessageDisplay
						iconId="META_MASK_NOT_FOUND"
						iconPath={ICONS['META_MASK_NOT_FOUND']}
						onClick={this.onCloseDialog}
						text={data}
						title={STRINGS['STAKE.INSTALL_METAMASK_TITLE']}
						titleId={'STAKE.INSTALL_METAMASK_TITLE'}
					/>
				);
			case NOTIFICATIONS.CONFIGURE_APPS:
				return (
					<ConfigureApps
						onClose={this.onCloseDialog}
						onRemove={data.onRemove}
					/>
				);
			case CONNECT_VIA_DESKTOP:
				return <ConnectViaDesktop onClose={this.onCloseDialog} />;
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
			case NOTIFICATIONS.STAKE: {
				return (
					<Notification
						type={type}
						data={data}
						onCloseDialog={this.onCloseDialog}
					/>
				);
			}
			case NOTIFICATIONS.EARLY_UNSTAKE: {
				return (
					<Notification
						type={type}
						data={data}
						onCloseDialog={this.onCloseDialog}
					/>
				);
			}
			case NOTIFICATIONS.UNSTAKE: {
				return (
					<Notification
						type={type}
						data={data}
						onCloseDialog={this.onCloseDialog}
					/>
				);
			}
			case NOTIFICATIONS.MOVE_XHT: {
				return (
					<Notification
						type={type}
						data={data}
						onCloseDialog={this.onCloseDialog}
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

	connectionCallBack = (value) => {
		this.setState({ appLoaded: value });
	};

	toggleSidebar = () => {
		this.setState(
			(prevState) => ({
				...prevState,
				isSidebarOpen: !prevState.isSidebarOpen,
			}),
			() => {
				const { isSidebarOpen } = this.state;
				setSideBarState(isSidebarOpen);
			}
		);
	};

	onCloseNotification = () => {
		this.setState({ paramsData: {}, isCustomNotification: false });
		this.props.location.search = '';
	};

	onHandleTradeTabs = (path = '') => {
		this.setState({
			isTradeTab: !this.state.isTradeTab,
			isProTrade: true,
			isQuickTrade: true,
		});
		browserHistory.push(path);
	};

	onHandleClose = () => {
		this.setState({ isLogout: false });
	};

	onHandleLogout = () => {
		this.onHandleClose();
		this.logout();
	};

	onHandleBrowserTitle = () => {
		const { router, getBrowserTitle, coins, constants } = this.props;
		const { pathname, search, query } = router.location;
		const filteredList = getBrowserTitle?.find(
			(data) =>
				(query?.tab && data?.query === query?.tab) ||
				(search?.includes(data?.query) && data?.path === pathname) ||
				(!data?.query && data?.path === pathname) ||
				data?.activePath?.includes(pathname)
		);
		if (filteredList) {
			return filteredList?.browserTitle;
		} else {
			if (pathname?.startsWith('/prices/coin/')) {
				const [, , , symbol] = pathname?.split('/');
				if (coins && coins[symbol]) {
					return `${symbol?.toUpperCase()} ${
						STRINGS['BROWSER_TAB_TITLE.TITLE_ASSET_INFORMATION']
					} | ${constants?.api_name}`;
				}
			}
			if (pathname?.startsWith('/stake/details/')) {
				const [, , , symbol] = pathname?.split('/');
				if (coins && coins[symbol]) {
					return `${
						STRINGS['BROWSER_TAB_TITLE.TITLE_STAKE_DETAILS']
					} ${symbol?.toUpperCase()} | ${constants?.api_name}`;
				}
			} else if (
				pathname?.startsWith('/wallet/') &&
				!pathname?.includes('deposit') &&
				!pathname?.includes('withdraw')
			) {
				const [, , symbol] = pathname?.split('/');
				if (coins && coins[symbol]) {
					return `${
						STRINGS['BROWSER_TAB_TITLE.TITLE_WALLET_ASSET']
					} ${symbol?.toUpperCase()} ${
						STRINGS['BROWSER_TAB_TITLE.TITLE_WALLET_DETAILS']
					} | ${this.props.constants?.api_name}`;
				}
			} else {
				return constants?.api_name;
			}
		}
	};

	render() {
		const {
			symbol,
			children,
			activeNotification,
			// prices,
			// verification_level,
			activeLanguage,
			// openContactForm,
			// unreadMessages,
			router,
			location,
			constants = { captcha: {} },
			isEditMode,
			// user,
			features,
			isReady: isSocketDataReady,
			pairsTradesFetched,
			icons: ICONS,
			menuItems,
			pairs,
		} = this.props;

		const {
			dialogIsOpen,
			appLoaded,
			chatIsClosed,
			isCustomNotification,
			paramsData,
			// sidebarFitHeight,
			// isSidebarOpen,
			isProTrade,
			isQuickTrade,
		} = this.state;

		const languageClasses = getClasesForLanguage(activeLanguage, 'array');
		const fontClass = getFontClassForLanguage(activeLanguage);

		const shouldCloseOnOverlayClick =
			activeNotification.type !== CONTACT_FORM &&
			activeNotification.type !== NOTIFICATIONS.UNDEFINED_ERROR &&
			activeNotification.type === NOTIFICATIONS.STAKE &&
			activeNotification.type === NOTIFICATIONS.UNSTAKE &&
			activeNotification.type === NOTIFICATIONS.EARLY_UNSTAKE;

		const activePath = !appLoaded
			? ''
			: this.getClassForActivePath(this.props.location.pathname);

		const isHome = this.props.location.pathname === '/';
		const isStakePage = activePath === 'stake';
		const isChartEmbed = activePath === 'chart-embed';
		const isMenubar = !isHome;
		const isMenuSider =
			activePath !== 'trade' &&
			activePath !== 'quick-trade' &&
			activePath !== 'chart-embed' &&
			!isHome;
		const showFooter = !isMobile || isHome;

		const stakeBackgroundProps = isStakePage
			? {
					backgroundImage: `url(${ICONS['STAKING_BACKGROUND']})`,
					backgroundSize: '100%',
					backgroundRepeat: 'repeat-y',
			  }
			: {};

		return (
			<ThemeProvider>
				<div>
					<Helmet>
						<title>{this.onHandleBrowserTitle()}</title>
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
						socketDataCallback={this.props.setIsReady}
					/>
					<div
						className={classnames(
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
								activePath,
								symbol,
								fontClass,
								languageClasses[0],
								{
									'layout-mobile': isMobile && !isHome,
									'layout-desktop': isBrowser || isHome,
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
							<div className="d-flex flex-column f-1 w-100">
								{!isChartEmbed && (
									<AppBar
										router={router}
										menuItems={menuItems}
										activePath={this.state.activeMenu}
										onMenuChange={this.handleMenuChange}
										isHome={isHome}
									>
										{isBrowser && (
											<AppMenuBar
												menuItems={menuItems}
												activePath={this.state.activeMenu}
												onMenuChange={this.handleMenuChange}
											/>
										)}
									</AppBar>
								)}
								{isBrowser && !isHome && !isChartEmbed && (
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
											no_bottom_navigation: isHome,
											'chart-embed': isChartEmbed,
										}
									)}
								>
									{isMenuSider && (
										<AppMenuSidebar
											menuItems={menuItems}
											activePath={this.state.activeMenu}
											onMenuChange={this.handleMenuChange}
										/>
									)}
									<div
										className={classnames(
											'app_container-main',
											'd-flex',
											'flex-column',
											'justify-content-between',
											{
												'overflow-y': !isMobile,
												no_bottom_navigation: isHome,
												'background-color-layer': isStakePage,
											}
										)}
										style={stakeBackgroundProps}
									>
										<Container
											router={router}
											children={children}
											appLoaded={appLoaded}
											isReady={pairsTradesFetched}
										/>
									</div>
									{/* {isBrowser && !isHome && (
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
										</div>
									)} */}
									{this.state.isLogout &&
										renderConfirmSignout(
											this.state.isLogout,
											this.onHandleClose,
											this.onHandleLogout
										)}
									<Dialog
										isOpen={dialogIsOpen && !isHome}
										label="hollaex-modal"
										className={classnames(
											'app-dialog',
											{
												'app-dialog-flex':
													activeNotification.type ===
													NOTIFICATIONS.DEPOSIT_INFO,
											},
											{
												full:
													activeNotification.type ===
													NOTIFICATIONS.UNDEFINED_ERROR,
											},
											{
												background:
													activeNotification.type === NOTIFICATIONS.STAKE ||
													activeNotification.type === NOTIFICATIONS.UNSTAKE ||
													activeNotification.type ===
														NOTIFICATIONS.EARLY_UNSTAKE ||
													activeNotification.type === NOTIFICATIONS.MOVE_XHT,
											},
											{
												menu: activeNotification.type === MARKET_SELECTOR,
												'signout-confirmation-popup-wrapper':
													activeNotification.type === LOGOUT_CONFORMATION,
											}
										)}
										onCloseDialog={this.onCloseDialog}
										shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
										showCloseText={
											!(
												activeNotification.type === NOTIFICATIONS.STAKE ||
												activeNotification.type === NOTIFICATIONS.UNSTAKE ||
												activeNotification.type ===
													NOTIFICATIONS.EARLY_UNSTAKE ||
												activeNotification.type === NOTIFICATIONS.MOVE_XHT ||
												activeNotification.type === CONTACT_FORM ||
												activeNotification.type === HELPFUL_RESOURCES_FORM ||
												activeNotification.type === NOTIFICATIONS.NEW_ORDER ||
												(activeNotification.type === NOTIFICATIONS.TRADES &&
													!isMobile) ||
												// (activeNotification.type === NOTIFICATIONS.ORDERS &&
												// 	!isMobile) ||
												activeNotification.type === NOTIFICATIONS.ERROR ||
												activeNotification.type ===
													NOTIFICATIONS.UNDEFINED_ERROR
											)
										}
										compressed={
											// activeNotification.type === NOTIFICATIONS.ORDERS ||
											activeNotification.type === NOTIFICATIONS.TRADES
										}
										style={{ 'z-index': 100 }}
									>
										{dialogIsOpen &&
											this.renderDialogContent(
												activeNotification
												// prices,
											)}
									</Dialog>
									{!isMobile && !isHome && features && features.chat && (
										<ChatComponent
											activeLanguage={activeLanguage}
											minimized={chatIsClosed}
											onMinimize={this.minimizeChat}
											chatIsClosed={chatIsClosed}
										/>
									)}
								</div>
								{isMobile && !isHome && !isChartEmbed && (
									<div className="app_container-bottom_bar">
										<SidebarBottom
											menuItems={menuItems}
											isLogged={isLoggedIn()}
											activePath={this.state.activeMenu}
											onMenuChange={this.handleMenuChange}
											tradeTab={this.state.isTradeTab}
											onHandleTradeTabs={this.onHandleTradeTabs}
											pairs={pairs}
											isProTrade={isProTrade}
											isQuickTrade={isQuickTrade}
										/>
									</div>
								)}
							</div>
						</div>
						{ReactDOM.createPortal(
							<SnackNotification />,
							document.getElementsByTagName('body')[0]
						)}
						<SnackDialog />
					</div>
					<div
						className={classnames(languageClasses[0], {
							'layout-mobile': isMobile,
							'layout-desktop': isBrowser,
						})}
					>
						{showFooter && !isChartEmbed && <AppFooter constants={constants} />}
					</div>
				</div>
				{this.props?.user?.permissions?.length > 0 &&
					isBrowser &&
					!isChartEmbed && (
						<OperatorControls initialData={this.props.location} />
					)}
				<Dialog
					label="successful_dialog"
					isOpen={isCustomNotification}
					onCloseDialog={this.onCloseNotification}
				>
					<SuccessDisplay
						onClick={this.onCloseNotification}
						text={paramsData.message}
						success={paramsData.status}
						iconPath={null}
					/>
				</Dialog>
			</ThemeProvider>
		);
	}
}

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme,
	user: store.user,
	getBrowserTitle: browserTitleSelector(store),
	coins: store.app.coins,
});

const mapDispatchToProps = (dispatch) => ({
	setError: bindActionCreators(setError, dispatch),
	setActiveBalanceHistory: bindActionCreators(
		setActiveBalanceHistory,
		dispatch
	),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withEdit(withConfig(App))));
