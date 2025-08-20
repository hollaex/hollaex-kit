import React, { Fragment } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CaretLeftOutlined } from '@ant-design/icons';
import {
	Layout,
	Menu,
	Row,
	Col,
	Spin,
	message,
	Tooltip,
	Input,
	Modal,
} from 'antd';
import { debounce, capitalize } from 'lodash';
import { ReactSVG } from 'react-svg';
import MobileDetect from 'mobile-detect';
// eslint-disable-next-line
import {
	// eslint-disable-next-line
	PATHS,
	ADMIN_PATHS,
	// eslint-disable-next-line
	SUPERVISOR_PATH,
	// eslint-disable-next-line
	pathToPermissionMap,
} from '../paths';
import SetupWizard from '../SetupWizard';
import {
	removeToken,
	isLoggedIn,
	isSupport,
	isSupervisor,
	isAdmin,
	// eslint-disable-next-line
	checkRole,
	getRole,
	// eslint-disable-next-line
	getPermissions,
} from 'utils/token';
import { getExchangeInitialized, getSetupCompleted } from 'utils/initialize';
import { logout } from 'actions/authAction';
import { getMe, setMe } from 'actions/userAction';
import { setPairsData } from 'actions/orderbookAction';
import {
	setPairs,
	changePair,
	setCurrencies,
	setOrderLimits,
	setConfig,
	setLanguage,
	changeTheme,
	// requestAvailPlugins,
	requestInitial,
	requestConstant,
	setRolesList,
} from 'actions/appActions';
import { SESSION_TIME } from 'config/constants';
import { STATIC_ICONS } from 'config/icons';
import MobileSider from './mobileSider';
import './index.css';
import '../../../.././src/admin_theme_variables.css';
import 'antd/dist/antd.css';
import { requestMyPlugins } from 'containers/Admin/Plugins/action';
import { setAllPairs, setCoins, setExchange } from 'actions/assetActions';
// import { allCoins } from '../AdminFinancials/Assets';
// import { allPairs } from '../Trades/Pairs';
import {
	getAllCoins,
	getAllPairs,
	// getConstants,
	getExchange,
} from '../AdminFinancials/action';
import Timer from './Timer';
import { getTabParams } from '../AdminFinancials/Assets';
import { roleStyles } from '../Roles/RoleManagement';
import { fetchRoles } from '../Roles/action';
import { isColorDark } from '../Roles/Utils';
import OperatorControlSearch from './OperatorControlSearch';

const md = new MobileDetect(window.navigator.userAgent);

const { Content, Sider } = Layout;
const { Item } = Menu;

// const ASSET_TYPE_LIST = [
// 	{ key: 'Bitcoin', value: 'btc' },
// 	{ key: 'Bitcoin Cash', value: 'bch' },
// 	{ key: 'Ripple', value: 'xrp' },
// 	{ key: 'Ethereum', value: 'eth' },
// 	{ key: 'HollaEx', value: 'hex' },
// 	{ key: 'HollaEx', value: 'xht' },
// 	{ key: 'Bitcoin Satoshi Vision', value: 'bsv' },
// 	{ key: 'USD Tether', value: 'usdt' },
// 	{ key: 'BNB', value: 'bnb' },
// 	{ key: 'UNUS SED LEO', value: 'leo' },
// 	{ key: 'Maker', value: 'mkr' },
// 	{ key: 'USD Coin', value: 'usdc' },
// 	{ key: 'BAT', value: 'bat' },
// 	{ key: 'Monero', value: 'xmr' },
// 	{ key: 'EOS', value: 'eos' },
// 	{ key: 'Litecoin', value: 'ltc' },
// 	{ key: 'Stellar', value: 'xlm' },
// 	{ key: 'Cardano', value: 'ada' },
// 	{ key: 'Tron', value: 'trx' },
// 	{ key: 'NEO', value: 'neo' },
// 	{ key: 'NEM', value: 'nem' },
// 	{ key: 'Ethereum Classic', value: 'etc' },
// 	{ key: 'Dash', value: 'dash' },
// 	{ key: 'IOTA', value: 'miota' },
// 	{ key: 'ZRX', value: 'zrx' },
// 	{ key: 'Gold Tether', value: 'xaut' }
// ];

class AppWrapper extends React.Component {
	constructor(prop) {
		super(prop);
		this.state = {
			isSupportUser: false,
			isSupervisorUser: false,
			isAdminUser: false,
			isLoaded: false,
			appLoaded: false,
			publicSocket: undefined,
			idleTimer: undefined,
			setupCompleted: true,
			myPlugins: [],
			isConfigure: false,
			isDisplaySearchPopup: false,
			search: '',
		};
	}

