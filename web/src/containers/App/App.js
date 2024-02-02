import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import { Helmet } from 'react-helmet';
import { FIT_SCREEN_HEIGHT } from 'config/constants';
import { isBrowser, isMobile } from 'react-device-detect';
import isEqual from 'lodash.isequal';
import debounce from 'lodash.debounce';
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
} from 'actions/appActions';
import { storeTools } from 'actions/toolsAction';
import STRINGS from 'config/localizedStrings';
import { connect } from 'react-redux';
import { getChatMinimized, setChatMinimized } from 'utils/theme';
import { checkUserSessionExpired } from 'utils/utils';
import { getTokenTimestamp, isLoggedIn, isAdmin } from 'utils/token';
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
import { Editor, Frame, Element, useEditor, useNode } from 'craftjs';
import {
	CraftContainer,
	ContainerFlex,
	ProfileSummary,
	MyAssets,
	CraftMarkets,
	CraftAccountDetails,
} from 'containers/Summary';
import SummaryBlock from 'containers/Summary/components/SummaryBlock';
import { Connector, EditWrapper } from 'components';
import Image from 'components/Image';
import AccountAssets from 'containers/Summary/components/AccountAssets';
import AccountDetails from 'containers/Summary/components/AccountDetails';
import TraderSideInfo from 'containers/Summary/components/TraderSideInfo';
import AccountTypesList from 'containers/Summary/components/AccountTypesList';
import { CardBottom, Card, CardTop, Button, Text } from 'containers/Summary';
import { ReactSVG } from 'react-svg';
import { connect as Connect } from 'react-redux';
import { uniqueId } from 'lodash';
import AppMenuBarItem from 'components/AppBar/AppMenuBarItem';
import { ConnectorSide } from 'components/AppBar/AppMenuBarItem';
import SettingsEditor from './SettingsEditor';
import Toolbox from './Toolbox';
import SidebarItem from 'components/AppMenuSidebar/SidebarItem';
import { setDashboarEdit } from 'actions/appActions';
import { bindActionCreators } from 'redux';
import { ContainerImage } from 'containers/Summary';
import { Box, Grid, Button as MaterialButton } from '@material-ui/core';
import store from '../../store';

const Topbar = () => {
	const { actions, query, canUndo, canRedo } = useEditor((state) => ({
		enabled: state.options.enabled,
		canUndo: state.options.enabled && query.history.canUndo(),
		canRedo: state.options.enabled && query.history.canRedo(),
	}));
	return (
		<Box px={1} py={1} mt={3} mb={1} bgcolor="#303236">
			<Grid container alignItems="center">
				<Grid item xs>
					<MaterialButton
						size="small"
						variant="contained"
						color="primary"
						disabled={!canUndo}
						onClick={() => actions.history.undo()}
						style={{ marginRight: '10px', color: 'white' }}
					>
						Undo
					</MaterialButton>
				</Grid>
				<Grid item xs>
					<MaterialButton
						size="small"
						variant="contained"
						color="primary"
						disabled={!canRedo}
						onClick={() => actions.history.redo()}
						style={{ marginRight: '10px', color: 'white' }}
					>
						Redo
					</MaterialButton>
				</Grid>
				<Grid item xs>
					{/* <FormControlLabel
						control={
							<Switch
								checked={enabled}
								onChange={(_, value) =>{
									actions.setOptions((options) => (options.enabled = value)) 
									// if(!value)
									// 	onHandleEdit()
									}
								}
							/>
						}
						label="Enable"
					/> */}
				</Grid>
				<Grid item>
					<MaterialButton
						size="small"
						variant="contained"
						color="primary"
						onClick={() => {
							console.log(query.serialize());
						}}
					>
						Save
					</MaterialButton>
				</Grid>
			</Grid>
		</Box>
	);
};

export const CraftAppBar = ({
	router,
	menuItems,
	activeMenu,
	handleMenuChange,
	isHome,
	isBrowser,
	isMenubar,
	background,
	padding = 0,
	width,
	height,
	display = 'flex',
	flexDirection = 'column',
	gap = 10,
}) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div
			ref={(ref) => connect(drag(ref))}
			style={{ width, height, display, flexDirection, gap }}
		>
			<AppBar
				router={router}
				menuItems={menuItems}
				activePath={activeMenu}
				onMenuChange={handleMenuChange}
				isHome={isHome}
			>
				{isBrowser && isMenubar && (
					<AppMenuBar
						menuItems={menuItems}
						activePath={activeMenu}
						onMenuChange={handleMenuChange}
					/>
				)}
			</AppBar>
		</div>
	);
};

export const CraftPairTabs = ({
	activePath,
	location,
	router,
	background,
	padding = 0,
	width,
	height,
	display = 'flex',
	flexDirection = 'column',
	gap = 10,
}) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div
			ref={(ref) => connect(drag(ref))}
			style={{ width, height, display, flexDirection, gap }}
		>
			<PairTabs activePath={activePath} location={location} router={router} />
		</div>
	);
};

