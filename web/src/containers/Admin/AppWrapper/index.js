import React, { Fragment } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CaretLeftOutlined } from '@ant-design/icons';
import { Layout, Menu, Row, Col, Spin } from 'antd';
import { debounce } from 'lodash';
import { ReactSVG } from 'react-svg';

import { PATHS } from '../paths';
import SetupWizard from '../SetupWizard';
import {
	removeToken,
	isLoggedIn,
	isSupport,
	isSupervisor,
	isAdmin,
	getTokenTimestamp,
} from '../../../utils/token';
import { checkUserSessionExpired } from '../../../utils/utils';
import {
	getExchangeInitialized,
	getSetupCompleted,
} from '../../../utils/initialize';
import { logout } from '../../../actions/authAction';
import { getMe, setMe } from '../../../actions/userAction';
import { setPairsData } from '../../../actions/orderbookAction';
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
} from '../../../actions/appActions';
import { SESSION_TIME } from '../../../config/constants';
import { STATIC_ICONS } from 'config/icons';
import { checkRole } from '../../../utils/token';

import MobileDetect from 'mobile-detect';
import MobileSider from './mobileSider';
import './index.css';
import 'antd/dist/antd.css';

const md = new MobileDetect(window.navigator.userAgent);

const { Content, Sider } = Layout;
const { Item } = Menu;

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
		};
	}

	componentWillMount() {
		if (isLoggedIn() && checkUserSessionExpired(getTokenTimestamp())) {
			this.logout('Token is expired');
		}
	}

	componentDidMount() {
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

	componentWillUnmount() {
		if (this.state.idleTimer) {
			clearTimeout(this.state.idleTimer);
		}
	}

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
				}
			})
			.catch((err) => {
				console.log('err', err);
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

	getTitle = () => {
		const { location = {} } = this.props;
		if (location.pathname.includes('/admin/user')) {
			return 'Users';
		} else if (location.pathname.includes('/admin/general')) {
			return 'General';
		} else if (location.pathname.includes('/admin/financial')) {
			return 'Financial';
		} else if (location.pathname.includes('/admin/trade')) {
			return 'Trade';
		} else if (location.pathname.includes('/admin/plugins')) {
			return 'Plugins';
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
		} else if (location.pathname.includes('/admin/collateral')) {
			return 'Collateral';
		} else if (location.pathname.includes('/admin/resources')) {
			return 'Resources';
		} else {
			return 'Dashboard';
		}
	};

	renderItems = () => {
		switch (checkRole()) {
			case 'supervisor':
				return (
					<div className="role-section bg-black">
						<div>
							<ReactSVG
								src={STATIC_ICONS.BLUE_SCREEN_SUPERVISOR}
								className="sider-icons"
							/>
						</div>
						<div>
							<div className="main-label">Role:</div>
							<div className="sub-label">SuperVisor</div>
						</div>
					</div>
				);
			case 'kyc':
				return (
					<div className="role-section bg-grey">
						<div>
							<ReactSVG
								src={STATIC_ICONS.BLUE_SCREEN_KYC}
								className="sider-icons"
							/>
						</div>
						<div>
							<div className="main-label black">Role:</div>
							<div className="sub-label black">KYC</div>
						</div>
					</div>
				);
			case 'tech':
				return (
					<div className="role-section bg-orange">
						<div>
							<ReactSVG
								src={STATIC_ICONS.BLUE_SCREEN_COMMUNICATON_SUPPORT_ROLE}
								className="sider-icons"
							/>
						</div>
						<div>
							<div className="main-label">Role:</div>
							<div className="sub-label">Support</div>
						</div>
					</div>
				);
			case 'support':
				return (
					<div className="role-section bg-yellow">
						<div>
							<ReactSVG
								src={STATIC_ICONS.BLUE_SCREEN_EXCHANGE_SUPPORT_ROLE}
								className="sider-icons"
							/>
						</div>
						<div>
							<div className="main-label black">Role:</div>
							<div className="sub-label black">Support</div>
						</div>
					</div>
				);
			default:
				return (
					<div className="role-section">
						<div>
							<img
								src={STATIC_ICONS.BLUE_SCREEN_EYE_ICON}
								className="sider-icons"
								alt="EyeIcon"
							/>
						</div>
						<div>
							<div className="main-label">Role:</div>
							<div className="sub-label">Administrator</div>
						</div>
					</div>
				);
		}
	};

	render() {
		const { children, router, user } = this.props;
		const logout = () => {
			removeToken();
			router.replace('/login');
		};
		const { isAdminUser, isLoaded, appLoaded, setupCompleted } = this.state;

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
			return (
				<Fragment>
					<div className="admin-top-bar">
						<Link to="/summary">
							<div className="top-box-menu">
								<CaretLeftOutlined />
								Back to Exchange web
							</div>
						</Link>
						<div className="admin-top-header">Operator Control Panel</div>
						<div className="top-box-menu">
							<img
								src={STATIC_ICONS.BLUE_SCREEN_LINK}
								className="link-icon"
								alt="Link-icon"
							/>{' '}
							<a
								href="https://dash.bitholla.com/"
								target="_blank"
								rel="noopener noreferrer"
							>
								Go to Holla Dash
							</a>
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
									{PATHS.filter(
										({ hideIfSupport, hideIfSupervisor, hideIfKYC }) => true
									).map(this.renderMenuItem)}
								</Menu>
								<div>
									<div className="bottom-side-top"></div>
									<Menu mode="vertical" style={{ lineHeight: '64px' }}>
										<Item className="custom-side-menu">
											<Link to="/admin/resources">
												<div className={'sidebar-menu'}>Resources</div>
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
										children
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
	// requestAvailPlugins: bindActionCreators(requestAvailPlugins, dispatch),
	logout: bindActionCreators(logout, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