	onHandleRoleDetails = async () => {
		try {
			const roles = await fetchRoles();
			this.props.setRolesList(roles?.data);
		} catch (error) {
			console.error(error);
		}
	};

	componentDidMount() {
		this.getData();
		this.onHandleRoleDetails();
		// this.getAssets();

		// if (!this.props.fetchingAuth && !Object.keys(this.props.pairs).length) {
		if (!this.props.fetchingAuth) {
			this.initSocketConnections();
		}
		const initialized = getExchangeInitialized();
		const setupCompleted = getSetupCompleted();
		if (
			initialized === 'false' ||
			(typeof initialized === 'boolean' && !initialized)
		) {
			this.props.router.push('/init');
		}
		this._resetTimer();
		// this.props.requestAvailPlugins();
		this.setState({
			setupCompleted:
				setupCompleted === 'false' ||
				(typeof setupCompleted === 'boolean' && !setupCompleted)
					? false
					: true,
			isSupportUser: isSupport(),
			isSupervisorUser: isSupervisor(),
			isAdminUser: isAdmin(),
			isLoaded: true,
		});
		this.getMyPlugins();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		// if (
		// 	!nextProps.fetchingAuth &&
		// 	nextProps.fetchingAuth !== this.props.fetchingAuth &&
		// 	!Object.keys(this.props.pairs).length
		// ) {
		if (
			!nextProps.fetchingAuth &&
			nextProps.fetchingAuth !== this.props.fetchingAuth
		) {
			if (!this.state.publicSocket) {
				this.initSocketConnections();
			}
		}
	}

	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(prevProps.location) !==
				JSON.stringify(this.props.location) &&
			this.state.isConfigure
		) {
			this.setState({ isConfigure: false });
		}
	}

	componentWillUnmount() {
		if (this.state.idleTimer) {
			clearTimeout(this.state.idleTimer);
		}
		this.resetTimer && this.resetTimer.cancel();
	}

	getData = async () => {
		await this.getExchange();
		await this.getCoins();
		await this.getPairs();
	};

	getExchange = async () => {
		try {
			const res = await getExchange();
			const exchange = res.data;
			this.props.setExchange(exchange);
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};
	getCoins = async () => {
		try {
			const res = await getAllCoins();
			this.props.setCoins(res.data.data);
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};
	getPairs = async () => {
		try {
			const res = await getAllPairs();
			this.props.setAllPairs(res.data.data);
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	initSocketConnections = () => {
		this.setPublicWS();
		if (isLoggedIn()) {
			this.setUserSocket();
		}
		this.setState({ appLoaded: true }, () => {
			this._resetTimer();
		});
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

	setPublicWS = () => {
		requestInitial()
			.then((res) => {
				if (res && res.data) {
					this.props.setConfig(res.data);
				}
			})
			.catch((err) => {
				console.error(err);
			});

		requestConstant()
			.then((res) => {
				if (res && res.data) {
					if (!this.props.pair) {
						const pair = Object.keys(res.data.pairs)[0];
						this.props.changePair(pair);
					}
					this.props.setPairs(res.data.pairs);
					this.props.setPairsData(res.data.pairs);
					this.props.setCurrencies(res.data.coins);

					const orderLimits = {};
					Object.keys(res.data.pairs).map((pair, index) => {
						orderLimits[pair] = {
							PRICE: {
								MIN: res.data.pairs[pair].min_price,
								MAX: res.data.pairs[pair].max_price,
								STEP: res.data.pairs[pair].increment_price,
							},
							SIZE: {
								MIN: res.data.pairs[pair].min_size,
								MAX: res.data.pairs[pair].max_size,
								STEP: res.data.pairs[pair].increment_price,
							},
						};
						return '';
					});
					this.props.setOrderLimits(orderLimits);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	setUserSocket = (token) => {
		this.props
			.getMe()
			.then(({ value }) => {
				if (value && value.data && value.data.id) {
					const data = value.data;
					this.props.setMe(data);
					if (
						data.settings &&
						data.settings.language !== this.props.activeLanguage
					) {
						this.props.changeLanguage(data.settings.language);
					}
					if (
						data.settings.interface &&
						data.settings.interface.theme !== this.props.activeTheme
					) {
						this.props.changeTheme(data.settings.interface.theme);
						localStorage.setItem('theme', data.settings.interface.theme);
					}
					if (
						data.settings.interface &&
						data.settings.interface.display_currency
					) {
						localStorage.setItem(
							'base_currnecy',
							data.settings.interface.display_currency
						);
					}
				}
			})
			.catch((err) => {
				let error = err.message;
				if (err.data && err.data.message) {
					error = err.data.message;
				}
				if (error.indexOf('Access Denied') > -1) {
					this.logout('Token is expired');
				}
			});
	};

	isSocketDataReady = () => {
		const { pairs } = this.props;
		return Object.keys(pairs).length;
	};

	logout = (message = '') => {
		this.setState({ appLoaded: false }, () => {
			this.props.logout(typeof message === 'string' ? message : '');
		});
	};

	renderMenuItem = ({ path, label, routeKey, ...rest }, index) => {
		const { constants: { logo_image } = {} } = this.props;
		let showLabel = label;
		if (routeKey === 'main') {
			showLabel = this.props.constants.api_name || '';
			return (
				<Item key={index} className="custom-side-menu">
					<Link to={path} className="no-link" key={index}>
						<div
							className={
								this.props.location.pathname === '/admin'
									? 'sidebar-exchange-menu flex-menu active-exchange-menu'
									: 'sidebar-exchange-menu flex-menu'
							}
						>
							<ReactSVG
								src={logo_image || STATIC_ICONS.HEX_PATTERN_ICON}
								className="sidebar-icon"
								fallback={() => (
									<img
										src={logo_image || STATIC_ICONS.HEX_PATTERN_ICON}
										alt="exchange-logo"
										className="sidebar-icon"
									/>
								)}
							/>
							<div>
								<div>DASHBOARD</div>
								<div className="exchange-title">{showLabel}</div>
							</div>
						</div>
					</Link>
				</Item>
			);
		}
		return (
			<Item key={index} className="custom-side-menu">
				<Link to={path} className="no-link" key={index}>
					<div
						className={
							this.props.location.pathname.includes(path)
								? 'sidebar-menu active-side-menu'
								: 'sidebar-menu'
						}
					>
						{showLabel}
					</div>
				</Link>
			</Item>
		);
	};

	renderCapitalize = (data) => {
		let text = data;
		if (text.includes('-')) {
			text = text.replace(/-/g, ' ');
		}
		return capitalize(text);
	};

	getTitle = () => {
		const { location = {}, router } = this.props;
		const tabParams = getTabParams();
		if (location.pathname.includes('/admin/user') && !this.state.isConfigure) {
			return 'Users';
		} else if (
			location.pathname.includes('/admin/user') &&
			this.state.isConfigure
		) {
			return 'Configure Meta';
		} else if (location.pathname.includes('/admin/general')) {
			return 'General';
		} else if (
			location.pathname.includes('/admin/fiat') ||
			tabParams?.isFiat === 'onRamp' ||
			tabParams?.isFiat === 'offRamp'
		) {
			return 'Fiat controls';
		} else if (location.pathname.includes('/admin/stakes')) {
			return 'Stakes';
		} else if (location.pathname.includes('/admin/sessions')) {
			return 'Sessions';
		} else if (location.pathname.includes('/admin/financial')) {
			return 'Assets';
		} else if (location.pathname.includes('/admin/trade')) {
			return 'Markets';
		} else if (location.pathname.includes('/admin/plugins')) {
			return 'Plugin apps';
		} else if (location.pathname.includes('/admin/apps')) {
			return 'Apps';
		} else if (location.pathname.includes('/admin/tiers')) {
			return 'Tiers';
		} else if (location.pathname.includes('/admin/roles')) {
			return 'Roles';
		} else if (location.pathname.includes('/admin/hosting')) {
			return 'Hosting';
		} else if (location.pathname.includes('/admin/apikey')) {
			return 'API keys';
		} else if (location.pathname.includes('/admin/billing')) {
			return 'Billing';
		} else if (location.pathname.includes('/admin/audits')) {
			return 'Operator Logs';
		} else if (location.pathname.includes('/admin/collateral')) {
			return 'Collateral';
		} else if (location.pathname.includes('/admin/resources')) {
			return 'Resources';
		} else if (location.pathname.includes('/admin/chat')) {
			return 'Chat';
		} else if (location.pathname.includes('/admin/announcement')) {
			return 'Announcements';
		} else if (location.pathname.includes('/admin/plugin/adminView')) {
			return this.renderCapitalize(router.params.name);
		} else {
			return 'Dashboard';
		}
	};

	renderItems = () => {
		const { rolesList } = this.props;
		const selectedRole = rolesList?.find(
			(role) => role?.role_name?.toLowerCase() === getRole()
		);
		const isRoleDark = isColorDark(selectedRole?.color)
			? `${
					roleStyles[getRole()]?.cardWrapper
			  } role-section operator-control-card-light`
			: `${
					roleStyles[getRole()]?.cardWrapper
			  } role-section operator-control-card-dark`;
		return (
			<div
				className={isRoleDark}
				style={{ backgroundColor: selectedRole?.color }}
			>
				<div>
					<ReactSVG
						src={
							roleStyles[getRole()]?.rolesImage ||
							STATIC_ICONS.BLUE_SCREEN_EYE_ICON
						}
						className="sider-icons slider-role-badge"
						alt="EyeIcon"
					/>
				</div>
				<div>
					<div className="main-label">Role:</div>
					<div className="sub-label text-capitalize">{getRole()}</div>
				</div>
			</div>
		);
	};

	getMyPlugins = (params = {}) => {
		return requestMyPlugins({ ...params })
			.then((res) => {
				if (res && res.data) {
					this.setState({ myPlugins: res.data });
				}
			})
			.catch((err) => {
				throw err;
			});
	};

	showConfigure = () => {
		this.setState({ isConfigure: !this.state.isConfigure });
	};

	setSearch = (text) => {
		this.setState({ search: text });
	};

	onHandleClose = () => {
		this.setState({ isDisplaySearchPopup: false, search: '' });
	};

	render() {
		const {
			children,
			router,
			user,
			constants: { features },
		} = this.props;
		const logout = () => {
			removeToken();
			router.replace('/login');
		};
		const {
			isAdminUser,
			isLoaded,
			appLoaded,
			setupCompleted,
			myPlugins,
			isConfigure,
		} = this.state;
		let pathNames = [];

		const userPermissions = this.props?.user?.permissions || [];

		pathNames = ADMIN_PATHS.filter((item) => {
			if (item.path === '/admin') return true;
			const requiredPrefixes = pathToPermissionMap[item.path] || [
				`${item.path}:`,
			];
			return requiredPrefixes.some((prefix) =>
				userPermissions.some((p) => p.startsWith(prefix))
			);
		});

		if (checkRole() === 'admin') {
			pathNames.push({
				path: '/admin/billing',
				label: 'Billing',
				routeKey: 'billing',
			});
		}

		// if (checkRole() === 'admin') {
		// 	pathNames = ADMIN_PATHS;
		// } else if (checkRole() === 'supervisor') {
		// 	pathNames = [...PATHS, ...SUPERVISOR_PATH];
		// } else {
		// 	pathNames = PATHS;
		// }

		if (features.apps && checkRole() === 'admin') {
			pathNames = [
				...pathNames,
				{
					path: '/admin/apps',
					label: 'Apps',
					routeKey: 'apps',
				},
			];
		}

		if (features.announcement) {
			pathNames = [
				...pathNames,
				{
					path: '/admin/announcement',
					label: 'Announcements',
					routeKey: 'adminView',
				},
			];
		}

		myPlugins.forEach((data) => {
			if (data.enabled && data.enabled_admin_view) {
				pathNames = [
					...pathNames,
					{
						path: `/admin/plugin/adminView/${data.name}`,
						label: this.renderCapitalize(data.name),
						routeKey: 'adminView',
					},
				];
			}
		});

		if (!isLoaded) return null;
		if (!isLoggedIn()) {
			router.replace('/login');
		}
		if (isLoggedIn() && !isAdminUser) {
			router.replace('/summary');
		}
		if (!setupCompleted) {
			return <SetupWizard user={user} />;
		}
		if (md.phone()) {
			return (
				<Layout>
					<Row>
						<Col span={8}>
							<MobileSider menuItem={this.renderMenuItem} logout={logout} />
						</Col>

						{/*<Sider style={{width: 100}}>*/}
						{/*<Menu theme="dark" mode="vertical" style={{ lineHeight: '64px' }} className="m-top">*/}
						{/*{PATHS.filter(*/}
						{/*({ hideIfSupport }) => !isSupportUser || !hideIfSupport*/}
						{/*).map(renderMenuItem)}*/}
						{/*<Menu.Item key="logout">*/}
						{/*<div onClick={logout}>*/}
						{/*<Icon type="logout" />LOGOUT*/}
						{/*</div>*/}
						{/*</Menu.Item>*/}
						{/*</Menu>*/}
						{/*</Sider>*/}

						<Col span={16}>
							<Layout>
								<Content style={{ marginLeft: 50, marginTop: 0 }}>
									<div className="content-wrapper admin-content-wrapper">
										{appLoaded && this.isSocketDataReady() ? (
											children
										) : (
											<Spin size="large" className="m-top" />
										)}
									</div>
								</Content>
							</Layout>
						</Col>
					</Row>
				</Layout>
			);
		} else {
			const prevPath = localStorage.getItem('prevPath');
			return (
				<Fragment>
					<Modal
						visible={this.state.isDisplaySearchPopup}
						onCancel={this.onHandleClose}
						footer={null}
						maskClosable={false}
						className="operator-control-search-popup"
					>
						<OperatorControlSearch
							onHandleClose={this.onHandleClose}
							search={this.state.search}
							setSearch={this.setSearch}
							isDisplaySearchPopup={this.state.isDisplaySearchPopup}
						/>
					</Modal>
					<div className="admin-top-bar">
						<Link to={prevPath}>
							<div className="top-box-menu">
								<CaretLeftOutlined />
								Back to Website
							</div>
						</Link>
						<div className="admin-top-header">Operator Control Panel</div>
						<div className="mr-2 time-wrapper d-flex align-items-center">
							<div
								className="pointer"
								onClick={() =>
									this.setState({
										isDisplaySearchPopup: true,
									})
								}
							>
								<Input
									placeholder="Search"
									size="small"
									readOnly
									prefix={<ReactSVG src={STATIC_ICONS['SEARCH']} />}
									className="admin-search-input"
								/>
							</div>
							<Tooltip placement="bottom" title={<Timer isHover={true} />}>
								<div className="ml-4">
									<Timer isHover={false} />
								</div>
							</Tooltip>
						</div>
					</div>
					<Layout>
						<Sider width={310}>
							<div className="d-flex flex-column justify-content-between menu-wrapper">
								<Menu
									// theme="dark"
									mode="vertical"
									style={{ lineHeight: '64px' }}
									// className="m-top"
								>
									<div>{this.renderItems()}</div>
									{pathNames
										.filter(
											({ hideIfSupport, hideIfSupervisor, hideIfKYC }) => true
										)
										.map(this.renderMenuItem)}
								</Menu>
								<div>
									<Menu mode="vertical" style={{ lineHeight: '64px' }}>
										<Item className="custom-side-menu">
											<Link to="/admin/resources">
												<div
													className={
														this.props.location.pathname.includes('/resources')
															? 'sidebar-menu resource-text active-side-menu'
															: 'sidebar-menu resource-text'
													}
												>
													Resources
												</div>
											</Link>
										</Item>
										<Item className="custom-side-menu">
											<div className={'sidebar-menu'} onClick={logout}>
												Logout
											</div>
										</Item>
									</Menu>
								</div>
							</div>
						</Sider>
						<Layout>
							<Content>
								<div className="admin-content-head">{this.getTitle()}</div>
								<div className="content-wrapper admin-content-wrapper">
									{appLoaded && this.isSocketDataReady() ? (
										React.cloneElement(children, {
											isConfigure: isConfigure,
											showConfigure: this.showConfigure,
										})
									) : (
										<Spin size="large" className="m-top" />
									)}
								</div>
							</Content>
						</Layout>
					</Layout>
				</Fragment>
			);
		}
	}
}

const mapStateToProps = (state) => ({
	fetchingAuth: state.auth.fetching,
	pairs: state.app.pairs,
	constants: state.app.constants,
	user: state.user,
	rolesList: state.app.rolesList,
});

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
	setPairs: bindActionCreators(setPairs, dispatch),
	setPairsData: bindActionCreators(setPairsData, dispatch),
	setCurrencies: bindActionCreators(setCurrencies, dispatch),
	setConfig: bindActionCreators(setConfig, dispatch),
	setOrderLimits: bindActionCreators(setOrderLimits, dispatch),
	getMe: bindActionCreators(getMe, dispatch),
	setMe: bindActionCreators(setMe, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	logout: bindActionCreators(logout, dispatch),
	setCoins: bindActionCreators(setCoins, dispatch),
	setAllPairs: bindActionCreators(setAllPairs, dispatch),
	setExchange: bindActionCreators(setExchange, dispatch),
	setRolesList: bindActionCreators(setRolesList, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