export const CraftMenu = ({
	router,
	menuItems,
	activeMenu,
	onMenuChange,
	editSideMenu,
	isHome,
	isBrowser,
	isMenubar,
	background,
	padding = 0,
	width,
	height,
	display = 'flex',
	flexDirection = 'column',
	gap = 10,
}) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div
			ref={(ref) => connect(drag(ref))}
			className="d-flex justify-content-between app-side-bar"
			style={{ border: `${editSideMenu ? '1px' : '0px'} solid white` }}
		>
			<AppMenuSidebar
				menuItems={menuItems}
				activePath={activeMenu}
				onMenuChange={onMenuChange}
			/>
		</div>
	);
};

export const ConnectorSideMenu = ({ children }) => {
	const {
		connectors: { connect },
	} = useNode();
	return (
		<div
			ref={connect}
			className="d-flex justify-content-between app-side-bar"
			style={{ minHeight: 20, minWidth: 20 }}
		>
			{children}
		</div>
	);
};

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
		editSideMenu: false,
		editTopMenu: false,
	};
	ordersQueued = [];
	limitTimeOut = null;

	UNSAFE_componentWillMount() {
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

		setTimeout(
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

	componentDidUpdate(prevProps) {
		const { tools } = this.props;
		if (
			JSON.stringify(prevProps.location) !== JSON.stringify(this.props.location)
		) {
			this.setActiveMenu();
		}
		if (JSON.stringify(prevProps.tools) !== JSON.stringify(tools)) {
			storeTools(tools);
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

	handleMenuChange = (path = '', cb) => {
		const { router, pairs } = this.props;

		let pair = '';
		if (Object.keys(pairs).length) {
			pair = Object.keys(pairs)[0];
		} else {
			pair = this.props.pair;
		}

		switch (path) {
			case 'logout':
				this.logout();
				break;
			case 'help':
				this.props.openHelpfulResourcesForm();
				break;
			case 'quick-trade':
				router.push(`/quick-trade/${pair}`);
				break;
			default:
				router.push(path);
		}

		this.setState({ activePath: path }, () => {
			if (cb) {
				cb();
			}
		});
	};

	goToPage = (path) => {
		if (this.props.location.pathname !== path) {
			this.props.router.push(path);
		}
	};

	goToPair = (pair) => {
		const { router } = this.props;
		router.push(`/trade/${pair}`);
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
			case NOTIFICATIONS.ORDERS:
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
		} = this.props;

		const {
			dialogIsOpen,
			appLoaded,
			chatIsClosed,
			isCustomNotification,
			paramsData,
			// sidebarFitHeight,
			// isSidebarOpen,
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

		// console.log({A: appLoaded})
		// console.log({D: pairsTradesFetched})
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

							{/* <Editor resolver={{
							AccountAssets,
							CraftContainer,
							ContainerFlex,
							ProfileSummary,
							MyAssets,
							SummaryBlock,
							Connector,
							Image,
							EditWrapper,
							AccountDetails,
							CraftMarkets,
							CraftAccountDetails,
							TraderSideInfo,
							AccountDetails,
							AccountTypesList,
							Card,
							CardBottom,
							CardTop,
							Button,
							Text,
							Container,
							ReactSVG,
							CraftAppBar,
							Connect,
							Dialog,
							AppMenuSidebar
				 		}}>  */}
							{/* <Frame> */}

							<div className="d-flex flex-column f-1">
								<div
									style={{
										border: `${
											this.state.editTopMenu ? '1px' : '0px'
										} solid white`,
									}}
								>
									<Editor
										enabled={this.state.editTopMenu}
										resolver={{
											AccountAssets,
											CraftContainer,
											ContainerFlex,
											ProfileSummary,
											MyAssets,
											SummaryBlock,
											Connector,
											Image,
											EditWrapper,
											AccountDetails,
											CraftMarkets,
											CraftAccountDetails,
											TraderSideInfo,
											AccountTypesList,
											Card,
											CardBottom,
											CardTop,
											Button,
											Text,
											Container,
											ReactSVG,
											CraftAppBar,
											Connect,
											Dialog,
											AppMenuSidebar,
											AppMenuBarItem,
											ConnectorSide,
											CraftPairTabs,
											ContainerImage,
										}}
									>
										<div
											style={{
												width: '20rem',
												height: 1200,
												backgroundColor: '#303236',
												color: 'white',
												position: 'absolute',
												right: 0,
												top: 100,
												zIndex: 1,
												display: this.state.editTopMenu ? 'block' : 'none',
											}}
										>
											<Topbar />
											<Toolbox />
											<SettingsEditor />
										</div>
										<Frame>
											<Element id={uniqueId()} is={Connector} canvas>
												{!isChartEmbed && (
													<CraftAppBar
														router={router}
														menuItems={menuItems}
														activeMenu={this.state.activeMenu}
														handleMenuChange={this.handleMenuChange}
														isHome={isHome}
														isBrowser={isBrowser}
														isMenubar={isMenubar}
													/>
												)}

												{isBrowser && !isHome && !isChartEmbed && (
													<CraftPairTabs
														activePath={activePath}
														location={location}
														router={router}
													/>
												)}
											</Element>
										</Frame>
									</Editor>
								</div>
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
									<Editor
										enabled={this.state.editSideMenu}
										resolver={{
											AccountAssets,
											CraftContainer,
											ContainerFlex,
											ProfileSummary,
											MyAssets,
											SummaryBlock,
											Connector,
											Image,
											EditWrapper,
											AccountDetails,
											CraftMarkets,
											CraftAccountDetails,
											TraderSideInfo,
											AccountTypesList,
											Card,
											CardBottom,
											CardTop,
											Button,
											Text,
											Container,
											ReactSVG,
											CraftAppBar,
											Connect,
											Dialog,
											AppMenuSidebar,
											AppMenuBarItem,
											ConnectorSide,
											CraftPairTabs,
											CraftMenu,
											ConnectorSideMenu,
											SidebarItem,
											ContainerImage,
										}}
									>
										<div
											style={{
												width: '20rem',
												height: 1200,
												backgroundColor: '#303236',
												color: 'white',
												position: 'absolute',
												right: 0,
												top: 100,
												zIndex: 1,
												display: this.state.editSideMenu ? 'block' : 'none',
											}}
										>
											<Topbar />
											<Toolbox />
											<SettingsEditor />
										</div>
										<Frame props={{ editSideMenu: this.state.editSideMenu }}>
											<Element id={uniqueId()} is={ConnectorSideMenu} canvas>
												{isMenuSider && (
													<CraftMenu
														menuItems={menuItems}
														activePath={this.state.activeMenu}
														onMenuChange={this.handleMenuChange}
														editSideMenu={this.state.editSideMenu}
													/>
												)}
											</Element>
										</Frame>
									</Editor>

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
												(activeNotification.type === NOTIFICATIONS.ORDERS &&
													!isMobile) ||
												activeNotification.type === NOTIFICATIONS.ERROR ||
												activeNotification.type ===
													NOTIFICATIONS.UNDEFINED_ERROR
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
										/>
									</div>
								)}
							</div>
							{/* </Frame> */}
							{/* </Editor> */}

							{this.props.user.id === 1 && (
								<div
									style={{
										position: 'fixed',
										top: '100vh',
										transform: 'translateY(-180%)',
										width: '100%',
										display: 'flex',
										flexDirection: 'column',
										gap: 5,
									}}
								>
									<div
										onClick={() => {
											store.dispatch(setDashboarEdit(false));
											this.setState({ editSideMenu: false });
											setTimeout(() => {
												this.setState({
													editTopMenu: true,
													editSideMenu: false,
												});
											}, 150 * 1);
										}}
										style={{
											backgroundColor: '#0000FF',
											color: 'white',
											fontWeight: 'bold',
											width: 200,
											textAlign: 'center',
											cursor: 'pointer',
										}}
									>
										Edit Top Bar Design
									</div>
									<div
										onClick={() => {
											store.dispatch(setDashboarEdit(false));
											this.setState({ editTopMenu: false });
											setTimeout(() => {
												this.setState({
													editTopMenu: false,
													editSideMenu: true,
												});
											}, 150 * 1);
										}}
										style={{
											backgroundColor: '#0000FF',
											color: 'white',
											fontWeight: 'bold',
											width: 200,
											textAlign: 'center',
											cursor: 'pointer',
										}}
									>
										Edit Side Menu Bar Design
									</div>
									<div
										onClick={() => {
											store.dispatch(setDashboarEdit(true));
											setTimeout(() => {
												this.setState({
													editTopMenu: false,
													editSideMenu: false,
												});
											}, 150 * 1);
										}}
										style={{
											backgroundColor: '#0000FF',
											color: 'white',
											fontWeight: 'bold',
											width: 200,
											textAlign: 'center',
											cursor: 'pointer',
										}}
									>
										Edit Dashboard Design
									</div>
									{(this.props.setEdit ||
										this.state.editSideMenu ||
										this.state.editTopMenu) && (
										<div
											onClick={() => {
												store.dispatch(setDashboarEdit(false));
												this.setState({
													editTopMenu: false,
													editSideMenu: false,
												});
											}}
											style={{
												backgroundColor: '#0000FF',
												color: 'white',
												fontWeight: 'bold',
												width: 200,
												textAlign: 'center',
												cursor: 'pointer',
											}}
										>
											Exit
										</div>
									)}
								</div>
							)}
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

				{isAdmin() && isBrowser && !isChartEmbed && (
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

const mapStateToProps = (state) => {
	return {
		setEdit: state.app.editMode,
		user: state.user || {},
	};
};

const mapDispatchToProps = (dispatch) => ({
	setDashboarEdit: bindActionCreators(setDashboarEdit, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withEdit(withConfig(App)));
